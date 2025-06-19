export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Serve the static files directly
    if (["/styles.css", "/script.js"].includes(path)) {
      return env.ASSETS.fetch(request);
    }

    // Fallback: 404 for other paths
    return new Response("Not Found", { status: 404 });
  }
};
