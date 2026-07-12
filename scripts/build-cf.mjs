import { execSync } from "node:child_process";

// Cross-platform way to enable the static export for Cloudflare builds.
process.env.CF_BUILD = "1";
execSync("next build", { stdio: "inherit" });
