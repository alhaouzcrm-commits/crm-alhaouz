// Step 1 of the admin-panel sign-in: send the editor to GitHub to approve access.
// Needs GITHUB_CLIENT_ID (and GITHUB_CLIENT_SECRET for /api/callback) in Vercel.
const crypto = require("crypto");

module.exports = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("GITHUB_CLIENT_ID is not configured on Vercel.");
    return;
  }
  const state = crypto.randomBytes(16).toString("hex");
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", `https://${host}/api/callback`);
  authorize.searchParams.set("scope", "public_repo,read:user");
  authorize.searchParams.set("state", state);
  res.writeHead(302, {
    Location: authorize.toString(),
    "Set-Cookie": `cms_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    "Cache-Control": "no-store",
  });
  res.end();
};
