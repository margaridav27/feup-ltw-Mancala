const fs = require('fs');
const path = require('path');

const documentRoot = '/net/areas/homes/up201907907/public_html';
const defaultIndex = 'index.html';
const mediaTypes = {
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  gif: 'image/gif',
};

function getMediaType(pathname) {
  const lastDot = pathname.lastIndexOf('.');
  let mediaType;
  if (lastDot !== -1) mediaType = mediaTypes[pathname.substring(lastDot + 1)];
  if (mediaType === undefined) mediaType = 'text/plain';
  return mediaType;
}

function isText(mediaType) {
  return !mediaType.startsWith('image');
}

function getPathname(request) {
  let pathname = path.normalize(documentRoot + request.url);
  if (!pathname.startsWith(documentRoot)) pathname = null;
  return pathname;
}

function doGetPathname(pathname, response) {
  const mediaType = getMediaType(pathname);
  const encoding = isText(mediaType) ? 'utf-8' : null;

  fs.readFile(pathname, encoding, (err, data) => {
    if (err) {
      response.writeHead(404);
      response.end();
    } else {
      response.writeHead(200, { 'Content-Type': mediaType });
      response.end(data);
    }
  });
}

module.exports.processRequest = function (request, response) {
  const pathname = getPathname(request);

  if (pathname === null) {
    response.writeHead(403);
    response.end();
  } else {
    fs.stat(pathname, (err, stats) => {
      if (err) {
        response.writeHead(500);
        response.end();
      } else if (stats.isDirectory()) {
        if (pathname.endsWith('/')) {
          doGetPathname(pathname + defaultIndex, response);
        } else {
          response.writeHead(301, { Location: pathname + '/' });
          response.end();
        }
      } else {
        doGetPathname(pathname, response);
      }
    });
  }
};
