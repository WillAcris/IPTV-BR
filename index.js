const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');

// --- Início da Configuração das Categorias ---
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
// --- Fim da Configuração das Categorias ---


const manifest = {
    id: 'iptv.br.addon.categorizado',
    version: '2.0.0',
    name: 'IPTV BR Categorizado',
    description: 'Addon IPTV com canais separados por categoria.',
    resources: ['stream', 'catalog', 'meta'],
    types: ['tv'],
    catalogs: CATEGORIES.map(cat => ({
        type: 'tv',
        id: cat.id,
        name: cat.name
    })),
    idPrefixes: ['iptv_'],
    logo: 'https://raw.githubusercontent.com/WillAcris/IPTV-BR-M3U/main/logo.png'
};

const builder = new addonBuilder(manifest);

let allItemsCache = null;
let lastFetchTime = 0;

async function loadM3U() {
    const now = Date.now();
    // Atualiza o cache a cada 10 minutos (600000 ms)
    if (allItemsCache && (now - lastFetchTime < 600000)) {
        return allItemsCache;
    }

    // URL do seu arquivo M3U no GitHub
    const url = 'https://raw.githubusercontent.com/WillAcris/IPTV-BR-M3U/refs/heads/main/IPTV-BR.M3U';
    
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
                const name = line.split(',').pop();
                const logoMatch = line.match(logoRegex);
                const groupMatch = line.match(groupRegex);

                const logo = logoMatch ? logoMatch[1] : defaultLogo;
                const group = groupMatch ? groupMatch[1] : 'Outros Canais Abertos';

                if (i + 1 < lines.length) {
                    const streamUrl = lines[i + 1].trim();
                    if (streamUrl && !streamUrl.startsWith('#')) {
                        items.push({
                            name: name,
                            logo: logo,
                            group: group,
                            url: streamUrl,
                            // Usar um ID único baseado na URL para evitar conflitos com nomes iguais
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
        // Se der erro, retorna o cache antigo (se existir) para não quebrar o addon
        return allItemsCache || [];
    }
}

builder.defineCatalogHandler(async ({ id }) => {
    console.log(`Request for catalog: ${id}`);
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

// Carrega o M3U na inicialização para popular o cache
loadM3U();