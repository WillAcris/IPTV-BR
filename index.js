const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');

const CATEGORIES = [
    { id: 'cat_globo', name: 'Canais Globo' },
    { id: 'cat_record', name: 'Canais Record' },
    { id: 'cat_sbt', name: 'Canais SBT' },
    { id: 'cat_band', name: 'Canais Band' },
    { id: 'cat_filmes', name: 'Filmes e Séries' },
    { id: 'cat_esportes', name: 'Esportes' },
    { id: 'cat_infantil', name: 'Infantil' },
    { id: 'cat_variedades', name: 'Variedades' },
    { id: 'cat_animes', name: 'Animes' },
    { id: 'cat_aberto', name: 'Outros Canais Abertos' },
];

const manifest = {
    id: 'iptv.br.addon',
    version: '2.0.0',
    name: 'IPTV BR',
    description: 'Addon IPTV com canais separados por categoria.',
    resources: ['stream', 'catalog', 'meta'],
    types: ['tv'],
    catalogs: CATEGORIES.map(cat => ({
        type: 'tv',
        id: cat.id,
        name: cat.name
    })),
    idPrefixes: ['iptv_'],
    logo: 'https://img.icons8.com/color/480/tv.png'
};

const builder = new addonBuilder(manifest);

let allItemsCache = null;
let lastFetchTime = 0;

async function loadM3U() {
    const now = Date.now();
    if (allItemsCache && (now - lastFetchTime < 600000)) {
        return allItemsCache;
    }

    const url = 'https://raw.githubusercontent.com/WillAcris/IPTV-BR-M3U/refs/heads/main/IPTV-BR.m3u';

    try {
        const res = await axios.get(url);
        const lines = res.data.split('\n');
        const items = [];

        const logoRegex = /tvg-logo="([^"]+)"/;
        const groupRegex = /group-title="([^"]+)"/;
        const defaultLogo = 'https://img.icons8.com/color/480/tv.png';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('#EXTINF:')) {
                const name = line.split(',').pop().replace(/Manotv|MANOTV|manotv/gi, '').trim();
                const logoMatch = line.match(logoRegex);
                const groupMatch = line.match(groupRegex);

                const logo = logoMatch ? logoMatch[1] : defaultLogo;
                const group = groupMatch ? groupMatch[1].replace(/Manotv|MANOTV|manotv/gi, '').trim() : 'Outros Canais Abertos';

                if (i + 1 < lines.length) {
                    const streamUrl = lines[i + 1].trim();
                    if (streamUrl && !streamUrl.startsWith('#')) {
                        items.push({
                            name: 'IPTV_BR ' + name,
                            logo: logo,
                            group: group,
                            url: streamUrl,
                            id: 'iptv_' + Buffer.from(streamUrl).toString('base64')
                        });
                        i++;
                    }
                }
            }
        }
        allItemsCache = items;
        lastFetchTime = now;
        console.log(`Cache atualizado com ${items.length} itens.`);
        return items;
    } catch (error) {
        console.error('Erro ao buscar ou processar o arquivo M3U:', error.message);
        return allItemsCache || [];
    }
}

builder.defineCatalogHandler(async ({ id }) => {
    const allItems = await loadM3U();
    const requestedCategoryName = CATEGORIES.find(cat => cat.id === id)?.name;
    if (!requestedCategoryName) {
        return { metas: [] };
    }

    const metas = allItems
        .filter(item => item.group === requestedCategoryName)
        .map(item => ({
            id: item.id,
            type: 'tv',
            name: item.name,
            poster: item.logo,
            description: item.group
        }));

    return { metas };
});

builder.defineMetaHandler(async ({ id }) => {
    const items = await loadM3U();
    const item = items.find(i => i.id === id);
    if (!item) throw new Error('Canal não encontrado');

    return {
        meta: {
            id: item.id,
            type: 'tv',
            name: item.name,
            poster: item.logo,
            description: 'Canal ao vivo'
        }
    };
});

builder.defineStreamHandler(async ({ id }) => {
    const items = await loadM3U();
    const item = items.find(i => i.id === id);
    if (!item) throw new Error('Canal não encontrado');

    return { streams: [{ title: item.name, url: item.url }] };
});

const port = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port });
console.log(`Addon rodando na porta: ${port}`);

loadM3U();
