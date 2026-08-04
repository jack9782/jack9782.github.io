// When using `.github/workflows/deploy-pages.yml` (publishes `web/` as Pages root):
//   site URL  → https://<user>.github.io/webapp-embed/
//   basePath  → "/webapp-embed/"
//
// If you instead serve the repo root from Pages without the workflow:
//   site URL  → https://<user>.github.io/webapp-embed/web/
//   basePath  → "/webapp-embed/web/"
//
// Local static server at http://localhost:PORT/ → use ""
window.APP_CONFIG = {
  basePath: "/embed-web/",
  externalDemoUrl: "https://jack9782.github.io",
};
