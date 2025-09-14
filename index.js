const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');

const M3U_URL = 'http://abre.ai/manotv3';
const CATEGORIES = [
  { id: 'cat_globo', name: 'Canais Globo', keywords: ['globo', 'ge tv', 'tv tem', 'rpc', 'rbs', 'nsc', 'tv clube', 'verde mares', 'tv subaé', 'subaé', 'rede amazonica', 'amazonica', 'tv liberal', 'liberal', 'canais | globo'] },
  { id: 'cat_record', name: 'Canais Record', keywords: ['record', 'recordtv', 'canais | record tv', 'tv tropical', 'record sictv'] },
  { id: 'cat_sbt', name: 'Canais SBT', keywords: ['sbt', 'canais | sbt', 'tv difusora', 'tv aratu', 'sbt guajará', 'sbt cidade verde'] },
  { id: 'cat_band', name: 'Canais Band', keywords: ['band', 'canais | band tv', 'band arapuan', 'band rba tv', 'band mato grosso', 'new brasil'] },
  { id: 'cat_sportv', name: 'SporTV', keywords: ['sportv', 'canais | sportv'] },
  { id: 'cat_espn', name: 'ESPN', keywords: ['espn', 'canais | espn'] },
  { id: 'cat_esportes', name: 'Esportes', keywords: ['esportes', 'premiere', 'futebol', 'libertadores', 'cazé', 'desempedido', 'nsports', 'canais | esportes', 'canais | lutas', 'canais | premiere', 'ao vivo | brasileirão', 'ao vivo | copa do brasil', 'ao vivo | futebol', 'ao vivo | esportes', 'band sports', 'combate', 'ufc fightpass', 'dazn f1', 'auto tv', 'ge tv', 'xsports', 'fifa plus', 'realmadrid tv', 'barça one', 'fuel tv', 'woohoo', 'canal do inter', 'pontv', 'trace sport stars', 'esportes brasília'] },
  { id: 'cat_filmes', name: 'Filmes e Séries', keywords: ['filmes', 'series', 'séries', 'telecine', 'space', 'tnt', 'south park', 'runtime', 'cine', 'movies', 'canais | filmes e series', 'canais | south park', 'dorama |', 'série |', 'anime |', 'amc', 'tela brasil tv', 'cine brasil', 'mytime movies', 'movie sphere', 'sony one', 'bora filmes', 'cine monde', 'dark flix', 'tv nova play', 'channel one', 'hto filmes'] },
  { id: 'cat_noticias', name: 'Notícias', keywords: ['notícias', 'noticias', 'news', 'cnn', 'canais | notícias', 'tvd news', 'bm&c news', 'times brasil', 'jp news', 'cnn brasil', 'globo news', 'band news', 'avança brasil', '4 por 4', 'resumo da ópera', '011 news', 'record news', 'tv câmera', 'tv senado', 'tv justiça', 'canal gov', 'tv videonews'] },
  { id: 'cat_infantil', name: 'Infantil', keywords: ['infantil', 'kids', 'cartoon', 'nick', 'canais | infantil', 'bob esponja', 'pluto tv junior', 'o reino infantil', 'nick clássico', 'babyfirst', 'super zoe', 'rugrats', 'os padrinhos mágicos', 'patrulha canina', 'clouding', 'kid mais', 'kuriakos kids', 'toon googles', 'os jetsons', 'rakuten família', 'nickelodeon', 'nick jr', 'tv ra tim bum', 'cartoon network', 'cartoonito', 'tru tv', 'fox kids', 'tv gallo', 'tooncast', 'discovery kids', 'zoomoo', 'léo e lully', 'retro cartoon', 'tvzyn', 'talking tom', 'universo kids', 'dream works', 'd.p.a', 'mr bean animated', 'dcpc infantil', 'adult swim', 'ministério infantil tv'] },
  { id: 'cat_animes', name: 'Animes & Geek', keywords: ['animes', 'geek', 'loading', 'canais | animes & geek', 'dragon ball', 'cavaleiros dos zodiacos', 'naruto'] },
  { id: 'cat_musica', name: 'Música', keywords: ['música', 'musica', 'music', 'mtv', 'canais | música', 'mtv flow latino', 'top tv', 'rede sulamérica tv', 'maisum', 'music top', 'canal 019', 'pop pegajoso', 'kiss tv', 'hallo music', 'gospel music tv', 'hip hop vai além', 'rádio', 'radio', 'pisadinha', 'k-pop', 'pop', 'energia 97', 'gospel internacional', 'rádio salvador', 'antena 1', 'brado rádio', 'gavião fm', 'rádio muriaé', 'web rádio jp'] },
  { id: 'cat_variedades', name: 'Variedades', keywords: ['variedades', 'discovery', 'animal', 'food', 'investigação', 'canais | variedades', 'canais | reality', 'multishow', 'mtv', 'bis', 'comedy central', 'tbs', 'canal brasil', 'e!', 'prime box', 'arte 1', 'film & arts', 'tlc', 'gnt', 'modo viagem', 'receita fast', 'hallo doc', 'discovery turbo', 'id', 'animal planet', 'rakuten documentários', 'pluto tv investigação', 'revry brasil', 'whe play', 'royalworld', 'viajando pelo brasil', 'diatv', 'fit dance', 'cultne tv', 'salon line', 'tratamento de choque'] },
  { id: 'cat_novelas', name: 'Novelas', keywords: ['novelas', 'televisa', 'telenovelas', 'canais | novelas', 'globoplay novelas', 'a terra prometida', 'os dez mandamentos', 'malhação fast', 'a escrava isaura', 'tvi ficção', 'sic novelas', 'sony novelas'] },
  { id: 'cat_reality', name: 'Reality Shows', keywords: ['reality', 'masterchef', 'shark tank', 'canais | reality', 'estrela da casa', 'mtv com o ex'] },
  { id: 'cat_comedia', name: 'Comédia', keywords: ['comédia', 'comedia', 'comedy', 'kenan', 'failarmy', 'canais | comédia', 'porta dos fundos', 'drake e josh', 'friends', 'um maluco no pedaço', 'os trapalhões', 'todo mundo odeia o cris', 'pegadinhas silvio santos', 'as visões da raven', 'a grande família', 'escolinha raimundo', 'eu a patroa e as crianças', 'tô de graça'] },
  { id: 'cat_lutas', name: 'Lutas', keywords: ['lutas', 'fight', 'combat', 'ufc', 'pfl', 'combate', 'ufc fightpass', 'lucha libre', 'combatv', 'fite', 'sft combat'] },
  { id: 'cat_internacional', name: 'Internacional', keywords: ['internacional', 'sic', 'rtp', 'tvi', 'cnn international', 'canais | internacional', 'eleven sports', 'canal 11', 'tv5 monde', 'fox news now', 'sony canal comedias', 'deportes', 'wwe youtube'] },
  { id: 'cat_pluto', name: 'Pluto TV', keywords: ['pluto'] },
  { id: 'cat_aberto', name: 'Canais Abertos', keywords: ['aberto', 'cultura', 'tve', 'redtv', 'brasil', 'canais | aberto', 'redetv', 'tv são luís', 'imperial tv', 'rtn tv', 'tv ceará', 'tv diário', 'tve bahia', 'tve rs', 'tv brasil es', 'tv gazeta', 'tv cultura', 'catve tv cultura', 'elytv', 'esflix tv', 'tv evangelizar', 'tv guará', 'rns tv', 'santa cruz web tv', 'tv novo tempo', 'olha tv', 'tv paraná turismo', 'tv candidés', 'tv rbc', 'gogo play', 'bs tv', 'tv clássicos', 'web tv clássicos', 'otaku sign tv', 'lasstv', 'br super tv', 'tv aparecida', 'pbc tv', 'central tv', 'ulb tv', 'aw tv', 'top mix tv', 'tvm pará', 'rede vida', 'gln tv', 'tv grão pará', 'tv litoral', 'tv osório news', 'tela viva tv', 'istv', 'rede família', 'nbt', 'ngt', 'canal 29', 'xtreme tv', 'tv aracati', 'life channel brasil', 'tv diário do sertão', 'sou tv', 'tv marajoara', 'rede brasil', 'vivax tv', 'tv brasil hits', 'amazonsat', 'terra viva', 'canal do boi', 'tv notícias agrícolas', 'agro canal', 'canal rural', 'agromais', 'agro plus', 'tv brasil central', 'rede século 21', 'yeeaah', 'conectv', 'tv a folha', 'astral tv', 'rede utv', 'cultura internacional', 'caravana play', 'tv cidade verde', 'abc brasil', 'wtj tv minas', 'play tv', 'ypê tv', 'rede sdp tv', 'seven tv', 'sptv', 'imperial tv', 'tv mais família', 'tv fala litoral', 'canal ok tv', 'img tv', 'tv cel', 'tv vianney', 'tv recanto da fé', 'tv imaculada', 'canção nova', 'igreja universal', 'grjngo', 'web tv progresso', 'vrt channel', 'tenda tv', 'gospel internacional', 'gospel music tv', 'gospel cartoon', 'gostei gospel tv', 'gospel movies tv', 'rede gospel', 'tv gospel', 'rede qdm', 'tv gramado', 'brazitv', 'tvc', 'rede cnt', 'tv união', 'tv vitória pe', 'tv sim', 'tv serra dourada', 'vitrine esportiva', 'tv recon', 'tv paraense', 'tv da gente', 'o dia tv', 'catve 2', 'tve ms', 'tve rs', 'rs news webtv', 'tv serra américa', 'ministério infantil tv', 'rede minas', 'tv nbn', 'vclassic tv', 'tv sonata', 'tv jornal', 'rede meio norte', 'tv mais brasil', 'rede clone tv', 'tv japi', 'rede tv sul', 'rede sul', 'vila tv', 'tv channel network', 'rede mundo da televisão', 'primer tv', 'tv chroma', 'qtal channel', 'vv8 tv', 'web tv campeão de tudo', 'tvc brasil', 'terceira via', 'tv rio preto', 'rede ibtv', 'tv visual', 'demais tv', 'wtv brasil', 'canal smart', 'tv nostalgia', 'web tv boa nova', 'agitomax', 'universo tv', 'combrasil', 'tv santa maria', 'tv sol comunidade', 'igreja mundial'] }
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
