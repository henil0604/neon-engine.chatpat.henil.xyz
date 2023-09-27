const Schema = {
    '/': await import('@/routes/index.js'),
};


export default function getRouterFactory(path: keyof typeof Schema) {
    return Schema[path].factory;
}