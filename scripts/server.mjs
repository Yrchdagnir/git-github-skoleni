import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { extname, relative, resolve } from "node:path";

const host = "127.0.0.1";
const port = 4173;
const root = resolve(".");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

createServer((request, response) => {
  const pathname = new URL(request.url ?? "/", `http://${host}:${port}`).pathname;
  const decodedPath = decodeURIComponent(pathname);
  const requestPath = decodedPath.endsWith("/") ? `${decodedPath}index.html` : decodedPath;
  const filePath = resolve(root, `.${requestPath}`);
  const relativePath = relative(root, filePath);

  if (relativePath.startsWith("..") || relativePath.includes("..\\")) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  const stream = createReadStream(filePath);
  stream.on("open", () => {
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream"
    });
    stream.pipe(response);
  });
  stream.on("error", () => response.writeHead(404).end("Not found"));
}).listen(port, host, () => {
  console.log(`Potion Archive running at http://${host}:${port}`);
});
