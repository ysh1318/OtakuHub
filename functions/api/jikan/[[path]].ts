interface EventContext {
  request: Request;
  functionPath: string;
  params: Record<string, string | string[]>;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: Record<string, any>;
}

export async function onRequest(context: EventContext): Promise<Response> {
  const { request, params } = context;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(request.url);
  const rawPath = params.path;
  const subPath = Array.isArray(rawPath) ? rawPath.join("/") : (rawPath || "");
  const queryStr = url.search || "";

  // 1. Check Cloudflare Edge Cache
  const cacheKey = new Request(`https://otakuhub.pages.dev/api/jikan/${subPath}${queryStr}`, { method: "GET" });
  let cache: any = null;
  try {
    if (typeof (caches as any) !== "undefined" && (caches as any).default) {
      cache = (caches as any).default;
      const cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        const response = new Response(cachedResponse.body, cachedResponse);
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("X-Proxy-Cache", "HIT");
        return response;
      }
    }
  } catch {
    // Cache lookup failed, continue to network fetch
  }

  // Upstream endpoints (Tenrai is the active Jikan v4 drop-in mirror)
  const upstreams = [
    `https://api.tenrai.org/v4/${subPath}${queryStr}`,
    `https://api.jikan.moe/v4/${subPath}${queryStr}`
  ];

  let lastError: any = null;

  for (const upstreamUrl of upstreams) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(upstreamUrl, {
          headers: {
            "Accept": "application/json",
            "User-Agent": "OtakuHub/1.0 (Cloudflare Pages Edge Proxy; +https://otakuhub.pages.dev)",
          },
        });

        // Handle 429 Rate Limiting
        if (response.status === 429) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }

        if (!response.ok) {
          // If 404 or 5xx, try next upstream
          break;
        }

        // Clone response & normalize headers
        const headers = new Headers(response.headers);
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "*");
        headers.set("X-Proxy-Cache", "MISS");

        // Cache at edge for 15 minutes (900s), in browser for 5 minutes (300s)
        headers.set("Cache-Control", "public, max-age=300, s-maxage=900, stale-while-revalidate=1800");

        const proxyResponse = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });

        // Save to Cloudflare Edge Cache
        if (cache) {
          try {
            context.waitUntil(cache.put(cacheKey, proxyResponse.clone()));
          } catch {
            // Ignore cache write errors
          }
        }

        return proxyResponse;
      } catch (err: any) {
        lastError = err;
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
      }
    }
  }

  // Fallback error response
  return new Response(
    JSON.stringify({
      error: "Upstream anime API failed or unavailable",
      details: lastError?.message || String(lastError),
    }),
    {
      status: 502,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
