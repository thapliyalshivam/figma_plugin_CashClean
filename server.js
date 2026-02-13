const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, "dist");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".map": "application/json; charset=utf-8"
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname === "/") {
      pathname = "/ui.html";
    }

    const requestedPath = path.normalize(path.join(DIST_DIR, pathname));

    if (!requestedPath.startsWith(DIST_DIR)) {
      res.statusCode = 403;
      res.end("Forbidden");
      return;
    }

    fs.stat(requestedPath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.statusCode = 404;
        res.end("Not found");
        return;
      }

      const contentType = getContentType(requestedPath);
      const isHtml = path.extname(requestedPath).toLowerCase() === ".html";

      if (isHtml) {
        const stream = fs.createReadStream(requestedPath);
        res.statusCode = 200;
        res.setHeader("Content-Type", contentType);
        stream.on("error", () => {
          res.statusCode = 500;
          res.end("Internal server error");
        });
        stream.pipe(res);
        return;
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", contentType);
      const stream = fs.createReadStream(requestedPath);
      stream.on("error", () => {
        res.statusCode = 500;
        res.end("Internal server error");
      });
      stream.pipe(res);
    });
  } catch (e) {
    res.statusCode = 500;
    res.end("Internal server error");
  }
});

server.listen(PORT, () => {
  console.log(`Serving dist from ${DIST_DIR} at http://localhost:${PORT}`);
});

