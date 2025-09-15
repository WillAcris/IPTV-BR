const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');

const M3U_URL = 'http://abre.ai/manotv3';
const CATEGORIES = [
  { id: 'cat_globo', name: 'Canais Globo', keywords: ['globo', 'ge tv', 'tv tem', 'rpc', 'rbs', 'nsc', 'tv clube', 'verde mares', 'tv subaé', 'subaé', 'rede amazonica', 'amazonica', 'tv liberal', 'liberal', 'canais | globo', 'globo sp', 'globo rj', 'globo mg', 'globo rs', 'globo pr', 'globo sc', 'globo ba', 'globo pe', 'globo ce', 'globo go', 'globo df', 'globo ms', 'globo mt', 'globo ro', 'globo ac', 'globo al', 'globo am', 'globo ap', 'globo es', 'globo ma', 'globo pb', 'globo pi', 'globo rn', 'globo rr', 'globo se', 'globo to', 'globo hd', 'globo fhd', 'globo 4k', 'rede globo', 'tv globo', 'globo são paulo', 'globo rio', 'globo minas', 'globo brasília', 'globo nordeste', 'globo sul', 'globo rio de janeiro', 'globo minas gerais', 'globo rio grande do sul', 'globo paraná', 'globo santa catarina', 'globo bahia', 'globo pernambuco', 'globo ceará', 'globo goiás', 'globo mato grosso', 'globo espírito santo', 'globonews', 'gnt', 'globo 2', 'globo 3', 'tv globo 2', 'globoplay', 'globo inter tv', 'inter tv', 'rpc curitiba', 'rpc maringa', 'rbs tv porto alegre', 'rbs tv caxias', 'rbs tv pelotas', 'rbs porto alegre', 'rbs caxias', 'rbs pelotas', 'nsc curitiba', 'tv verde mares', 'tv verde mares ce', 'globo tv subaé', 'tv liberal belém', 'globo liberal', 'rede amazonica porto velho', 'globo manaus', 'globo maranhão', 'globo goiás', 'Globo', 'GLOBO', 'Globo SP', 'Globo RJ', 'Globo MG', 'Globo RS', 'Globo PR', 'Globo SC', 'Globo BA', 'Globo PE', 'Globo CE', 'Globo GO', 'Globo DF', 'Globo HD', 'Globo FHD', 'GloboNews', 'GLOBONEWS', 'TV Globo', 'Rede Globo', 'REDE GLOBO', 'GLOBO SÃO PAULO', 'globo são paulo', 'GLOBO RIO DE JANEIRO', 'globo rio de janeiro', 'GLOBO MINAS GERAIS', 'globo minas gerais', 'GLOBO RIO GRANDE DO SUL', 'globo rio grande do sul', 'GLOBO PARANÁ', 'globo paraná', 'GLOBO SANTA CATARINA', 'globo santa catarina', 'GLOBO BAHIA', 'globo bahia', 'GLOBO PERNAMBUCO', 'globo pernambuco', 'GLOBO CEARÁ', 'globo ceará', 'GLOBO GOIÁS', 'globo goiás', 'GLOBO BRASÍLIA', 'globo brasília', 'GLOBO DISTRITO FEDERAL', 'globo distrito federal', 'GLOBO MATO GROSSO', 'globo mato grosso', 'GLOBO MATO GROSSO DO SUL', 'globo mato grosso do sul', 'GLOBO ESPÍRITO SANTO', 'globo espírito santo', 'GLOBO ACRE', 'globo acre', 'GLOBO ALAGOAS', 'globo alagoas', 'GLOBO AMAPÁ', 'globo amapá', 'GLOBO AMAZONAS', 'globo amazonas', 'GLOBO MARANHÃO', 'globo maranhão', 'GLOBO PARAÍBA', 'globo paraíba', 'GLOBO PIAUÍ', 'globo piauí', 'GLOBO RIO GRANDE DO NORTE', 'globo rio grande do norte', 'GLOBO RONDÔNIA', 'globo rondônia', 'GLOBO RORAIMA', 'globo roraima', 'GLOBO SERGIPE', 'globo sergipe', 'GLOBO TOCANTINS', 'globo tocantins', 'Globo São Paulo', 'Globo Rio de Janeiro', 'Globo Minas Gerais', 'Globo Rio Grande do Sul', 'Globo Paraná', 'Globo Santa Catarina', 'Globo Bahia', 'Globo Pernambuco', 'Globo Ceará', 'Globo Goiás', 'Globo Brasília', 'Globo Distrito Federal', 'Globo Mato Grosso', 'Globo Mato Grosso do Sul', 'Globo Espírito Santo', 'Globo RJ HD', 'Globo SP HD', 'Globo MG HD', 'Globo RS HD', 'Globo PR HD', 'Globo SC HD', 'Globo BA HD', 'Globo PE HD', 'Globo CE HD', 'Globo GO HD', 'Globo DF HD', 'Globo RJ FHD', 'Globo SP FHD', 'Globo MG FHD', 'Globo RS FHD', 'Globo PR FHD', 'Globo SC FHD', 'Globo BA FHD', 'Globo PE FHD', 'Globo CE FHD', 'Globo GO FHD', 'Globo DF FHD', 'Globo RJ 4K', 'Globo SP 4K', 'Globo MG 4K', 'Globo RS 4K', 'Globo PR 4K', 'Globo SC 4K', 'Globo BA 4K', 'Globo PE 4K', 'Globo CE 4K', 'Globo GO 4K', 'Globo DF 4K', 'globo rj hd', 'globo sp hd', 'globo mg hd', 'globo rs hd', 'globo pr hd', 'globo sc hd', 'globo ba hd', 'globo pe hd', 'globo ce hd', 'globo go hd', 'globo df hd', 'globo rj fhd', 'globo sp fhd', 'globo mg fhd', 'globo rs fhd', 'globo pr fhd', 'globo sc fhd', 'globo ba fhd', 'globo pe fhd', 'globo ce fhd', 'globo go fhd', 'globo df fhd', 'globo rj 4k', 'globo sp 4k', 'globo mg 4k', 'globo rs 4k', 'globo pr 4k', 'globo sc 4k', 'globo ba 4k', 'globo pe 4k', 'globo ce 4k', 'globo go 4k', 'globo df 4k', 'GLOBO RJ HD', 'GLOBO SP HD', 'GLOBO MG HD', 'GLOBO RS HD', 'GLOBO PR HD', 'GLOBO SC HD', 'GLOBO BA HD', 'GLOBO PE HD', 'GLOBO CE HD', 'GLOBO GO HD', 'GLOBO DF HD', 'GLOBO RJ FHD', 'GLOBO SP FHD', 'GLOBO MG FHD', 'GLOBO RS FHD', 'GLOBO PR FHD', 'GLOBO SC FHD', 'GLOBO BA FHD', 'GLOBO PE FHD', 'GLOBO CE FHD', 'GLOBO GO FHD', 'GLOBO DF FHD', 'TV GLOBO SÃO PAULO', 'tv globo são paulo', 'TV GLOBO RIO DE JANEIRO', 'tv globo rio de janeiro', 'TV GLOBO SP', 'tv globo sp', 'TV GLOBO RJ', 'tv globo rj', 'TV GLOBO MG', 'tv globo mg', 'TV GLOBO RS', 'tv globo rs', 'TV GLOBO PR', 'tv globo pr', 'TV GLOBO SC', 'tv globo sc', 'TV GLOBO BA', 'tv globo ba', 'TV GLOBO PE', 'tv globo pe', 'TV GLOBO CE', 'tv globo ce', 'TV GLOBO GO', 'tv globo go', 'TV GLOBO DF', 'tv globo df', 'Globo RJ²', 'Globo SP²', 'Globo HD²', 'Globo RJ³', 'Globo SP³', 'Globo HD³', 'Globo RJ⁴', 'Globo SP⁴', 'Globo HD⁴', 'Globo RJ⁵', 'Globo SP⁵', 'Globo HD⁵', 'globo rj²', 'globo sp²', 'globo hd²', 'globo rj³', 'globo sp³', 'globo hd³', 'globo rj⁴', 'globo sp⁴', 'globo hd⁴', 'globo rj⁵', 'globo sp⁵', 'globo hd⁵', 'GLOBO 1', 'GLOBO 2', 'GLOBO 3', 'GLOBO 4', 'GLOBO 5', 'globo 1', 'globo 4', 'globo 5', 'Globo 1', 'Globo 4', 'Globo 5'] },
  { id: 'cat_record', name: 'Canais Record', keywords: ['record', 'recordtv', 'canais | record tv', 'tv tropical', 'record sictv', 'record sp', 'record rj', 'record mg', 'record rs', 'record pr', 'record sc', 'record ba', 'record pe', 'record ce', 'record go', 'record df', 'record ms', 'record mt', 'record ro', 'record ac', 'record al', 'record am', 'record ap', 'record es', 'record ma', 'record pb', 'record pi', 'record rn', 'record rr', 'record se', 'record to', 'record hd', 'record fhd', 'record 4k', 'rede record', 'tv record', 'record são paulo', 'record rio', 'record minas', 'record brasília', 'record nordeste', 'record sul', 'record rio de janeiro', 'record minas gerais', 'record rio grande do sul', 'record paraná', 'record santa catarina', 'record bahia', 'record pernambuco', 'record ceará', 'record goiás', 'record mato grosso', 'record espírito santo', 'recordnews', 'record news', 'record 2', 'record 3', 'tv record 2', 'record play', 'record europa', 'record internacional', 'recordtv ba', 'recordtv sp', 'recordtv rj', 'recordtv mg', 'recordtv rs', 'recordtv brasília', 'recordtv conquista', 'recordtv juara', 'record sictv ro', 'record sic tv', 'recordtv ba hd', 'recordtv sp hd', 'recordtv rj hd', 'recordtv rj fhd', 'recordtv conquista hd', 'recordtv juara hd', 'record sictv (ro)', 'tv tropical', 'Record', 'RECORD', 'RecordTV', 'RECORDTV', 'Record SP', 'Record RJ', 'Record MG', 'Record RS', 'Record PR', 'Record SC', 'Record BA', 'Record PE', 'Record CE', 'Record GO', 'Record DF', 'Record HD', 'Record FHD', 'TV Record', 'Rede Record', 'REDE RECORD', 'RecordNews', 'RECORDNEWS', 'Record News', 'RECORD NEWS', 'RECORD SÃO PAULO', 'record são paulo', 'RECORD RIO DE JANEIRO', 'record rio de janeiro', 'RECORD MINAS GERAIS', 'record minas gerais', 'RECORD RIO GRANDE DO SUL', 'record rio grande do sul', 'RECORD PARANÁ', 'record paraná', 'RECORD SANTA CATARINA', 'record santa catarina', 'RECORD BAHIA', 'record bahia', 'RECORD PERNAMBUCO', 'record pernambuco', 'RECORD CEARÁ', 'record ceará', 'RECORD GOIÁS', 'record goiás', 'RECORD BRASÍLIA', 'record brasília', 'RECORD DISTRITO FEDERAL', 'record distrito federal', 'RECORD MATO GROSSO', 'record mato grosso', 'RECORD ESPÍRITO SANTO', 'record espírito santo', 'Record São Paulo', 'Record Rio de Janeiro', 'Record Minas Gerais', 'Record Rio Grande do Sul', 'Record Paraná', 'Record Santa Catarina', 'Record Bahia', 'Record Pernambuco', 'Record Ceará', 'Record Goiás', 'Record Brasília', 'Record Distrito Federal', 'Record Mato Grosso', 'Record Espírito Santo', 'TV RECORD SÃO PAULO', 'tv record são paulo', 'TV RECORD RIO DE JANEIRO', 'tv record rio de janeiro', 'TV RECORD SP', 'tv record sp', 'TV RECORD RJ', 'tv record rj', 'TV RECORD MG', 'tv record mg', 'TV RECORD RS', 'tv record rs', 'TV RECORD PR', 'tv record pr', 'TV RECORD SC', 'tv record sc', 'TV RECORD BA', 'tv record ba', 'TV RECORD PE', 'tv record pe', 'TV RECORD CE', 'tv record ce', 'TV RECORD GO', 'tv record go', 'TV RECORD DF', 'tv record df', 'Record SP HD', 'Record RJ HD', 'Record MG HD', 'Record RS HD', 'Record PR HD', 'Record SC HD', 'Record BA HD', 'Record PE HD', 'Record CE HD', 'Record GO HD', 'Record DF HD', 'Record SP FHD', 'Record RJ FHD', 'Record MG FHD', 'Record RS FHD', 'Record PR FHD', 'Record SC FHD', 'Record BA FHD', 'Record PE FHD', 'Record CE FHD', 'Record GO FHD', 'Record DF FHD', 'Record SP 4K', 'Record RJ 4K', 'Record MG 4K', 'Record RS 4K', 'Record PR 4K', 'Record SC 4K', 'Record BA 4K', 'Record PE 4K', 'Record CE 4K', 'Record GO 4K', 'Record DF 4K', 'record sp hd', 'record rj hd', 'record mg hd', 'record rs hd', 'record pr hd', 'record sc hd', 'record ba hd', 'record pe hd', 'record ce hd', 'record go hd', 'record df hd', 'record sp fhd', 'record rj fhd', 'record mg fhd', 'record rs fhd', 'record pr fhd', 'record sc fhd', 'record ba fhd', 'record pe fhd', 'record ce fhd', 'record go fhd', 'record df fhd', 'record sp 4k', 'record rj 4k', 'record mg 4k', 'record rs 4k', 'record pr 4k', 'record sc 4k', 'record ba 4k', 'record pe 4k', 'record ce 4k', 'record go 4k', 'record df 4k', 'RECORD SP HD', 'RECORD RJ HD', 'RECORD MG HD', 'RECORD RS HD', 'RECORD PR HD', 'RECORD SC HD', 'RECORD BA HD', 'RECORD PE HD', 'RECORD CE HD', 'RECORD GO HD', 'RECORD DF HD', 'RECORD SP FHD', 'RECORD RJ FHD', 'RECORD MG FHD', 'RECORD RS FHD', 'RECORD PR FHD', 'RECORD SC FHD', 'RECORD BA FHD', 'RECORD PE FHD', 'RECORD CE FHD', 'RECORD GO FHD', 'RECORD DF FHD', 'Record SP²', 'Record RJ²', 'Record HD²', 'Record SP³', 'Record RJ³', 'Record HD³', 'Record SP⁴', 'Record RJ⁴', 'Record HD⁴', 'Record SP⁵', 'Record RJ⁵', 'Record HD⁵', 'record sp²', 'record rj²', 'record hd²', 'record sp³', 'record rj³', 'record hd³', 'record sp⁴', 'record rj⁴', 'record hd⁴', 'record sp⁵', 'record rj⁵', 'record hd⁵', 'RECORD 1', 'RECORD 2', 'RECORD 3', 'RECORD 4', 'RECORD 5', 'record 1', 'record 4', 'record 5', 'Record 1', 'Record 4', 'Record 5'] },
  { id: 'cat_sbt', name: 'Canais SBT', keywords: ['sbt', 'canais | sbt', 'tv difusora', 'tv aratu', 'sbt guajará', 'sbt cidade verde', 'sbt sp', 'sbt rj', 'sbt mg', 'sbt rs', 'sbt pr', 'sbt sc', 'sbt ba', 'sbt pe', 'sbt ce', 'sbt go', 'sbt df', 'sbt ms', 'sbt mt', 'sbt ro', 'sbt ac', 'sbt al', 'sbt am', 'sbt ap', 'sbt es', 'sbt ma', 'sbt pb', 'sbt pi', 'sbt rn', 'sbt rr', 'sbt se', 'sbt to', 'sbt hd', 'sbt fhd', 'sbt 4k', 'sistema brasileiro', 'tv sbt', 'sbt são paulo', 'sbt rio', 'sbt minas', 'sbt brasília', 'sbt nordeste', 'sbt sul', 'sbt rio de janeiro', 'sbt minas gerais', 'sbt rio grande do sul', 'sbt paraná', 'sbt santa catarina', 'sbt bahia', 'sbt pernambuco', 'sbt ceará', 'sbt goiás', 'sbt mato grosso', 'sbt espírito santo', 'sbt 2', 'sbt 3', 'tv sbt 2', 'sbt interior', 'sbt mais', 'SBT', 'Sbt', 'SBT SP', 'SBT RJ', 'SBT MG', 'SBT RS', 'SBT PR', 'SBT SC', 'SBT BA', 'SBT PE', 'SBT CE', 'SBT GO', 'SBT DF', 'SBT HD', 'SBT FHD', 'TV SBT', 'Sistema Brasileiro', 'SISTEMA BRASILEIRO', 'TV ARATU', 'TV Aratu', 'tv aratu', 'SBT SÃO PAULO', 'sbt são paulo', 'SBT RIO DE JANEIRO', 'sbt rio de janeiro', 'SBT MINAS GERAIS', 'sbt minas gerais', 'SBT RIO GRANDE DO SUL', 'sbt rio grande do sul', 'SBT PARANÁ', 'sbt paraná', 'SBT SANTA CATARINA', 'sbt santa catarina', 'SBT BAHIA', 'sbt bahia', 'SBT PERNAMBUCO', 'sbt pernambuco', 'SBT CEARÁ', 'sbt ceará', 'SBT GOIÁS', 'sbt goiás', 'SBT BRASÍLIA', 'sbt brasília', 'SBT DISTRITO FEDERAL', 'sbt distrito federal', 'SBT MATO GROSSO', 'sbt mato grosso', 'SBT ESPÍRITO SANTO', 'sbt espírito santo', 'SBT São Paulo', 'SBT Rio de Janeiro', 'SBT Minas Gerais', 'SBT Rio Grande do Sul', 'SBT Paraná', 'SBT Santa Catarina', 'SBT Bahia', 'SBT Pernambuco', 'SBT Ceará', 'SBT Goiás', 'SBT Brasília', 'SBT Distrito Federal', 'SBT Mato Grosso', 'SBT Espírito Santo', 'TV SBT SÃO PAULO', 'tv sbt são paulo', 'TV SBT RIO DE JANEIRO', 'tv sbt rio de janeiro', 'TV SBT SP', 'tv sbt sp', 'TV SBT RJ', 'tv sbt rj', 'TV SBT MG', 'tv sbt mg', 'TV SBT RS', 'tv sbt rs', 'TV SBT PR', 'tv sbt pr', 'TV SBT SC', 'tv sbt sc', 'TV SBT BA', 'tv sbt ba', 'TV SBT PE', 'tv sbt pe', 'TV SBT CE', 'tv sbt ce', 'TV SBT GO', 'tv sbt go', 'TV SBT DF', 'tv sbt df', 'SBT SP HD', 'SBT RJ HD', 'SBT MG HD', 'SBT RS HD', 'SBT PR HD', 'SBT SC HD', 'SBT BA HD', 'SBT PE HD', 'SBT CE HD', 'SBT GO HD', 'SBT DF HD', 'SBT SP FHD', 'SBT RJ FHD', 'SBT MG FHD', 'SBT RS FHD', 'SBT PR FHD', 'SBT SC FHD', 'SBT BA FHD', 'SBT PE FHD', 'SBT CE FHD', 'SBT GO FHD', 'SBT DF FHD', 'SBT SP 4K', 'SBT RJ 4K', 'SBT MG 4K', 'SBT RS 4K', 'SBT PR 4K', 'SBT SC 4K', 'SBT BA 4K', 'SBT PE 4K', 'SBT CE 4K', 'SBT GO 4K', 'SBT DF 4K', 'sbt sp hd', 'sbt rj hd', 'sbt mg hd', 'sbt rs hd', 'sbt pr hd', 'sbt sc hd', 'sbt ba hd', 'sbt pe hd', 'sbt ce hd', 'sbt go hd', 'sbt df hd', 'sbt sp fhd', 'sbt rj fhd', 'sbt mg fhd', 'sbt rs fhd', 'sbt pr fhd', 'sbt sc fhd', 'sbt ba fhd', 'sbt pe fhd', 'sbt ce fhd', 'sbt go fhd', 'sbt df fhd', 'sbt sp 4k', 'sbt rj 4k', 'sbt mg 4k', 'sbt rs 4k', 'sbt pr 4k', 'sbt sc 4k', 'sbt ba 4k', 'sbt pe 4k', 'sbt ce 4k', 'sbt go 4k', 'sbt df 4k', 'TV ARATU HD', 'TV Aratu HD', 'tv aratu hd', 'TV ARATU FHD', 'TV Aratu FHD', 'tv aratu fhd', 'TV ARATU 4K', 'TV Aratu 4K', 'tv aratu 4k', 'TV ARATU HD²', 'TV Aratu HD²', 'tv aratu hd²', 'TV ARATU HD³', 'TV Aratu HD³', 'tv aratu hd³', 'SBT SP²', 'SBT RJ²', 'SBT HD²', 'SBT SP³', 'SBT RJ³', 'SBT HD³', 'SBT SP⁴', 'SBT RJ⁴', 'SBT HD⁴', 'SBT SP⁵', 'SBT RJ⁵', 'SBT HD⁵', 'sbt sp²', 'sbt rj²', 'sbt hd²', 'sbt sp³', 'sbt rj³', 'sbt hd³', 'sbt sp⁴', 'sbt rj⁴', 'sbt hd⁴', 'sbt sp⁵', 'sbt rj⁵', 'sbt hd⁵', 'SBT 1', 'SBT 2', 'SBT 3', 'SBT 4', 'SBT 5', 'sbt 1', 'sbt 4', 'sbt 5', 'Sbt 1', 'Sbt 4', 'Sbt 5', 'SISTEMA BRASILEIRO DE TELEVISÃO', 'sistema brasileiro de televisão', 'Sistema Brasileiro de Televisão', '+sbt hd', 'tv difusora (sbt são luís)', 'tv difusora leste', 'tv rio parnaíba maranhão', 'tv aratu hd²', 'sbt cidade verde fhd'] },
  { id: 'cat_band', name: 'Canais Band', keywords: ['band', 'canais | band tv', 'band arapuan', 'band rba tv', 'band mato grosso', 'new brasil', 'band sp', 'band rj', 'band mg', 'band rs', 'band pr', 'band sc', 'band ba', 'band pe', 'band ce', 'band go', 'band df', 'band ms', 'band mt', 'band ro', 'band ac', 'band al', 'band am', 'band ap', 'band es', 'band ma', 'band pb', 'band pi', 'band rn', 'band rr', 'band se', 'band to', 'band hd', 'band fhd', 'band 4k', 'rede bandeirantes', 'tv band', 'bandeirantes', 'band são paulo', 'band rio', 'band minas', 'band brasília', 'band nordeste', 'band sul', 'band 2', 'band 3', 'tv band 2', 'band play', 'band fm', 'bandnews tv', 'Band', 'BAND', 'Band SP', 'Band RJ', 'Band MG', 'Band RS', 'Band PR', 'Band SC', 'Band BA', 'Band PE', 'Band CE', 'Band GO', 'Band DF', 'Band HD', 'Band FHD', 'TV Band', 'Bandeirantes', 'BANDEIRANTES', 'Rede Bandeirantes', 'REDE BANDEIRANTES', 'BandNews', 'BANDNEWS', 'Band News', 'BAND NEWS', 'BAND SÃO PAULO', 'band são paulo', 'BAND RIO DE JANEIRO', 'band rio de janeiro', 'BAND MINAS GERAIS', 'band minas gerais', 'BAND RIO GRANDE DO SUL', 'band rio grande do sul', 'BAND PARANÁ', 'band paraná', 'BAND SANTA CATARINA', 'band santa catarina', 'BAND BAHIA', 'band bahia', 'BAND PERNAMBUCO', 'band pernambuco', 'BAND CEARÁ', 'band ceará', 'BAND GOIÁS', 'band goiás', 'BAND BRASÍLIA', 'band brasília', 'BAND DISTRITO FEDERAL', 'band distrito federal', 'BAND MATO GROSSO', 'band mato grosso', 'BAND ESPÍRITO SANTO', 'band espírito santo', 'Band São Paulo', 'Band Rio de Janeiro', 'Band Minas Gerais', 'Band Rio Grande do Sul', 'Band Paraná', 'Band Santa Catarina', 'Band Bahia', 'Band Pernambuco', 'Band Ceará', 'Band Goiás', 'Band Brasília', 'Band Distrito Federal', 'Band Mato Grosso', 'Band Espírito Santo', 'TV BAND SÃO PAULO', 'tv band são paulo', 'TV BAND RIO DE JANEIRO', 'tv band rio de janeiro', 'TV BAND SP', 'tv band sp', 'TV BAND RJ', 'tv band rj', 'TV BAND MG', 'tv band mg', 'TV BAND RS', 'tv band rs', 'TV BAND PR', 'tv band pr', 'TV BAND SC', 'tv band sc', 'TV BAND BA', 'tv band ba', 'TV BAND PE', 'tv band pe', 'TV BAND CE', 'tv band ce', 'TV BAND GO', 'tv band go', 'TV BAND DF', 'tv band df', 'REDE BANDEIRANTES SÃO PAULO', 'rede bandeirantes são paulo', 'BANDEIRANTES SÃO PAULO', 'bandeirantes são paulo', 'Band SP HD', 'Band RJ HD', 'Band MG HD', 'Band RS HD', 'Band PR HD', 'Band SC HD', 'Band BA HD', 'Band PE HD', 'Band CE HD', 'Band GO HD', 'Band DF HD', 'Band SP FHD', 'Band RJ FHD', 'Band MG FHD', 'Band RS FHD', 'Band PR FHD', 'Band SC FHD', 'Band BA FHD', 'Band PE FHD', 'Band CE FHD', 'Band GO FHD', 'Band DF FHD', 'Band SP 4K', 'Band RJ 4K', 'Band MG 4K', 'Band RS 4K', 'Band PR 4K', 'Band SC 4K', 'Band BA 4K', 'Band PE 4K', 'Band CE 4K', 'Band GO 4K', 'Band DF 4K', 'band sp hd', 'band rj hd', 'band mg hd', 'band rs hd', 'band pr hd', 'band sc hd', 'band ba hd', 'band pe hd', 'band ce hd', 'band go hd', 'band df hd', 'band sp fhd', 'band rj fhd', 'band mg fhd', 'band rs fhd', 'band pr fhd', 'band sc fhd', 'band ba fhd', 'band pe fhd', 'band ce fhd', 'band go fhd', 'band df fhd', 'band sp 4k', 'band rj 4k', 'band mg 4k', 'band rs 4k', 'band pr 4k', 'band sc 4k', 'band ba 4k', 'band pe 4k', 'band ce 4k', 'band go 4k', 'band df 4k', 'BAND SP HD', 'BAND RJ HD', 'BAND MG HD', 'BAND RS HD', 'BAND PR HD', 'BAND SC HD', 'BAND BA HD', 'BAND PE HD', 'BAND CE HD', 'BAND GO HD', 'BAND DF HD', 'BAND SP FHD', 'BAND RJ FHD', 'BAND MG FHD', 'BAND RS FHD', 'BAND PR FHD', 'BAND SC FHD', 'BAND BA FHD', 'BAND PE FHD', 'BAND CE FHD', 'BAND GO FHD', 'BAND DF FHD', 'Band SP²', 'Band RJ²', 'Band HD²', 'Band SP³', 'Band RJ³', 'Band HD³', 'Band SP⁴', 'Band RJ⁴', 'Band HD⁴', 'Band SP⁵', 'Band RJ⁵', 'Band HD⁵', 'band sp²', 'band rj²', 'band hd²', 'band sp³', 'band rj³', 'band hd³', 'band sp⁴', 'band rj⁴', 'band hd⁴', 'band sp⁵', 'band rj⁵', 'band hd⁵', 'BAND 1', 'BAND 2', 'BAND 3', 'BAND 4', 'BAND 5', 'band 1', 'band 4', 'band 5', 'Band 1', 'Band 4', 'Band 5', 'band arapuan hd', 'band tv rba tv', 'band tv - vale do uruará', 'band mg hd', 'band mato grosso hd', 'new brasil hd'] },
  { id: 'cat_sportv', name: 'SporTV', keywords: ['sportv', 'canais | sportv', 'sportv hd', 'sportv fhd', 'sportv 4k', 'sportv 2', 'sportv 3', 'sportv 4', 'sportv 5', 'sportv+', 'sportv mais', 'spor tv', 'sportv1', 'sportv2', 'sportv3', 'sportv4', 'sportv5', 'sportv plus', 'sport tv 2', 'sport tv 3', 'sport tv 4', 'sport tv 5', 'SporTV', 'SPORTV', 'SporTV HD', 'SporTV FHD', 'SporTV 2', 'SporTV 3', 'SporTV 4', 'SporTV 5', 'SporTV+', 'SporTV Plus', 'SPORTV+', 'SPORTV PLUS', 'Spor TV', 'SPOR TV', 'Sport TV', 'SPORT TV', 'SporTV 2 HD', 'SporTV 3 HD', 'SporTV 4 HD', 'SporTV 5 HD', 'SporTV 2 FHD', 'SporTV 3 FHD', 'SporTV 4 FHD', 'SporTV 5 FHD', 'SporTV 2 4K', 'SporTV 3 4K', 'SporTV 4 4K', 'SporTV 5 4K', 'sportv 2 hd', 'sportv 3 hd', 'sportv 4 hd', 'sportv 5 hd', 'sportv 2 fhd', 'sportv 3 fhd', 'sportv 4 fhd', 'sportv 5 fhd', 'sportv 2 4k', 'sportv 3 4k', 'sportv 4 4k', 'sportv 5 4k', 'SPORTV 2 HD', 'SPORTV 3 HD', 'SPORTV 4 HD', 'SPORTV 5 HD', 'SPORTV 2 FHD', 'SPORTV 3 FHD', 'SPORTV 4 FHD', 'SPORTV 5 FHD', 'Sport TV 2 HD', 'Sport TV 3 HD', 'Sport TV 4 HD', 'Sport TV 5 HD', 'Sport TV 2 FHD', 'Sport TV 3 FHD', 'Sport TV 4 FHD', 'Sport TV 5 FHD', 'SporTV²', 'SporTV³', 'SporTV⁴', 'SporTV⁵', 'SporTV HD²', 'SporTV HD³', 'SporTV HD⁴', 'SporTV HD⁵', 'sportv²', 'sportv³', 'sportv⁴', 'sportv⁵', 'sportv hd²', 'sportv hd³', 'sportv hd⁴', 'sportv hd⁵', 'Sport TV²', 'Sport TV³', 'Sport TV⁴', 'Sport TV⁵'] },
  { id: 'cat_espn', name: 'ESPN', keywords: ['espn', 'canais | espn', 'espn hd', 'espn fhd', 'espn 4k', 'espn brasil', 'espn 2', 'espn 3', 'espn 4', 'espn 5', 'espn 6', 'espn extra', 'fox sports', 'fox sports hd', 'fox sports 2', 'fox sports 3', 'espn1', 'espn2', 'espn3', 'espn4', 'espn5', 'espn6', 'espn deportes', 'espn news', 'espn classic', 'espn+ plus', 'espn plus', 'ESPN', 'Espn', 'ESPN HD', 'ESPN FHD', 'ESPN 2', 'ESPN 3', 'ESPN 4', 'ESPN 5', 'ESPN 6', 'ESPN Brasil', 'ESPN BRASIL', 'ESPN Extra', 'ESPN EXTRA', 'Fox Sports', 'FOX SPORTS', 'Fox Sports HD', 'FOX SPORTS HD', 'ESPN News', 'ESPN NEWS', 'ESPN Classic', 'ESPN CLASSIC', 'ESPN+', 'ESPN Plus', 'ESPN PLUS', 'ESPN 2 HD', 'ESPN 3 HD', 'ESPN 4 HD', 'ESPN 5 HD', 'ESPN 6 HD', 'ESPN 2 FHD', 'ESPN 3 FHD', 'ESPN 4 FHD', 'ESPN 5 FHD', 'ESPN 6 FHD', 'ESPN 2 4K', 'ESPN 3 4K', 'ESPN 4 4K', 'ESPN 5 4K', 'ESPN 6 4K', 'ESPN Brasil HD', 'ESPN Brasil FHD', 'ESPN Brasil 4K', 'ESPN BRASIL HD', 'ESPN BRASIL FHD', 'ESPN BRASIL 4K', 'espn 2 hd', 'espn 3 hd', 'espn 4 hd', 'espn 5 hd', 'espn 6 hd', 'espn 2 fhd', 'espn 3 fhd', 'espn 4 fhd', 'espn 5 fhd', 'espn 6 fhd', 'espn 2 4k', 'espn 3 4k', 'espn 4 4k', 'espn 5 4k', 'espn 6 4k', 'espn brasil hd', 'espn brasil fhd', 'espn brasil 4k', 'Fox Sports 2 HD', 'Fox Sports 3 HD', 'Fox Sports 2 FHD', 'Fox Sports 3 FHD', 'Fox Sports 2 4K', 'Fox Sports 3 4K', 'fox sports 2 hd', 'fox sports 3 hd', 'fox sports 2 fhd', 'fox sports 3 fhd', 'fox sports 2 4k', 'fox sports 3 4k', 'FOX SPORTS 2 HD', 'FOX SPORTS 3 HD', 'FOX SPORTS 2 FHD', 'FOX SPORTS 3 FHD', 'ESPN²', 'ESPN³', 'ESPN⁴', 'ESPN⁵', 'ESPN⁶', 'ESPN HD²', 'ESPN HD³', 'ESPN HD⁴', 'ESPN HD⁵', 'ESPN HD⁶', 'espn²', 'espn³', 'espn⁴', 'espn⁵', 'espn⁶', 'espn hd²', 'espn hd³', 'espn hd⁴', 'espn hd⁵', 'espn hd⁶', 'Fox Sports²', 'Fox Sports³', 'Fox Sports⁴', 'Fox Sports⁵', 'Fox Sports HD²', 'Fox Sports HD³', 'Fox Sports HD⁴', 'Fox Sports HD⁵'] },
  { id: 'cat_esportes', name: 'Esportes', keywords: ['esportes', 'premiere', 'futebol', 'libertadores', 'cazé', 'desempedido', 'nsports', 'canais | esportes', 'canais | lutas', 'canais | premiere', 'ao vivo | brasileirão', 'ao vivo | copa do brasil', 'ao vivo | futebol', 'ao vivo | esportes', 'band sports', 'combate', 'ufc fightpass', 'dazn f1', 'auto tv', 'ge tv', 'xsports', 'fifa plus', 'realmadrid tv', 'barça one', 'fuel tv', 'woohoo', 'canal do inter', 'pontv', 'trace sport stars', 'esportes brasília', 'premiere hd', 'premiere fhd', 'premiere 4k', 'premiere 2', 'premiere 3', 'premiere 4', 'premiere 5', 'premiere 6', 'premiere 7', 'premiere 8', 'premiere 9', 'premiere 10', 'premiere1', 'premiere2', 'premiere3', 'premiere4', 'premiere5', 'premiere6', 'premiere7', 'premiere8', 'premiere9', 'premiere10', 'premiere clubes', 'premiere fc', 'band sports hd', 'combate hd', 'esporte interativo', 'ei plus', 'ei maxx', 'ei maxx 2', 'ei maxx 3', 'ei maxx 4', 'tnt sports', 'tnt sports hd', 'space hd', 'space fhd', 'bandsports 2', 'bandsports 3', 'PREMIERE', 'Premiere', 'PREMIERE HD', 'premiere hd', 'PREMIERE FHD', 'premiere fhd', 'PREMIERE 4K', 'premiere 4k', 'PREMIERE CLUBES', 'premiere clubes', 'PREMIERE FC', 'premiere fc', 'COMBATE', 'Combate', 'COMBATE HD', 'combate hd', 'COMBATE FHD', 'combate fhd', 'COMBATE 4K', 'combate 4k', 'BAND SPORTS', 'band sports', 'Band Sports', 'BANDSPORTS', 'bandsports', 'BandSports', 'BAND SPORTS HD', 'band sports hd', 'Band Sports HD', 'BANDSPORTS HD', 'bandsports hd', 'BandSports HD', 'UFC', 'ufc', 'Ufc', 'UFC FIGHT PASS', 'ufc fight pass', 'UFC FightPass', 'TNT SPORTS', 'tnt sports', 'TNT Sports', 'TNT SPORTS HD', 'tnt sports hd', 'TNT Sports HD', 'PREMIERE²', 'PREMIERE³', 'PREMIERE⁴', 'PREMIERE⁵', 'premiere²', 'premiere³', 'premiere⁴', 'premiere⁵', 'COMBATE²', 'COMBATE³', 'COMBATE⁴', 'COMBATE⁵', 'combate²', 'combate³', 'combate⁴', 'combate⁵', 'PREMIERE 1', 'premiere 1', 'COMBATE 1', 'combate 1'] },
  { id: 'cat_filmes', name: 'Filmes e Séries', keywords: ['filmes', 'series', 'séries', 'telecine', 'space', 'tnt', 'south park', 'runtime', 'cine', 'movies', 'canais | filmes e series', 'canais | south park', 'dorama |', 'série |', 'anime |', 'amc', 'tela brasil tv', 'cine brasil', 'mytime movies', 'movie sphere', 'sony one', 'bora filmes', 'cine monde', 'dark flix', 'tv nova play', 'channel one', 'hto filmes', 'telecine hd', 'telecine fhd', 'telecine action', 'telecine premium', 'telecine pipoca', 'telecine fun', 'telecine touch', 'telecine cult', 'telecine 1', 'telecine 2', 'telecine 3', 'telecine 4', 'telecine 5', 'tnt hd', 'tnt fhd', 'tnt 2', 'tnt 3', 'tnt series', 'space hd', 'space fhd', 'space 2', 'amc hd', 'amc 2', 'sony hd', 'sony 2', 'warner hd', 'warner 2', 'fx hd', 'fx 2', 'universal hd', 'universal 2', 'studio universal', 'megapix hd', 'megapix 2', 'cinemax hd', 'cinemax 2', 'hbo 2', 'hbo 3', 'hbo plus', 'hbo family', 'hbo signature', 'paramount 2', 'paramount 3', 'Filmes', 'FILMES', 'Series', 'SERIES', 'Séries', 'SÉRIES', 'Telecine', 'TELECINE', 'Space', 'SPACE', 'TNT', 'Tnt', 'HBO', 'Hbo', 'AMC', 'Amc', 'Sony', 'SONY', 'Warner', 'WARNER', 'FX', 'Fx', 'Universal', 'UNIVERSAL', 'Megapix', 'MEGAPIX', 'Cinemax', 'CINEMAX', 'Paramount', 'PARAMOUNT', 'Movies', 'MOVIES', 'HBO HD', 'HBO FHD', 'HBO 4K', 'Telecine 4K', 'TNT 4K', 'Space 4K', 'AMC FHD', 'AMC 4K', 'Sony FHD', 'Sony 4K', 'Warner FHD', 'Warner 4K', 'FX FHD', 'FX 4K', 'Universal FHD', 'Universal 4K', 'Megapix FHD', 'Megapix 4K', 'Cinemax FHD', 'Cinemax 4K', 'Paramount HD', 'Paramount FHD', 'Paramount 4K', 'hbo hd', 'hbo fhd', 'hbo 4k', 'telecine 4k', 'tnt 4k', 'space 4k', 'amc fhd', 'amc 4k', 'sony fhd', 'sony 4k', 'warner fhd', 'warner 4k', 'fx fhd', 'fx 4k', 'universal fhd', 'universal 4k', 'megapix fhd', 'megapix 4k', 'cinemax fhd', 'cinemax 4k', 'paramount hd', 'paramount fhd', 'paramount 4k', 'HBO HD', 'HBO FHD', 'HBO 4K', 'TELECINE HD', 'TELECINE FHD', 'TELECINE 4K', 'TNT HD', 'TNT FHD', 'TNT 4K', 'SPACE HD', 'SPACE FHD', 'SPACE 4K', 'AMC HD', 'AMC FHD', 'AMC 4K', 'SONY HD', 'SONY FHD', 'SONY 4K', 'WARNER HD', 'WARNER FHD', 'WARNER 4K', 'FX HD', 'FX FHD', 'FX 4K', 'UNIVERSAL HD', 'UNIVERSAL FHD', 'UNIVERSAL 4K', 'MEGAPIX HD', 'MEGAPIX FHD', 'MEGAPIX 4K', 'CINEMAX HD', 'CINEMAX FHD', 'CINEMAX 4K', 'PARAMOUNT HD', 'PARAMOUNT FHD', 'PARAMOUNT 4K', 'Telecine²', 'Telecine³', 'Telecine⁴', 'Telecine⁵', 'Telecine HD²', 'Telecine HD³', 'Telecine HD⁴', 'Telecine HD⁵', 'telecine²', 'telecine³', 'telecine⁴', 'telecine⁵', 'telecine hd²', 'telecine hd³', 'telecine hd⁴', 'telecine hd⁵', 'TNT²', 'TNT³', 'TNT⁴', 'TNT⁵', 'TNT HD²', 'TNT HD³', 'TNT HD⁴', 'TNT HD⁵', 'tnt²', 'tnt³', 'tnt⁴', 'tnt⁵', 'Space²', 'Space³', 'Space⁴', 'Space⁵', 'Space HD²', 'Space HD³', 'Space HD⁴', 'Space HD⁵', 'space²', 'space³', 'space⁴', 'space⁵', 'HBO²', 'HBO³', 'HBO⁴', 'HBO⁵', 'hbo²', 'hbo³', 'hbo⁴', 'hbo⁵', 'a&e hd', 'a&e fhd', 'axn hd', 'paramount network hd', 'usa network hd', 'syfy hd', 'lifetime hd', 'telecine action hd', 'telecine pipoca hd', 'telecine premium hd', 'telecine touch hd', 'telecine cult hd', 'telecine fun hd', 'sony channel hd', 'hbo+ hd', 'hbo 2 hd', 'hbo family hd', 'hbo xtreme hd', 'hbo signature hd', 'studio universal hd', 'studio universal fhd', 'universal channel hd', 'universal channel fhd', 'bangbang', 'cinerama', 'tela brasil tv', 'cine brasil hd', 'mytime movies', 'movie sphere', 'sony one emocoes', 'sony one classics', 'bora filmes', 'cine monde', 'dark flix', 'tv nova play', 'channel one', 'hto filmes', 'runtime ação hd', 'runtime tv e filmes grátis', 'runtime comédia hd', 'runtime família', 'runtime romance', 'cine espanto', 'runtime crime', 'pluto tv netmovies', 'pluto tv bang bang', 'runtime', 'pluto tv filmes aventura', 'pluto tv terror trash', 'pluto tv cine crime', 'pluto tv cine inspiração', 'pluto tv cine sucessos', 'pluto tv filmes ação', 'pluto tv cine terror', 'pluto tv cine drama', 'pluto tv cine família', 'pluto tv cine romance', 'pluto tv cine comédia romântica', 'pluto tv cine comédia', 'filmes suspense', 'pluto tv cine clássicos', 'pluto tv filmes nacionais', 'filmelier tv', 'pluto tv ficção científica', 'pluto tv adrenalina freezone', 'hallo! classic', 'hallo! movies', 'hallo! series', 'classique tv series', 'gospel movies tv'] },
  { id: 'cat_noticias', name: 'Notícias', keywords: ['notícias', 'noticias', 'news', 'cnn', 'canais | notícias', 'tvd news', 'bm&c news', 'times brasil', 'jp news', 'cnn brasil', 'globo news', 'band news', 'avança brasil', '4 por 4', 'resumo da ópera', '011 news', 'record news', 'tv câmera', 'tv senado', 'tv justiça', 'canal gov', 'tv videonews', 'cnn hd', 'cnn fhd', 'cnn 2', 'cnn international', 'globonews hd', 'globonews 2', 'bandnews hd', 'bandnews 2', 'band news 2', 'record news hd', 'record news 2', 'cultura news', 'euronews', 'france 24', 'dw brasil', 'tv brasil news', 'rede tv news', 'sbt news', 'tv 247', 'brasil 247', 'jovem pan news', 'jovem pan 2', 'jovem pan 3', 'Notícias', 'NOTÍCIAS', 'Noticias', 'NOTICIAS', 'News', 'NEWS', 'CNN', 'Cnn', 'CNN Brasil', 'CNN BRASIL', 'Globo News', 'GLOBO NEWS', 'Band News', 'BAND NEWS', 'Record News', 'RECORD NEWS', 'TV Câmara', 'TV CÂMARA', 'TV Senado', 'TV SENADO', 'TV Justiça', 'TV JUSTIÇA', 'Jovem Pan', 'JOVEM PAN', 'Jovem Pan News', 'JOVEM PAN NEWS', 'CNN BRASIL HD', 'cnn brasil hd', 'CNN BRASIL FHD', 'cnn brasil fhd', 'CNN BRASIL 4K', 'cnn brasil 4k', 'GLOBONEWS HD', 'globonews hd', 'GLOBONEWS FHD', 'globonews fhd', 'GLOBONEWS 4K', 'globonews 4k', 'GLOBO NEWS HD', 'globo news hd', 'GLOBO NEWS FHD', 'globo news fhd', 'GLOBO NEWS 4K', 'globo news 4k', 'BANDNEWS HD', 'bandnews hd', 'BANDNEWS FHD', 'bandnews fhd', 'BANDNEWS 4K', 'bandnews 4k', 'BAND NEWS HD', 'band news hd', 'BAND NEWS FHD', 'band news fhd', 'BAND NEWS 4K', 'band news 4k', 'RECORDNEWS HD', 'recordnews hd', 'RECORDNEWS FHD', 'recordnews fhd', 'RECORDNEWS 4K', 'recordnews 4k', 'RECORD NEWS HD', 'record news hd', 'RECORD NEWS FHD', 'record news fhd', 'RECORD NEWS 4K', 'record news 4k', 'CNN²', 'CNN³', 'CNN⁴', 'CNN⁵', 'CNN HD²', 'CNN HD³', 'CNN HD⁴', 'CNN HD⁵', 'cnn²', 'cnn³', 'cnn⁴', 'cnn⁵', 'GloboNews²', 'GloboNews³', 'GloboNews⁴', 'GloboNews⁵', 'globonews²', 'globonews³', 'globonews⁴', 'globonews⁵', 'Band News²', 'Band News³', 'Band News⁴', 'Band News⁵', 'Record News²', 'Record News³', 'Record News⁴', 'Record News⁵', 'CNN 1', 'CNN 2', 'CNN 3', 'CNN 4', 'CNN 5', 'cnn 1', 'cnn 3', 'cnn 4', 'cnn 5', 'Cnn 1', 'Cnn 3', 'Cnn 4', 'Cnn 5', 'CNN Brasil', 'CNN BRASIL', 'cnn brasil', 'CNN Brasil HD', 'CNN BRASIL HD', 'cnn brasil hd', 'CNN Brasil FHD', 'CNN Brasil 4K', 'Record News Interior', 'RPC News', 'NSC News', 'TV Gazeta', 'TV GAZETA', 'tv gazeta', 'Jornal da Manhã', 'Jornal Nacional', 'JORNAL NACIONAL', 'jornal nacional', 'RBS Notícias', 'RBS NOTÍCIAS', 'rbs notícias', 'RPC TV', 'RPC tv', 'rpc tv', 'NSC TV', 'NSC tv', 'nsc tv', 'TV Anhanguera', 'TV ANHANGUERA', 'tv anhanguera', 'TV Centre', 'TV CENTRE', 'tv centre', 'TV Verdes Mares', 'TV VERDES MARES', 'tv verdes mares', 'TV Integração', 'TV INTEGRAÇÃO', 'tv integração', 'TV Morena', 'TV MORENA', 'tv morena', 'TV Tribuna', 'TV TRIBUNA', 'tv tribuna'] },
  { id: 'cat_infantil', name: 'Infantil', keywords: ['infantil', 'kids', 'cartoon', 'nick', 'canais | infantil', 'bob esponja', 'pluto tv junior', 'o reino infantil', 'nick clássico', 'babyfirst', 'super zoe', 'rugrats', 'os padrinhos mágicos', 'patrulha canina', 'clouding', 'kid mais', 'kuriakos kids', 'toon googles', 'os jetsons', 'rakuten família', 'nickelodeon', 'nick jr', 'tv ra tim bum', 'cartoon network', 'cartoonito', 'tru tv', 'fox kids', 'tv gallo', 'tooncast', 'discovery kids', 'zoomoo', 'léo e lully', 'retro cartoon', 'tvzyn', 'talking tom', 'universo kids', 'dream works', 'd.p.a', 'mr bean animated', 'dcpc infantil', 'adult swim', 'ministério infantil tv', 'nick hd', 'nick fhd', 'nick 2', 'nick 3', 'cartoon network hd', 'cartoon network 2', 'cartoon network 3', 'discovery kids hd', 'discovery kids 2', 'disney channel', 'disney hd', 'disney 2', 'disney 3', 'disney junior', 'disney xd', 'disney xd 2', 'gloob', 'gloob hd', 'gloob 2', 'boomerang', 'boomerang hd', 'boomerang 2', 'nicktoons', 'Infantil', 'INFANTIL', 'Kids', 'KIDS', 'Cartoon', 'CARTOON', 'Nick', 'NICK', 'Nickelodeon', 'NICKELODEON', 'Nick Jr', 'NICK JR', 'Cartoon Network', 'CARTOON NETWORK', 'Discovery Kids', 'DISCOVERY KIDS', 'Disney', 'DISNEY', 'Disney Channel', 'DISNEY CHANNEL', 'Disney Junior', 'DISNEY JUNIOR', 'Disney XD', 'DISNEY XD', 'Gloob', 'GLOOB', 'Boomerang', 'BOOMERANG', 'NICK HD', 'nick hd', 'NICK FHD', 'nick fhd', 'NICK 4K', 'nick 4k', 'NICKELODEON HD', 'nickelodeon hd', 'NICKELODEON FHD', 'nickelodeon fhd', 'NICKELODEON 4K', 'nickelodeon 4k', 'CARTOON NETWORK HD', 'cartoon network hd', 'CARTOON NETWORK FHD', 'cartoon network fhd', 'CARTOON NETWORK 4K', 'cartoon network 4k', 'DISCOVERY KIDS HD', 'discovery kids hd', 'DISCOVERY KIDS FHD', 'discovery kids fhd', 'DISCOVERY KIDS 4K', 'discovery kids 4k', 'DISNEY CHANNEL HD', 'disney channel hd', 'DISNEY CHANNEL FHD', 'disney channel fhd', 'DISNEY CHANNEL 4K', 'disney channel 4k', 'DISNEY JUNIOR HD', 'disney junior hd', 'DISNEY JUNIOR FHD', 'disney junior fhd', 'DISNEY JUNIOR 4K', 'disney junior 4k', 'DISNEY XD HD', 'disney xd hd', 'DISNEY XD FHD', 'disney xd fhd', 'DISNEY XD 4K', 'disney xd 4k', 'GLOOB HD', 'gloob hd', 'GLOOB FHD', 'gloob fhd', 'GLOOB 4K', 'gloob 4k', 'BOOMERANG HD', 'boomerang hd', 'BOOMERANG FHD', 'boomerang fhd', 'BOOMERANG 4K', 'boomerang 4k', 'Nick²', 'Nick³', 'Nick⁴', 'Nick⁵', 'Nick HD²', 'Nick HD³', 'Nick HD⁴', 'Nick HD⁵', 'nick²', 'nick³', 'nick⁴', 'nick⁵', 'Cartoon Network²', 'Cartoon Network³', 'Cartoon Network⁴', 'Cartoon Network⁵', 'cartoon network²', 'cartoon network³', 'cartoon network⁴', 'cartoon network⁵', 'Discovery Kids²', 'Discovery Kids³', 'Discovery Kids⁴', 'Discovery Kids⁵', 'Disney²', 'Disney³', 'Disney⁴', 'Disney⁵', 'Disney Channel²', 'Disney Channel³', 'Disney Channel⁴', 'Disney Channel⁵', 'Gloob²', 'Gloob³', 'Gloob⁴', 'Gloob⁵', 'gloob²', 'gloob³', 'gloob⁴', 'gloob⁵', 'NICK 1', 'NICK 2', 'NICK 3', 'NICK 4', 'NICK 5', 'nick 1', 'nick 4', 'nick 5', 'Nick 1', 'Nick 4', 'Nick 5', 'CARTOON NETWORK 1', 'CARTOON NETWORK 4', 'CARTOON NETWORK 5', 'cartoon network 1', 'cartoon network 4', 'cartoon network 5', 'DISNEY 1', 'DISNEY 4', 'DISNEY 5', 'disney 1', 'disney 4', 'disney 5', 'dora a aventura', 'hey arnold!', 'pluto tv cineminha', 'pluto tv desenhos clássicos', 'pluto tv kids club', 'cocoricó', 'bob esponja calça quadrada', 'nick teen', 'pluto tv kids', 'nick jr. club', 'turma da mônica', 'super onze', 'nickelodeon rocket power', 'baby shark'] },
  { id: 'cat_animes', name: 'Animes & Geek', keywords: ['animes', 'geek', 'loading', 'canais | animes & geek', 'dragon ball', 'cavaleiros dos zodiacos', 'naruto', 'anime tv', 'crunchyroll', 'funimation', 'otaku', 'manga', 'pokemon', 'one piece', 'attack on titan', 'my hero academia', 'demon slayer', 'jojo bizarre', 'bleach', 'hunter x hunter'] },
  { id: 'cat_musica', name: 'Música', keywords: ['música', 'musica', 'music', 'mtv', 'canais | música', 'mtv flow latino', 'top tv', 'rede sulamérica tv', 'maisum', 'music top', 'canal 019', 'pop pegajoso', 'kiss tv', 'hallo music', 'gospel music tv', 'hip hop vai além', 'rádio', 'radio', 'pisadinha', 'k-pop', 'pop', 'energia 97', 'gospel internacional', 'rádio salvador', 'antena 1', 'brado rádio', 'gavião fm', 'rádio muriaé', 'web rádio jp', 'mtv hd', 'mtv fhd', 'mtv 2', 'mtv 3', 'mtv hits', 'vh1', 'vh1 hd', 'vh1 2', 'vh1 classic', 'music box', 'music choice', 'vevo', 'stingray music', 'multishow hd', 'multishow 2', 'bis hd', 'bis 2', 'woohoo hd', 'woohoo 2', 'trace urban', 'trace gospel', 'trace latina', 'MTV', 'Mtv', 'MTV HD', 'MTV FHD', 'MTV 4K', 'MTV BRASIL', 'mtv brasil', 'MTV Brasil', 'VH1', 'Vh1', 'VH1 HD', 'VH1 FHD', 'VH1 4K', 'MULTISHOW', 'Multishow', 'MULTISHOW HD', 'multishow hd', 'MULTISHOW FHD', 'multishow fhd', 'MULTISHOW 4K', 'multishow 4k', 'BIS', 'Bis', 'BIS HD', 'bis hd', 'BIS FHD', 'bis fhd', 'BIS 4K', 'bis 4k', 'MUSIC BOX', 'music box', 'Music Box', 'VEVO', 'vevo', 'Vevo', 'KISS FM', 'kiss fm', 'Kiss FM', 'ENERGIA 97', 'energia 97', 'Energia 97', 'MTV²', 'MTV³', 'MTV⁴', 'MTV⁵', 'mtv²', 'mtv³', 'mtv⁴', 'mtv⁵', 'VH1²', 'VH1³', 'VH1⁴', 'VH1⁵', 'vh1²', 'vh1³', 'vh1⁴', 'vh1⁵', 'BIS²', 'BIS³', 'BIS⁴', 'BIS⁵', 'bis²', 'bis³', 'bis⁴', 'bis⁵', 'MTV 1', 'MTV 4', 'MTV 5', 'mtv 1', 'mtv 4', 'mtv 5', 'VH1 1', 'VH1 3', 'VH1 4', 'VH1 5', 'vh1 1', 'vh1 3', 'vh1 4', 'vh1 5', 'MTV Live', 'MTV LIVE', 'mtv live', 'MTV Live HD', 'MTV LIVE HD', 'mtv live hd', 'MTV Hits', 'MTV HITS', 'mtv hits', 'MTV Hits HD', 'MTV HITS HD', 'mtv hits hd', 'VH1 Classic', 'VH1 CLASSIC', 'vh1 classic', 'VH1 Classics', 'VH1 CLASSICS', 'vh1 classics', 'VH1 Mega Hits', 'VH1 MEGA HITS', 'vh1 mega hits'] },
  { id: 'cat_variedades', name: 'Variedades', keywords: ['variedades', 'discovery', 'animal', 'food', 'investigação', 'canais | variedades', 'canais | reality', 'multishow', 'mtv', 'bis', 'comedy central', 'tbs', 'canal brasil', 'e!', 'prime box', 'arte 1', 'film & arts', 'tlc', 'gnt', 'modo viagem', 'receita fast', 'hallo doc', 'discovery turbo', 'id', 'animal planet', 'rakuten documentários', 'pluto tv investigação', 'revry brasil', 'whe play', 'royalworld', 'viajando pelo brasil', 'diatv', 'fit dance', 'cultne tv', 'salon line', 'tratamento de choque', 'discovery hd', 'discovery fhd', 'discovery 2', 'discovery 3', 'discovery channel', 'discovery science', 'discovery civilization', 'discovery theater', 'animal planet hd', 'animal planet 2', 'national geographic', 'nat geo hd', 'nat geo 2', 'nat geo wild', 'history channel', 'history hd', 'history 2', 'h2', 'multishow hd', 'multishow 2', 'gnt hd', 'gnt 2', 'tlc hd', 'tlc 2', 'e! hd', 'e! 2', 'comedy central hd', 'comedy central 2', 'canal brasil hd', 'canal brasil 2', 'bis hd', 'bis 2', 'mtv hd', 'mtv 2', 'Discovery Turbo HD', 'DISCOVERY TURBO HD', 'discovery turbo hd', 'Discovery Theater', 'DISCOVERY THEATER', 'Discovery Science', 'DISCOVERY SCIENCE', 'Discovery Home & Health', 'DISCOVERY HOME & HEALTH', 'discovery home', 'Discovery World', 'DISCOVERY WORLD', 'National Geographic HD', 'NATIONAL GEOGRAPHIC HD', 'Animal Planet HD', 'ANIMAL PLANET HD', 'History Channel HD', 'HISTORY CHANNEL HD', 'COMEDY CENTRAL', 'Comedy Central', 'comedy central hd', 'Comedy Central HD', 'COMEDY CENTRAL HD', 'ID Investigação', 'ID INVESTIGAÇÃO', 'id investigação', 'TLC HD', 'TLC FHD', 'TLC 4K', 'A&E', 'a&e', 'A&E HD', 'LIFETIME', 'Lifetime', 'lifetime', 'Lifetime HD', 'LIFETIME HD', 'multishow hd', 'mtv hd', 'bis hd', 'discovery world hd', 'discovery channel hd', 'discovery science hd', 'discovery theater hd', 'discovery theater fhd', 'film & arts hd'] },
  { id: 'cat_novelas', name: 'Novelas', keywords: ['novelas', 'televisa', 'telenovelas', 'canais | novelas', 'globoplay novelas', 'a terra prometida', 'os dez mandamentos', 'malhação fast', 'a escrava isaura', 'tvi ficção', 'sic novelas', 'sony novelas', 'viva hd', 'viva fhd', 'canal viva', 'globo premium', 'sbt novelas', 'record novelas', 'mega pix', 'megapix novelas', 'tlnovelas', 'pasiones', 'de pelicula', 'univision novelas'] },
  { id: 'cat_reality', name: 'Reality Shows', keywords: ['reality', 'masterchef', 'shark tank', 'canais | reality', 'estrela da casa', 'mtv com o ex'] },
  { id: 'cat_comedia', name: 'Comédia', keywords: ['comédia', 'comedia', 'comedy', 'kenan', 'failarmy', 'canais | comédia', 'porta dos fundos', 'drake e josh', 'friends', 'um maluco no pedaço', 'os trapalhões', 'todo mundo odeia o cris', 'pegadinhas silvio santos', 'as visões da raven', 'a grande família', 'escolinha raimundo', 'eu a patroa e as crianças', 'tô de graça'] },
  { id: 'cat_lutas', name: 'Lutas', keywords: ['lutas', 'fight', 'combat', 'ufc', 'pfl', 'combate', 'ufc fightpass', 'lucha libre', 'combatv', 'fite', 'sft combat'] },
  { id: 'cat_internacional', name: 'Internacional', keywords: ['internacional', 'sic', 'rtp', 'tvi', 'cnn international', 'canais | internacional', 'eleven sports', 'canal 11', 'tv5 monde', 'fox news now', 'sony canal comedias', 'deportes', 'wwe youtube'] },
  { id: 'cat_pluto', name: 'Pluto TV', keywords: ['pluto'] },
  { 
    id: 'cat_aberto', 
    name: 'Canais Abertos', 
    keywords: [
      // Canais básicos e cultura
      'aberto', 'cultura', 'tve', 'redtv', 'brasil', 'canais | aberto', 'redetv',
      // TVs regionais
      'tv são luís', 'imperial tv', 'rtn tv', 'tv ceará', 'tv diário', 'tve bahia', 'tve rs', 'tv brasil es', 
      'tv gazeta', 'tv cultura', 'catve tv cultura', 'elytv', 'esflix tv', 'tv evangelizar', 'tv guará', 
      'rns tv', 'santa cruz web tv', 'tv novo tempo', 'olha tv', 'tv paraná turismo', 'tv candidés', 
      'tv rbc', 'gogo play', 'bs tv', 'tv clássicos', 'web tv clássicos', 'otaku sign tv', 'lasstv', 
      'br super tv', 'tv aparecida', 'pbc tv', 'central tv', 'ulb tv', 'aw tv', 'top mix tv', 'tvm pará',
      // Canais religiosos e familiares
      'rede vida', 'gln tv', 'tv grão pará', 'tv litoral', 'tv osório news', 'tela viva tv', 'istv', 
      'rede família', 'nbt', 'ngt', 'canal 29', 'xtreme tv', 'tv aracati', 'life channel brasil', 
      'tv diário do sertão', 'sou tv', 'tv marajoara', 'rede brasil', 'vivax tv', 'tv brasil hits', 
      'amazonsat', 'terra viva',
      // Canais especializados
      'canal do boi', 'tv notícias agrícolas', 'agro canal', 'canal rural', 'agromais', 'agro plus', 
      'tv brasil central', 'rede século 21', 'yeeaah', 'conectv', 'tv a folha', 'astral tv', 'rede utv', 
      'cultura internacional', 'caravana play', 'tv cidade verde', 'abc brasil', 'wtj tv minas', 'play tv', 
      'ypê tv', 'rede sdp tv', 'seven tv', 'sptv', 'imperial tv', 'tv mais família', 'tv fala litoral', 
      'canal ok tv', 'img tv', 'tv cel', 'tv vianney', 'tv recanto da fé', 'tv imaculada',
      // Canais religiosos
      'canção nova', 'igreja universal', 'grjngo', 'web tv progresso', 'vrt channel', 'tenda tv', 
      'gospel internacional', 'gospel music tv', 'gospel cartoon', 'gostei gospel tv', 'gospel movies tv', 
      'rede gospel', 'tv gospel', 'rede qdm', 'tv gramado', 'brazitv', 'tvc', 'rede cnt', 'tv união',
      'gospel movies', 'GOSPEL MOVIES', 'Gospel Movies TV', 'GOSPEL MOVIES TV', 'gospel movies tv',
      'Gospel Music TV', 'GOSPEL MUSIC TV', 'gospel music tv hd', 'Gospel Music TV HD', 'GOSPEL MUSIC TV HD',
      'Rede Gospel', 'REDE GOSPEL', 'rede gospel hd', 'Rede Gospel HD', 'REDE GOSPEL HD',
      'TV Gospel', 'TV GOSPEL', 'tv gospel hd', 'TV Gospel HD', 'TV GOSPEL HD',
      'Gospel Internacional', 'GOSPEL INTERNACIONAL', 'gospel internacional hd', 
      'tv vitória pe', 'tv sim', 'tv serra dourada', 'vitrine esportiva', 'tv recon', 'tv paraense', 
      'tv da gente', 'o dia tv', 'catve 2', 'tve ms', 'tve rs', 'rs news webtv', 'tv serra américa', 
      'ministério infantil tv', 'rede minas', 'tv nbn', 'vclassic tv', 'tv sonata', 'tv jornal', 
      'rede meio norte', 'tv mais brasil', 'rede clone tv', 'tv japi', 'rede tv sul', 'rede sul', 
      'vila tv', 'tv channel network', 'rede mundo da televisão', 'primer tv', 'tv chroma', 'qtal channel', 
      'vv8 tv', 'web tv campeão de tudo', 'tvc brasil', 'terceira via', 'tv rio preto', 'rede ibtv', 
      'tv visual', 'demais tv', 'wtv brasil', 'canal smart', 'tv nostalgia', 'web tv boa nova', 'agitomax', 
      'universo tv', 'combrasil', 'tv santa maria', 'tv sol comunidade', 'igreja mundial',
      // Canais públicos em HD e variações numéricas
      'tv cultura sp', 'tv cultura rj', 'tv cultura hd', 'futura hd', 'tv brasil hd', 'tv senado hd', 
      'tv justiça hd', 'tv câmara hd', 'rede tv hd', 'rede tv fhd', 'tv gazeta sp', 'tv gazeta hd', 
      'cnb tv', 'tv band sp', 'tv band rj', 'tv band hd', 'rede tv!', 'rede tv', 'redtv!', 
      'tv cultura 2', 'tv brasil 2', 'futura 2', 'canal brasil 2', 'tv escola 2', 'tv senado 2', 
      'tv justiça 2', 'tv câmara 2'
    ] 
  }
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
        options: ['IPTV']
      }
    ]
  })),
  
  // Prefixos de ID
  idPrefixes: ['iptv_'],
  
  // Configurações visuais
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/1200px-Flag_of_Brazil.svg.png',
  background: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  
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

        // Filtrar URLs válidas - aceitar máximo de formatos de streaming possíveis
        if (url && name && name.length > 0) {
          
          // Protocolos de streaming suportados
          const supportedProtocols = [
            'http://', 'https://',      // HTTP/HTTPS streams
            'rtmp://', 'rtmps://',      // RTMP streams  
            'rtsp://',                  // RTSP streams
            'udp://',                   // UDP streams
            'rtp://',                   // RTP streams
            'mms://',                   // MMS streams
            'mmsh://', 'mmst://'        // Microsoft Media Server
          ];
          
          const hasValidProtocol = supportedProtocols.some(protocol => 
            url.toLowerCase().startsWith(protocol)
          );
          
          if (hasValidProtocol) {
            // Filtrar arquivos não-streaming (incluindo .mp4 conforme solicitado)
            const invalidExtensions = [
              '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.bmp',  // Imagens
              '.txt', '.html', '.htm', '.xml', '.json',                          // Documentos
              '.zip', '.rar', '.7z', '.tar', '.gz',                             // Arquivos compactados
              '.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv'                    // Vídeos offline (conforme solicitado)
            ];
            
            const urlLower = url.toLowerCase();
            const isInvalidFile = invalidExtensions.some(ext => urlLower.endsWith(ext));
            
            // CORREÇÃO: Aceitar QUALQUER URL válida, exceto arquivos proibidos
            // Não filtrar por palavras específicas - deixar o Stremio decidir se funciona
            const isValidUrl = hasValidProtocol && !isInvalidFile;
            
            if (isValidUrl) {
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
        const nameLower = ch.name.toLowerCase();
        return category.keywords.some(keyword => 
          groupLower.includes(keyword.toLowerCase()) || 
          nameLower.includes(keyword.toLowerCase())
        );
      })
      .map(ch => ({
        id: ch.id,
        type: 'tv',
        name: ch.name,
        poster: ch.logo || 'https://img.icons8.com/color/480/tv.png',
        description: `📺 ${ch.group}`,
        genres: ['IPTV'],
        releaseInfo: 'Ao Vivo'
      }));
      // CORREÇÃO: Removido limite de 100 canais - mostrar TODOS os canais encontrados
    
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
        genres: ['IPTV'],
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
