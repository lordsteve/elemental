import 'module-alias/register';

import { IncomingMessage, ServerResponse } from 'http';
import DatabaseService from 'services/database/service';

import fs from 'fs';
import http from 'http';
import path from 'path';

import { SessionStorage } from 'models';
import { Security } from 'services';

require('dotenv').config();

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.url === '/csrf-token') {
        const token = Security.getCSRFToken();

        DatabaseService.insert<SessionStorage>([
            new SessionStorage(new Date(), 'test', token)
        ]);
        
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(token);

        return;
    }

    const www = path.join(__dirname, '..', '..', 'www');

    if (req.url?.endsWith('/')) {
        req.url = req.url + 'index.html';
    } else if (req.url !== undefined && findExtension(req.url) === req.url) {
        req.url = req.url + '/index.html';
    }

    try {
        fs.accessSync(path.join(www, req.url ?? ''));
    } catch {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
    }

    const page = fs.readFileSync(path.join(www, req.url ?? ''));
    if (!page) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
    }
    res.writeHead(200, { 'Content-Type': findContentType(findExtension(req.url ?? '')) });
    res.end(page);
});
const port = parseInt(process.env.PORT ?? '8080');
const host = process.env.HOST ?? 'localhost';
const reloadPort = process.env.RELOAD_PORT;
server.listen(port, host, () => {
    console.log(`Static server started on http://${host}:${port}.`);
    if (process.env.ENV === 'development' && reloadPort !== undefined)
        console.log(`Live reload server started on http://${host}:${reloadPort}.`);
});

function findExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
}

function findContentType(extension: string): string {
    switch (extension) {
        case 'html':
            return 'text/html';
        case 'css':
            return 'text/css';
        case 'js':
            return 'text/javascript';
        case 'json':
            return 'application/json';
        case 'png':
            return 'image/png';
        case 'jpg':
            return 'image/jpg';
        case 'txt':
            return 'text/plain';
        default:
            return 'application/octet-stream';
    }
}