const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');

const M3U_URL = 'https://raw.githubusercontent.com/WillAcris/IPTV-BR-M3U/refs/heads/main/IPTV-BR.m3u';

// Categorias conforme solicitado
const CATEGORIES = [
  { id: 'cat_globo', name: 'Canais Globo' },
  { id: 'cat_record', name: 'Canais Record' },
  { id: 'cat_sbt', name: 'Canais SBT' },
  { id: 'cat_band', name: 'Canais Band' },
  { id: 'cat_esportes', name: 'Esportes' },
  { id: 'cat_filmes', name: 'Filmes e Séries' },
  { id: 'cat_noticias', name: 'Notícias' },
  { id: 'cat_documentarios', name: 'Documentários' },
  { id: 'cat_infantil', name: 'Infantil' },
  { id: 'cat_musica', name: 'Música' },
  { id: 'cat_variedades', name: 'Variedades' },
  { id: 'cat_religiao', name: 'Religião' },
  { id: 'cat_internacional', name: 'Internacionais' },
  { id: 'cat_24h', name: 'Canais 24h' },
  { id: 'cat_aberto', name: 'Outros Canais Abertos' },
];

const manifest = {
  id: 'iptv.br.addon',
  version: '1.0.0',
  name: 'IPTV BR',
  description: 'Addon IPTV.',
  resources: ['catalog', 'stream', 'meta'],
  types: ['tv'],
  catalogs: CATEGORIES.map(cat => ({ type: 'tv', id: cat.id, name: cat.name })),
  idPrefixes: ['iptv_'],
  logo: 'https://img.icons8.com/color/480/tv.png'
};

const builder = new addonBuilder(manifest);

let cache = null;
let cacheTime = 0;
const CACHE_DURATION = 300000; // 5 minutos

async function loadM3U() {
  const now = Date.now();
  if (cache && (now - cacheTime < CACHE_DURATION)) return cache;

  const res = await axios.get(M3U_URL);
  const lines = res.data.split('\n');
  const items = [];

  const logoRegex = /tvg-logo="([^"]+)"/;
  const groupRegex = /group-title="([^"]+)"/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXTINF:')) {
      const logoMatch = line.match(logoRegex);
      const groupMatch = line.match(groupRegex);
      const logo = logoMatch ? logoMatch[1] : 'https://img.icons8.com/color/480/tv.png';
      const group = groupMatch ? groupMatch[1] : 'Outros Canais Abertos';

      const name = line.substring(line.indexOf(',') + 1).trim();

      const url = (lines[i+1]||'').trim();
      if (url && !url.endsWith('.mp4')) {
        items.push({
          id: 'iptv_' + Buffer.from(url).toString('base64'),
          name,
          logo,
          group,
          url
        });
        i++;
      }
    }
  }

  cache = items;
  cacheTime = now;
  console.log(`IPTV BR: carregados ${items.length} canais.`);
  return items;
}

builder.defineCatalogHandler(async ({ id }) => {
  const items = await loadM3U();
  const category = CATEGORIES.find(c => c.id === id)?.name.toLowerCase();
  const metas = items
    .filter(ch => ch.group.toLowerCase().includes(category))
    .map(ch => ({
      id: ch.id,
      type: 'tv',
      name: ch.name,
      poster: ch.logo,
      description: ch.group
    }));
  return { metas };
});

builder.defineMetaHandler(async ({ id }) => {
  const items = await loadM3U();
  const ch = items.find(x => x.id === id);
  if (!ch) throw new Error('Canal não encontrado');
  return {
    meta: { id: ch.id, type: 'tv', name: ch.name, poster: ch.logo, description: ch.group }
  };
});

builder.defineStreamHandler(async ({ id }) => {
  const items = await loadM3U();
  const ch = items.find(x => x.id === id);
  if (!ch) throw new Error('Stream não encontrado');
  return { streams: [{ title: ch.name, url: ch.url }] };
});

const port = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port });
console.log(`Addon iniciando na porta ${port}`);
loadM3U();
