const ghpages = require('gh-pages')

ghpages.publish('public', {
  branch: 'master',
  repo: 'git@github.com:BetaMee/betamee.github.io.git'
}, () => {
  // eslint-disable-next-line no-console
  console.log('✨ Deploy Complete! 😎👨‍💻🌆')
})