const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');

const M3U_URL = 'http://abre.ai/manotv3';
const CATEGORIES = [
  { id: 'cat_globo', name: 'Canais Globo', keywords: ['globo', 'ge tv'] },
  { id: 'cat_record', name: 'Canais Record', keywords: ['record'] },
  { id: 'cat_sbt', name: 'Canais SBT', keywords: ['sbt'] },
  { id: 'cat_band', name: 'Canais Band', keywords: ['band'] },
  { id: 'cat_sportv', name: 'SporTV', keywords: ['sportv'] },
  { id: 'cat_espn', name: 'ESPN', keywords: ['espn'] },
  { id: 'cat_esportes', name: 'Esportes', keywords: ['esportes', 'premiere', 'futebol', 'libertadores', 'cazé', 'desempedido', 'nsports'] },
  { id: 'cat_filmes', name: 'Filmes e Séries', keywords: ['filmes', 'series', 'séries', 'telecine', 'space', 'tnt', 'south park', 'runtime', 'cine', 'movies'] },
  { id: 'cat_noticias', name: 'Notícias', keywords: ['notícias', 'noticias', 'news', 'cnn'] },
  { id: 'cat_infantil', name: 'Infantil', keywords: ['infantil', 'kids', 'cartoon', 'nick'] },
  { id: 'cat_animes', name: 'Animes & Geek', keywords: ['animes', 'geek', 'loading'] },
  { id: 'cat_musica', name: 'Música', keywords: ['música', 'musica', 'music', 'mtv'] },
  { id: 'cat_variedades', name: 'Variedades', keywords: ['variedades', 'discovery', 'animal', 'food', 'investigação'] },
  { id: 'cat_novelas', name: 'Novelas', keywords: ['novelas', 'televisa', 'telenovelas'] },
  { id: 'cat_reality', name: 'Reality Shows', keywords: ['reality', 'masterchef', 'shark tank'] },
  { id: 'cat_comedia', name: 'Comédia', keywords: ['comédia', 'comedia', 'comedy', 'kenan', 'failarmy'] },
  { id: 'cat_lutas', name: 'Lutas', keywords: ['lutas', 'fight', 'combat', 'ufc', 'pfl'] },
  { id: 'cat_internacional', name: 'Internacional', keywords: ['internacional', 'sic', 'rtp', 'tvi', 'cnn international'] },
  { id: 'cat_pluto', name: 'Pluto TV', keywords: ['pluto'] },
  { id: 'cat_aberto', name: 'Canais Abertos', keywords: ['aberto', 'cultura', 'tve', 'redtv', 'brasil'] },
  { id: 'cat_radio', name: 'Rádios', keywords: ['rádio', 'radio'] }
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
const CACHE_DURATION = 300000;

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
      const url = (lines[i + 1] || '').trim();

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
  const category = CATEGORIES.find(c => c.id === id);
  
  if (!category) {
    return { metas: [] };
  }
  
  const metas = items
    .filter(ch => {
      const groupLower = ch.group.toLowerCase();
      return category.keywords.some(keyword => groupLower.includes(keyword.toLowerCase()));
    })
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
