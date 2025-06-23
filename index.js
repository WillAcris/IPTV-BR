const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');

const manifest = {
    id: 'iptv.addon',
    version: '1.0.0',
    name: 'IPTV BR',
    description: 'Addon IPTV baseado em lista M3U',
    resources: ['stream', 'catalog', 'meta'],
    types: ['tv'],
    catalogs: [
        {
            type: 'tv',
            id: 'iptv_br',
            name: 'Canais IPTV'
        }
    ],
    idPrefixes: ['iptv_'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Stremio_logo.svg/512px-Stremio_logo.svg.png',
    behaviorHints: {
        adult: false
    }
};

const builder = new addonBuilder(manifest);

async function loadM3U() {
    const url = 'https://raw.githubusercontent.com/ManoLimah/Manoteste/refs/heads/main/ManoTV.m3u';
    const res = await axios.get(url);
    const lines = res.data.split('\n');
    const items = [];
    let current = {};
    for (let line of lines) {
        line = line.trim();
        if (line.startsWith('#EXTINF:')) {
            const name = line.split(',').pop();
            current = { name };
        } else if (line && !line.startsWith('#')) {
            current.url = line;
            current.id = 'iptv_' + Buffer.from(current.name).toString('base64');
            items.push({ ...current });
            current = {};
        }
    }
    return items;
}

builder.defineCatalogHandler(async () => {
    const items = await loadM3U();
    const metas = items.map(item => ({
        id: item.id,
        type: 'tv',
        name: item.name,
        poster: 'https://img.icons8.com/color/480/tv.png',
        description: 'Canal ao vivo'
    }));
    return { metas };
});

builder.defineMetaHandler(async ({ id }) => {
    const items = await loadM3U();
    const meta = items.find(i => i.id === id);
    if (!meta) throw new Error('Canal não encontrado');
    return {
        meta: {
            id: meta.id,
            type: 'tv',
            name: meta.name,
            poster: 'https://img.icons8.com/color/480/tv.png',
            description: 'Canal ao vivo'
        }
    };
});

builder.defineStreamHandler(async ({ id }) => {
    const items = await loadM3U();
    const meta = items.find(i => i.id === id);
    if (!meta) throw new Error('Canal não encontrado');
    return {
        streams: [
            {
                title: meta.name,
                url: meta.url
            }
        ]
    };
});

serveHTTP(builder.getInterface(), { port: 7000 });