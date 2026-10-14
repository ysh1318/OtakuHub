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
  const targetUrl = `https://api.jikan.moe/v4/${subPath}${url.search}`;

  // 1. Check Cloudflare Edge Cache
  const cacheKey = new Request(targetUrl, { method: "GET" });
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

  // 2. Fetch from Jikan API with retry & rate-limit handling
  let lastError: any = null;
  const maxAttempts = 3;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const jikanResponse = await fetch(targetUrl, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "OtakuHub/1.0 (Cloudflare Pages Edge Proxy; +https://otakuhub.pages.dev)",
        },
      });

      // Handle 429 Rate Limiting
      if (jikanResponse.status === 429) {
        const retryAfter = jikanResponse.headers.get("Retry-After");
        const delayMs = retryAfter ? Math.max(parseInt(retryAfter, 10) * 1000, 1500) : (attempt + 1) * 1200;
        await new Promise((r) => setTimeout(r, delayMs));
        continue;
      }

      // Clone response & normalize headers
      const headers = new Headers(jikanResponse.headers);
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
      headers.set("Access-Control-Allow-Headers", "*");
      headers.set("X-Proxy-Cache", "MISS");

      if (jikanResponse.status === 200) {
        // Cache at edge for 15 minutes (900s), in browser for 5 minutes (300s)
        headers.set("Cache-Control", "public, max-age=300, s-maxage=900, stale-while-revalidate=1800");
      }

      const proxyResponse = new Response(jikanResponse.body, {
        status: jikanResponse.status,
        statusText: jikanResponse.statusText,
        headers,
      });

      // Save to Cloudflare Edge Cache if 200 OK
      if (jikanResponse.status === 200 && cache) {
        try {
          context.waitUntil(cache.put(cacheKey, proxyResponse.clone()));
        } catch {
          // Ignore cache write errors
        }
      }

      return proxyResponse;
    } catch (err: any) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
    }
  }

  // 3. Fallback error response
  return new Response(
    JSON.stringify({
      error: "Upstream Jikan API failed or rate-limited",
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
