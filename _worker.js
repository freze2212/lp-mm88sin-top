import DOMAIN_MAPPINGS from "./domains.json";

function pickUrl(entry) {
  if (!entry) return null;
  if (typeof entry === "string") return entry;
  return entry.main_url || entry.target_url || entry.register_url || entry.url || null;
}

function resolveTargetUrl(cleanHost) {
  const map = DOMAIN_MAPPINGS || {};
  if (map[cleanHost]) return pickUrl(map[cleanHost]);
  const targetHost = (cleanHost || "").toLowerCase();
  for (const [key, val] of Object.entries(map)) {
    if (key.replace(/^www\./i, "").toLowerCase() === targetHost) {
      return pickUrl(val);
    }
  }
  return pickUrl(map._default) || "https://mm88e9e23qc.mm2188.com/register.html";
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const rawHost = request.headers.get("host") || url.hostname || "";
    const cleanHost = rawHost.replace(/^www\./i, "").split(":")[0].toLowerCase();
    const targetUrl = resolveTargetUrl(cleanHost);

    if (path === "/api/domain-config") {
      return new Response(JSON.stringify({ success: true, host: cleanHost, targetUrl }), {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    if (path === "/go" || path === "/register" || path === "/dang-ky") {
      return Response.redirect(targetUrl, 302);
    }

    return env.ASSETS ? env.ASSETS.fetch(request) : fetch(request);
  }
};
