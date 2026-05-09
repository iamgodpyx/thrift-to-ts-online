import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const htmlEntryPath = path.join(distDir, "html", "main", "index.html");
const outputIndexPath = path.join(distDir, "index.html");
const output404Path = path.join(distDir, "404.html");
const noJekyllPath = path.join(distDir, ".nojekyll");

const githubPagesBasePath =
  process.env.GITHUB_PAGES_BASE_PATH || "/thrift-to-ts-online";
const normalizedGitHubPagesBasePath =
  githubPagesBasePath === "/"
    ? "/"
    : `/${githubPagesBasePath.replace(/^\/+|\/+$/g, "")}/`;
const pathSegmentsToKeep = normalizedGitHubPagesBasePath
  .split("/")
  .filter(Boolean).length;

const redirectScript = `<script>
  (function(l) {
    if (l.search[1] === "/") {
      var decoded = l.search
        .slice(1)
        .split("&")
        .map(function(s) {
          return s.replace(/~and~/g, "&");
        })
        .join("?");
      window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
    }
  }(window.location));
</script>`;

const notFoundHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>GitHub Pages SPA Redirect</title>
    <script>
      var pathSegmentsToKeep = ${pathSegmentsToKeep};
      var l = window.location;
      l.replace(
        l.protocol +
          "//" +
          l.hostname +
          (l.port ? ":" + l.port : "") +
          l.pathname.split("/").slice(0, 1 + pathSegmentsToKeep).join("/") +
          "/?/" +
          l.pathname.slice(1).split("/").slice(pathSegmentsToKeep).join("/").replace(/&/g, "~and~") +
          (l.search ? "&" + l.search.slice(1).replace(/&/g, "~and~") : "") +
          l.hash
      );
    </script>
  </head>
  <body></body>
</html>
`;

function injectRedirectScript(html) {
  if (html.includes("window.history.replaceState") && html.includes("~and~")) {
    return html;
  }

  if (html.includes("<script")) {
    return html.replace("<script", `${redirectScript}\n<script`);
  }

  if (html.includes("</head>")) {
    return html.replace("</head>", `${redirectScript}\n</head>`);
  }

  return `${redirectScript}\n${html}`;
}

async function main() {
  const html = await readFile(htmlEntryPath, "utf8");
  const outputHtml = injectRedirectScript(html);

  await mkdir(distDir, { recursive: true });
  await writeFile(outputIndexPath, outputHtml);
  await writeFile(output404Path, notFoundHtml);
  await writeFile(noJekyllPath, "");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
