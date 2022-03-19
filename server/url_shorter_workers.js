/*
* Cloudflare Workers
* URL shorter service for PyWebIO playground
*
* Require: Set `KVStore` as KV namespace of the Workers: https://developers.cloudflare.com/workers/runtime-apis/kv#kv-bindings
* */

addEventListener("fetch", (event) => {
    event.respondWith(
        handleRequest(event.request).catch(
            (err) => new Response(err.stack, {status: 500})
        )
    );
});

async function md5(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder('utf-8').encode(message);
    // hash the message
    const hashBuffer = await crypto.subtle.digest('MD5', msgBuffer);
    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // convert bytes to hex string
    return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
}

const PLAYGROUND_ADDRESS = "https://play.pywebio.online"  // Attention: no '/' subfix needed.
const expirationTtl = 3600 * 24 * 365

const cors_headers = {
    headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': PLAYGROUND_ADDRESS,
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Max-Age': 365 * 1440 * 60
    },
}

async function handleRequest(request) {
    const {pathname} = new URL(request.url);
    if (request.method === 'OPTIONS') {
        if (request.headers.get('Origin') !== PLAYGROUND_ADDRESS)
            return new Response('deny');
        return new Response('', cors_headers);
    }

    if (request.method === 'POST') {
        let content = await request.text();
        let key = await md5(content);
        await KVStore.put(key, content, {expirationTtl});
        return new Response(JSON.stringify({key}), cors_headers);
    }

    let key = pathname.slice(1);
    if (key.length === 0)
        return Response.redirect(PLAYGROUND_ADDRESS);

    let content = await KVStore.get(pathname.slice(1));
    let url = content === null ? PLAYGROUND_ADDRESS : PLAYGROUND_ADDRESS + '/#' + content;
    return Response.redirect(url, 301);

}