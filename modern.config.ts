import { appTools, defineConfig } from "@modern-js/app-tools";
import { tailwindcssPlugin } from "@modern-js/plugin-tailwindcss";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath =
  process.env.GITHUB_PAGES_BASE_PATH || "/thrift-to-ts-online";
const normalizedGitHubPagesBasePath =
  githubPagesBasePath === "/"
    ? ""
    : `/${githubPagesBasePath.replace(/^\/+|\/+$/g, "")}`;

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  runtime: {
    router: {
      basename: isGitHubPages ? normalizedGitHubPagesBasePath : "",
    },
  },
  output: {
    assetPrefix:
      isGitHubPages && normalizedGitHubPagesBasePath
        ? `${normalizedGitHubPagesBasePath}/`
        : "/",
  },
  plugins: [
    appTools({
      bundler: "rspack", // Set to 'webpack' to enable webpack
    }),
    tailwindcssPlugin(),
  ],
  builderPlugins: [pluginNodePolyfill()],
});
