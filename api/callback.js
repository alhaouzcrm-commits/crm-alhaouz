// Step 2 of the admin-panel sign-in: GitHub sends the editor back here with a code.
// We swap it for a token and hand it to the /admin window (Decap CMS handshake).
const ALLOWED_ORIGINS = ["https://www.crm-alhaouz.online", "https://crm-alhaouz.online"];

export default async function handler(req, res) {
  const url = new URL(req.url, "https://placeholder");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookie = (req.headers.cookie || "").match(/(?:^|;\s*)cms_oauth_state=([a-f0-9]+)/);

  let status = "error";
  let content = { error: "invalid_request" };
  if (!code || !state || !cookie || cookie[1] !== state) {
    content = { error: "invalid_state" };
  } else {
    try {
      const r = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const data = await r.json();
      if (data.access_token) {
        status = "success";
        content = { token: data.access_token, provider: "github" };
      } else {
        content = { error: data.error_description || data.error || "no_token" };
      }
    } catch (e) {
      content = { error: "github_unreachable" };
    }
  }

  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const origins = [...new Set([...ALLOWED_ORIGINS, `https://${host}`])];
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const js = (v) => JSON.stringify(v).replace(/</g, "\\u003c");

  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "Set-Cookie": "cms_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
  });
  res.end(`<!doctype html><meta charset="utf-8"><title>تسجيل الدخول</title>
<p style="font-family:sans-serif;text-align:center;margin-top:40px">${status === "success" ? "تم تسجيل الدخول، يمكنك إغلاق هذه النافذة." : "تعذّر تسجيل الدخول: " + String(content.error).replace(/[<>&]/g, "")}</p>
<script>
(function () {
  var origins = ${js(origins)}, message = ${js(message)};
  function receive(e) {
    if (origins.indexOf(e.origin) === -1) return;
    window.opener.postMessage(message, e.origin);
    window.removeEventListener("message", receive, false);
  }
  if (!window.opener) return;
  window.addEventListener("message", receive, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>`);
}
