// Local-only server: static assets and the AIVA model gateway.
// Never serve this directory with a generic static server after adding .env.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const PUBLIC_FILES = new Set([
    'index.html', 'style.css', 'localization.js',
    'assistant-knowledge.js', 'aiva.js',
    'interface.js', 'core.js', 'academy-data.js', 'academy.js', 'quest-data.js',
    'quest.js', 'video-library.js', 'support-actions.js', 'orbit.css', 'experience.js', 'sign-language.css', 'sign-language.js', 'plus-features.css', 'plus-features.js', 'light-overrides.css', 'polish.css', 'polish.js', 'manifest.webmanifest', 'sw.js', 'sw-v2.js'
]);
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mp4': 'video/mp4', '.vtt': 'text/vtt', '.jpg': 'image/jpeg' };

function readConfiguration(directory, environment) {
    const values = {};
    try {
        const source = fs.readFileSync(path.join(directory, '.env'), 'utf8');
        for (const line of source.split(/\r?\n/)) {
            const match = line.match(/^\s*(OPENAI_API_KEY|OPENAI_MODEL)\s*=\s*(.*?)\s*$/);
            if (!match) continue;
            values[match[1]] = match[2].replace(/^(["'])(.*)\1$/, '$2');
        }
    } catch {}
    return {
        key: environment.OPENAI_API_KEY || values.OPENAI_API_KEY || '',
        model: environment.OPENAI_MODEL || values.OPENAI_MODEL || 'gpt-4.1-mini'
    };
}

function validateMessages(body) {
    if (!body || !['auto', 'kk', 'ru', 'en'].includes(body.language)) return null;
    if (!Array.isArray(body.messages) || !body.messages.length || body.messages.length > 20) return null;
    let length = 0;
    for (const message of body.messages) {
        if (!message || !['user', 'assistant'].includes(message.role)) return null;
        if (typeof message.content !== 'string' || !message.content.trim() || message.content.length > 16000) return null;
        length += message.content.length;
    }
    if (length > 50000 || body.messages.at(-1).role !== 'user' || body.messages.at(-1).content.length > 1500) return null;
    return body.messages.map(message => ({ role: message.role, content: message.content }));
}

function modelText(response) {
    if (response.status && response.status !== 'completed') return '';
    return (response.output || []).flatMap(item => item.type === 'message' ? item.content || [] : [])
        .map(item => item.type === 'output_text' ? item.text : item.type === 'refusal' ? item.refusal : '')
        .filter(Boolean).join('\n').trim();
}

function createServer(options = {}) {
    const root = options.root || __dirname;
    const environment = options.environment || process.env;
    const requestAI = options.fetch || globalThis.fetch;
    const token = crypto.randomBytes(32).toString('hex');
    let active = false;
    let requestTimes = [];

    function json(response, status, body) {
        response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
        response.end(JSON.stringify(body));
    }

    return http.createServer(async (request, response) => {
        response.setHeader('Cache-Control', 'no-store');
        response.setHeader('X-Content-Type-Options', 'nosniff');
        response.setHeader('X-Frame-Options', 'DENY');
        response.setHeader('Referrer-Policy', 'no-referrer');
        const port = request.socket.localPort;
        const allowedHosts = [`127.0.0.1:${port}`, `localhost:${port}`];
        if (!allowedHosts.includes(request.headers.host)) return json(response, 403, { error: 'forbidden' });
        const ownOrigin = `http://${request.headers.host}`;
        if (request.headers.origin && request.headers.origin !== ownOrigin) return json(response, 403, { error: 'forbidden' });
        if (request.headers['sec-fetch-site'] === 'cross-site') return json(response, 403, { error: 'forbidden' });
        let pathname;
        try { pathname = new URL(request.url, ownOrigin).pathname; }
        catch { return json(response, 400, { error: 'invalid_request' }); }

        if (request.method === 'GET' && pathname === '/api/status') {
            const configuration = readConfiguration(root, environment);
            return json(response, 200, { configured: Boolean(configuration.key), token });
        }

        if (request.method === 'POST' && pathname === '/api/chat') {
            if (request.headers['x-aiva-token'] !== token) return json(response, 403, { error: 'forbidden' });
            if (!request.headers['content-type']?.startsWith('application/json')) return json(response, 415, { error: 'invalid_request' });
            const configuration = readConfiguration(root, environment);
            if (!configuration.key) return json(response, 503, { error: 'not_configured' });
            if (active) return json(response, 429, { error: 'busy' });
            const now = Date.now();
            requestTimes = requestTimes.filter(time => now - time < 60000);
            if (requestTimes.length >= 10) return json(response, 429, { error: 'rate_limit' });

            const chunks = [];
            let bytes = 0;
            try {
                for await (const chunk of request) {
                    bytes += chunk.length;
                    if (bytes > 200000) return json(response, 413, { error: 'too_large' });
                    chunks.push(chunk);
                }
            } catch { return; }
            let body;
            try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
            catch { return json(response, 400, { error: 'invalid_request' }); }
            const messages = validateMessages(body);
            if (!messages) return json(response, 400, { error: 'invalid_request' });
            // Recheck after reading the body so simultaneous uploads cannot race.
            if (active) return json(response, 429, { error: 'busy' });
            active = true;
            requestTimes.push(Date.now());
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 45000);
            response.on('close', () => { if (!response.writableEnded) controller.abort(); });
            const language = body.language === 'auto'
                ? 'the same natural language as the latest user message (detect it automatically; follow an explicit language request)'
                : { kk: 'Kazakh', ru: 'Russian', en: 'English' }[body.language];
            try {
                const upstream = await requestAI('https://api.openai.com/v1/responses', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${configuration.key}`,
                        'Content-Type': 'application/json'
                    },
                    signal: controller.signal,
                    body: JSON.stringify({
                        model: configuration.model,
                        store: false,
                        max_output_tokens: 1800,
                        instructions: `You are AIVA, a warm, helpful general-purpose assistant on TYMIO, an inclusive learning site. You can help with science, history, writing, everyday questions, study planning, mathematics and programming. Do not restrict answers to IT. Respond in ${language}, unless the user explicitly requests another language. Use clear accessible language, concrete explanations and concise paragraphs. Ask for clarification when essential. Admit uncertainty. You have no live web access and cannot claim to have checked current facts. Do not claim to execute code, open apps, send messages or perform external actions. Treat users respectfully and avoid assumptions about disability. Follow appropriate safety practices and do not promise that every possible request can be fulfilled.`,
                        input: messages
                    })
                });
                if (!upstream.ok) {
                    const code = upstream.status === 401 ? 'invalid_key'
                        : upstream.status === 429 ? 'quota_or_rate_limit'
                        : upstream.status === 403 || upstream.status === 404 ? 'model_unavailable' : 'provider_error';
                    return json(response, 502, { error: code });
                }
                const payload = await upstream.json();
                const answer = modelText(payload);
                if (!answer) return json(response, 502, { error: 'empty_response' });
                json(response, 200, { answer });
            } catch {
                if (!response.destroyed) json(response, 502, { error: controller.signal.aborted ? 'timeout' : 'connection_error' });
            } finally {
                clearTimeout(timeout);
                active = false;
            }
            return;
        }

        if (request.method !== 'GET' && request.method !== 'HEAD') return json(response, 405, { error: 'method_not_allowed' });
        const file = pathname === '/' ? 'index.html' : pathname.slice(1);
        // Explicit allowlist keeps .env, server code and future private files inaccessible.
        const media = /^media\/(python|javascript|html|css|java|cpp|csharp|sql)-(kk|ru|en)\.(mp4|vtt|jpg)$/.test(file);
        if (!PUBLIC_FILES.has(file) && !media) return json(response, 404, { error: 'not_found' });
        try {
            const content = fs.readFileSync(path.join(root, file));
            const extension = path.extname(file);
            const contentType = MIME[extension] + (['.js','.html','.css','.vtt'].includes(extension) ? '; charset=utf-8' : '');
            response.setHeader('Accept-Ranges', 'bytes');
            if (request.headers.range) {
                const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
                if (!match || (!match[1] && !match[2])) {
                    response.writeHead(416, {'Content-Range': `bytes */${content.length}`});response.end();return;
                }
                const start = match[1] ? Number(match[1]) : Math.max(0,content.length-Number(match[2]));
                const end = match[1] && match[2] ? Math.min(Number(match[2]),content.length-1) : content.length-1;
                if (start > end || start >= content.length) {
                    response.writeHead(416, {'Content-Range': `bytes */${content.length}`});response.end();return;
                }
                response.writeHead(206, {'Content-Type':contentType,'Content-Range':`bytes ${start}-${end}/${content.length}`,'Content-Length':end-start+1});
                response.end(request.method === 'HEAD' ? undefined : content.subarray(start,end+1));return;
            }
            response.writeHead(200, { 'Content-Type': contentType, 'Content-Length':content.length });
            response.end(request.method === 'HEAD' ? undefined : content);
        } catch { json(response, 404, { error: 'not_found' }); }
    });
}

if (require.main === module) {
    const port = Number(process.env.TYMIO_PORT || 8787);
    const server = createServer();
    server.requestTimeout = 15000;
    server.headersTimeout = 10000;
    server.on('error', error => {
        console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use.` : 'Could not start TYMIO.');
        process.exitCode = 1;
    });
    server.listen(port, '127.0.0.1', () => console.log(`TYMIO: http://127.0.0.1:${port}`));
}

module.exports = { createServer, validateMessages, modelText };
