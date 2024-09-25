import 'module-alias/register';

import fs from 'fs';
import http from 'http';
import path from 'path';


import { Security } from 'services';

require('dotenv').config();

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    const { method, headers } = req;
    let { url } = req;
    
    if (method !== 'GET') {
        let valid = Security.validateCSRFToken(headers['X-CSRF-TOKEN'] as string);
        if (!valid) {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain');
            res.end('403 Forbidden');
        }
    }

    switch (url) {
        case '/favicon.ico':
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('404 Not Found');
            break;
        case '/csrf-token':
            const token = Security.getCSRFToken();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end(token);
            break;
        default:
            if (url?.startsWith('/views/') && headers['x-requested-with'] !== 'Elemental') {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'text/plain');
                res.end('403 Forbidden');
            } else {
                const www = path.join(__dirname, '..', '..', 'www');

                if (url?.endsWith('/')) {
                    url = url + 'index.html';
                } else if (url !== undefined && findExtension(url) === url) {
                    url = url + '/index.html';
                }

                try {
                    const file = fs.readFileSync(path.join(www, url ?? ''));
                    res.statusCode = 200;
                    res.setHeader('Content-Type', findContentType(findExtension(url ?? '')));
                    res.end(file);
                } catch {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('404 Not Found');
                }
            }
            break;
    }

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