const Schema = {
    '/': await import('@/routes/index.js'),
    '/auth': await import("@/routes/auth/index.js"),
    '/auth/oauth': await import("@/routes/auth/oauth/index.js"),
    '/auth/oauth/github': await import('@/routes/auth/oauth/github/index.js'),
    '/auth/oauth/github/callback': await import("@/routes/auth/oauth/github/callback.js")
};


export default function getRouterFactory(path: keyof typeof Schema) {
    return Schema[path].factory;
}