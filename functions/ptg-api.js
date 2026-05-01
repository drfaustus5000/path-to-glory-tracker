///// BEGIN — paste  this into functions/ptg-api/index.js /////
export default {
  async fetch(request, env) {
 const CORS_HEADERS = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
   "Access-Control-Allow-Headers": "Content-Type"
 };

 if (request.method === "OPTIONS") {
   return new Response(null, { status: 204, headers: CORS_HEADERS });
 }

 try {
   const url = new URL(request.url);

   if (request.method === "GET" && url.pathname.endsWith("/load")) {
 const user = url.searchParams.get("user");
 if (!user) return new Response("Missing user", { status: 400, headers: CORS_HEADERS });
 const data = await env.PTG_KV.get("ptg:" + user);
 return new Response(data || "[]", { status: 200, headers: { "Content-Type": "application/json", ...CORS_HEADERS } });
   }

   if (request.method === "POST" && url.pathname.endsWith("/save")) {
 const body = await request.json(); // { user, armies }
 if (!body || !body.user || !body.armies) return new Response("Bad request", { status: 400, headers: CORS_HEADERS });
 await env.PTG_KV.put("ptg:" + body.user, JSON.stringify(body.armies));
 return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json", ...CORS_HEADERS } });
   }

   return new Response("Not found", { status: 404, headers: CORS_HEADERS });
 } catch (err) {
   return new Response("Function error: " + String(err), { status: 500, headers: { "Content-Type":"text/plain", "Access-Control-Allow-Origin":"*" } });
 }

  }
};
///// END
