import Typography from 'typography'

import githubTheme from 'typography-theme-github'

githubTheme.overrideThemeStyles = ({ rhythm }, options) => ({
  'h1,h2,h3': {
    borderBottom: '0px solid hsla(0,0%,0%,0.07)'
  }
})

const typography = new Typography(githubTheme)

export default typography