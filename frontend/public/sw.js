const CACHE_NAME = "fincontrol-static-v1";

const CORE_ASSETS = [
    "/manifest.json",
    "/favicon.svg",
    "/pwa-icon.svg",
    "/icons/pwa-192.png",
    "/icons/pwa-512.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);

            const response = await fetch("/index.html", {
                cache: "reload"
            });

            if (!response.ok) {
                throw new Error(
                    "Não foi possível armazenar a página inicial do FinControl."
                );
            }

            const html = await response.clone().text();

            await cache.put("/index.html", response.clone());
            await cache.put("/", response.clone());

            const assetPaths = [
                ...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)
            ]
                .map(([, assetPath]) => new URL(assetPath, self.location.origin))
                .filter(
                    (url) =>
                        url.origin === self.location.origin &&
                        url.pathname.startsWith("/assets/")
                )
                .map((url) => url.pathname);

            const assetsToCache = [
                ...new Set([...CORE_ASSETS, ...assetPaths])
            ];

            await cache.addAll(assetsToCache);

            await self.skipWaiting();
        })()
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();

            await Promise.all(
                cacheNames
                    .filter(
                        (cacheName) =>
                            cacheName.startsWith("fincontrol-") &&
                            cacheName !== CACHE_NAME
                    )
                    .map((cacheName) => caches.delete(cacheName))
            );

            await self.clients.claim();
        })()
    );
});

self.addEventListener("fetch", (event) => {
    const { request } = event;

    if (request.method !== "GET") {
        return;
    }

    const requestUrl = new URL(request.url);

    if (requestUrl.origin !== self.location.origin) {
        return;
    }

    if (request.mode === "navigate") {
        event.respondWith(
            (async () => {
                try {
                    const networkResponse = await fetch(request);

                    if (networkResponse.ok) {
                        const cache = await caches.open(CACHE_NAME);

                        await cache.put(
                            "/index.html",
                            networkResponse.clone()
                        );

                        return networkResponse;
                    }

                    return (
                        (await caches.match("/index.html")) ||
                        networkResponse
                    );
                } catch {
                    return (
                        (await caches.match("/index.html")) ||
                        (await caches.match("/")) ||
                        Response.error()
                    );
                }
            })()
        );

        return;
    }

    const isStaticAsset = [
        "script",
        "style",
        "font",
        "image"
    ].includes(request.destination);

    if (isStaticAsset) {
        event.respondWith(
            (async () => {
                const cachedResponse = await caches.match(request);

                if (cachedResponse) {
                    return cachedResponse;
                }

                try {
                    const networkResponse = await fetch(request);

                    if (networkResponse.ok) {
                        const cache = await caches.open(CACHE_NAME);

                        await cache.put(
                            request,
                            networkResponse.clone()
                        );
                    }

                    return networkResponse;
                } catch {
                    return Response.error();
                }
            })()
        );
    }
});