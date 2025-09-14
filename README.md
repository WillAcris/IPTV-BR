# 🇧🇷 IPTV Brasil - Addon para Stremio

![Version](https://img.shields.io/badge/version-3.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)

## 📺 Sobre

O **IPTV Brasil** é um addon completo para o Stremio que oferece acesso aos principais canais brasileiros de televisão, organizados por categorias para facilitar a navegação.

### ✨ Características

- 🎯 **+350 Canais** organizados em 21 categorias
- 📱 **Interface Intuitiva** com busca por categoria
- 🔄 **Atualizações Automáticas** da lista de canais
- ⚡ **Cache Inteligente** para melhor performance
- 🌐 **Multiplataforma** - funciona em qualquer dispositivo com Stremio

## 📋 Categorias Disponíveis

### 📺 **Canais Principais**
- 🌟 Canais Globo
- 🔴 Canais Record
- 🎭 Canais SBT  
- 📻 Canais Band

### ⚽ **Esportes**
- 🏆 SporTV
- 🎯 ESPN
- ⚽ Esportes Gerais
- 🥊 Lutas (UFC, PFL)

### 🎬 **Entretenimento**
- 🎭 Filmes e Séries
- 🌟 Reality Shows
- 😂 Comédia
- 📚 Novelas

### 👶 **Infantil & Jovem**
- 🎨 Infantil
- 🎌 Animes & Geek

### 📰 **Informação**
- 📺 Notícias
- 🌍 Internacional

### 🎵 **Variedades**
- 🎵 Música
- 🎪 Variedades
- 📡 Canais Abertos
- 📻 Rádios
- 📺 Pluto TV

## 🚀 Instalação Rápida

[![Apoiar Projeto](https://img.shields.io/badge/💰%20Apoiar%20o%20Projeto-LivePix-ff6b35?style=flat-square)](https://livepix.gg/willacris) [![GitHub Stars](https://img.shields.io/github/stars/WillAcris/IPTV-BR?style=flat-square)](https://github.com/WillAcris/IPTV-BR)

### 1. Adicionar ao Stremio
```
stremio://iptv-br.onrender.com/manifest.json
```

### 2. Instalação Local
```bash
# Clone o repositório
git clone https://github.com/WillAcris/IPTV-BR.git

# Entre na pasta
cd IPTV-BR

# Instale as dependências
npm install

# Execute o addon
npm start
```

O addon será iniciado em `http://localhost:7000`

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js >= 14.0.0
- npm ou yarn

### Scripts Disponíveis
```bash
npm start     # Inicia o addon
npm run dev   # Desenvolvimento com auto-reload
```

### Estrutura do Projeto
```
IPTV-BR/
├── index.js          # Arquivo principal do addon
├── package.json      # Dependências e scripts
├── LICENSE           # Licença MIT
└── README.md         # Documentação
```

## 🔧 Configuração

### Variáveis de Ambiente
```bash
PORT=7000             # Porta do servidor (padrão: 7000)
```

### Personalização
Você pode modificar as categorias e palavras-chave no arquivo `index.js`:

```javascript
const CATEGORIES = [
  { 
    id: 'cat_exemplo', 
    name: 'Minha Categoria', 
    keywords: ['palavra1', 'palavra2'] 
  }
  // ...
];
```

## 📱 Uso no Stremio

1. **Abra o Stremio**
2. **Vá para Addons**
3. **Cole a URL do addon**
4. **Instale e aproveite!**

### Navegação
- Acesse **Descobrir → TV** 
- Escolha uma categoria
- Clique no canal desejado
- Aproveite o conteúdo!

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. 🐛 Reportar bugs
2. 💡 Sugerir melhorias
3. 🔧 Enviar pull requests
4. ⭐ Dar uma estrela no projeto

### Como Contribuir
1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## ⚠️ Aviso Legal

Este addon apenas organiza e apresenta conteúdo publicamente disponível na internet. Não hospedamos ou distribuímos conteúdo protegido por direitos autorais. Os usuários são responsáveis pelo uso adequado do conteúdo acessado.

## � Apoie o Projeto

Gostou do addon? Ajude a manter o projeto ativo!

[![Doar via LivePix](https://img.shields.io/badge/💰%20Doar-LivePix-brightgreen?style=for-the-badge)](https://livepix.gg/willacris)

**🎯 Por que apoiar?**
- Mantém o servidor online 24/7
- Permite adicionar novos canais
- Melhora a qualidade do serviço
- Incentiva o desenvolvimento contínuo

## �📞 Suporte

- 📧 Email: willacris023@proton.me
- 🐛 Issues: [GitHub Issues](https://github.com/WillAcris/IPTV-BR/issues)
- 💰 Doações: [LivePix](https://livepix.gg/willacris)
- ⭐ Avaliação: Deixe sua estrela no GitHub!

---

<p align="center">
  Feito com ❤️ para a comunidade brasileira<br>
  <strong>IPTV Brasil</strong> - Sua TV favorita no Stremio
</p>
