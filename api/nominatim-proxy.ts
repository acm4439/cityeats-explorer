import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Proxies /nominatim/* → OpenStreetMap Nominatim with a valid User-Agent.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const fwdRaw = req.query.fwd;
  const fwd = Array.isArray(fwdRaw) ? fwdRaw[0] : fwdRaw;
  if (!fwd || typeof fwd !== "string") {
    res.status(400).json({ error: "Missing path" });
    return;
  }

  const pathPart = fwd.replace(/^\/+/, "");
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(req.query)) {
    if (k === "fwd") continue;
    if (v === undefined) continue;
    const arr = Array.isArray(v) ? v : [v];
    for (const val of arr) {
      if (typeof val === "string") sp.append(k, val);
    }
  }
  const qs = sp.toString();
  const url = `https://nominatim.openstreetmap.org/${pathPart}${qs ? `?${qs}` : ""}`;

  const upstream = await fetch(url, {
    method: req.method,
    headers: {
      Accept: "application/json",
      "User-Agent": "CityEatsExplorer/1.0 (contact via app owner)",
    },
  });

  const text = await upstream.text();
  res.status(upstream.status);
  const ct = upstream.headers.get("content-type");
  if (ct) res.setHeader("Content-Type", ct);
  res.send(text);
}
