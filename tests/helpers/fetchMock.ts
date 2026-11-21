type FetchHandler = (url: string) => Response;

type Holder = {
  __weatherOriginalFetch?: typeof fetch;
  __weatherFetchUrls?: string[];
};

// Anclaje en globalThis para compartir el stub entre archivos de tests
const holder = globalThis as unknown as Holder;

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// Cola fija de respuestas; falla si el código hace más fetch de los previstos
export function respondWith(...responses: Response[]): FetchHandler {
  return () => {
    const response = responses.shift();
    if (response === undefined) {
      throw new Error("fetch inesperado: no quedan respuestas en la cola");
    }
    return response;
  };
}

export function stubFetch(handler: FetchHandler): void {
  holder.__weatherOriginalFetch ??= globalThis.fetch;
  const urls = (holder.__weatherFetchUrls ??= []);
  globalThis.fetch = ((input: string | URL | Request): Promise<Response> => {
    const url = String(input);
    urls.push(url);
    return Promise.resolve(handler(url));
  }) as typeof fetch;
}

export function requestedUrls(): string[] {
  return holder.__weatherFetchUrls ?? [];
}

export function restoreFetch(): void {
  if (holder.__weatherOriginalFetch !== undefined) {
    globalThis.fetch = holder.__weatherOriginalFetch;
  }
  if (holder.__weatherFetchUrls !== undefined) {
    holder.__weatherFetchUrls.length = 0;
  }
}
