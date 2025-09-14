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
  id: 'com.iptv.brasil.addon',
  version: '3.0.0',
  name: 'IPTV Brasil',
  description: '🇧🇷 Acesso completo aos principais canais brasileiros de TV aberta, esportes, notícias, entretenimento e muito mais! Organize seus canais favoritos por categoria e assista à TV brasileira onde estiver.\n\n💰 Apoie o projeto: https://livepix.gg/willacris',
  
  // Informações do desenvolvedor
  contactEmail: 'willacris023@proton.me',
  
  // Apoie o projeto
  donationUrl: 'https://livepix.gg/willacris',
  
  // Recursos disponíveis
  resources: ['catalog', 'stream', 'meta'],
  types: ['tv'],
  
  // Catálogos organizados por categoria
  catalogs: CATEGORIES.map(cat => ({
    type: 'tv',
    id: cat.id,
    name: cat.name,
    extra: [
      {
        name: 'search',
        isRequired: false
      },
      {
        name: 'genre',
        isRequired: false,
        options: ['Ao Vivo', 'HD', 'FHD', 'SD']
      }
    ]
  })),
  
  // Prefixos de ID
  idPrefixes: ['iptv_'],
  
  // Configurações visuais
  logo: 'https://i.imgur.com/K8nVBQH.png',
  background: 'https://i.imgur.com/9sVqOoF.jpg',
  
  // Configurações de comportamento
  behaviorHints: {
    adult: false,
    p2p: false,
    configurable: false,
    configurationRequired: false
  }
};

const builder = new addonBuilder(manifest);

let cache = null;
let cacheTime = 0;
const CACHE_DURATION = 300000;

async function loadM3U() {
  const now = Date.now();
  if (cache && (now - cacheTime < CACHE_DURATION)) {
    console.log(`📋 IPTV Brasil: usando cache (${cache.length} canais)`);
    return cache;
  }

  try {
    console.log('🔄 IPTV Brasil: carregando lista de canais...');
    const res = await axios.get(M3U_URL, {
      timeout: 30000,
      headers: {
        'User-Agent': 'IPTV-Brasil-Addon/3.0.0'
      }
    });
    
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
        const group = groupMatch ? groupMatch[1] : 'Canais Abertos';

        const name = line.substring(line.indexOf(',') + 1).trim();
        const url = (lines[i + 1] || '').trim();

        // Filtrar URLs válidas e evitar arquivos de vídeo
        if (url && 
            !url.endsWith('.mp4') && 
            (url.startsWith('http') || url.startsWith('https')) &&
            name && name.length > 0) {
          
          items.push({
            id: 'iptv_' + Buffer.from(url).toString('base64').slice(0, 32),
            name: name.replace(/🔴/g, '').trim(), // Remove emoji vermelho
            logo,
            group,
            url
          });
          i++; // Pular a próxima linha (URL)
        }
      }
    }

    cache = items;
    cacheTime = now;
    console.log(`✅ IPTV Brasil: ${items.length} canais carregados com sucesso!`);
    return items;
    
  } catch (error) {
    console.error('❌ Erro ao carregar M3U:', error.message);
    
    // Se há cache anterior, usar como fallback
    if (cache && cache.length > 0) {
      console.log(`⚠️  Usando cache anterior (${cache.length} canais)`);
      return cache;
    }
    
    // Retornar lista vazia se não há cache
    console.log('📭 Retornando lista vazia devido ao erro');
    return [];
  }
}

builder.defineCatalogHandler(async ({ id }) => {
  try {
    const items = await loadM3U();
    const category = CATEGORIES.find(c => c.id === id);
    
    if (!category) {
      console.log(`⚠️  Categoria não encontrada: ${id}`);
      return { metas: [] };
    }
    
    const metas = items
      .filter(ch => {
        const groupLower = ch.group.toLowerCase();
        return category.keywords.some(keyword => 
          groupLower.includes(keyword.toLowerCase())
        );
      })
      .map(ch => ({
        id: ch.id,
        type: 'tv',
        name: ch.name,
        poster: ch.logo || 'https://img.icons8.com/color/480/tv.png',
        description: `📺 ${ch.group}`,
        genres: ['IPTV', 'Live TV'],
        releaseInfo: 'Ao Vivo'
      }))
      .slice(0, 100); // Limitar a 100 itens por categoria
    
    console.log(`📺 Categoria ${category.name}: ${metas.length} canais`);
    return { metas };
    
  } catch (error) {
    console.error(`❌ Erro no catalog handler:`, error.message);
    return { metas: [] };
  }
});

builder.defineMetaHandler(async ({ id }) => {
  try {
    const items = await loadM3U();
    const ch = items.find(x => x.id === id);
    
    if (!ch) {
      throw new Error(`Canal não encontrado: ${id}`);
    }
    
    return {
      meta: {
        id: ch.id,
        type: 'tv',
        name: ch.name,
        poster: ch.logo || 'https://img.icons8.com/color/480/tv.png',
        background: ch.logo || 'https://img.icons8.com/color/480/tv.png',
        description: `📺 ${ch.group}\n\n🇧🇷 Canal brasileiro disponível 24 horas por dia.\n\n⚡ Qualidade de transmissão ao vivo.`,
        genres: ['IPTV', 'Live TV', ch.group],
        releaseInfo: 'Ao Vivo',
        website: 'https://github.com/WillAcris/IPTV-BR'
      }
    };
  } catch (error) {
    console.error(`❌ Erro no meta handler:`, error.message);
    throw error;
  }
});

builder.defineStreamHandler(async ({ id }) => {
  try {
    const items = await loadM3U();
    const ch = items.find(x => x.id === id);
    
    if (!ch) {
      throw new Error(`Stream não encontrado: ${id}`);
    }
    
    console.log(`🎬 Stream solicitado: ${ch.name}`);
    
    return {
      streams: [
        {
          name: 'IPTV Brasil',
          title: `📺 ${ch.name} - ${ch.group}`,
          url: ch.url,
          behaviorHints: {
            notWebReady: true,
            bingeGroup: `iptv-${ch.group.toLowerCase().replace(/\s+/g, '-')}`
          }
        }
      ]
    };
  } catch (error) {
    console.error(`❌ Erro no stream handler:`, error.message);
    throw error;
  }
});

const port = process.env.PORT || 7000;

// Inicialização do servidor
serveHTTP(builder.getInterface(), { port })
  .then(() => {
    console.log('🚀 ====================================');
    console.log('🇧🇷 IPTV Brasil Addon v3.0.0');
    console.log('🚀 ====================================');
    console.log(`📡 Servidor rodando na porta: ${port}`);
    console.log(`🌐 URL do Manifest: http://localhost:${port}/manifest.json`);
    console.log(`📺 Total de Categorias: ${CATEGORIES.length}`);
    console.log('✨ Addon pronto para uso no Stremio!');
    console.log('🚀 ====================================');
    
    // Pré-carregar os canais
    loadM3U()
      .then(() => console.log('✅ Cache inicial carregado com sucesso!'))
      .catch(err => console.error('⚠️  Aviso: Erro no carregamento inicial:', err.message));
  })
  .catch(err => {
    console.error('❌ Erro ao iniciar servidor:', err);
    process.exit(1);
  });

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('❌ Erro não capturado:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Promise rejeitada:', err);
});
