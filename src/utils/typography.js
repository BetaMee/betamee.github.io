import Typography from 'typography'
import CodePlugin from 'typography-plugin-code'
import githubTheme from 'typography-theme-github'

githubTheme.overrideThemeStyles = ({ rhythm }, options) => ({
  'h1,h2,h3': {
    borderBottom: '0px solid hsla(0,0%,0%,0.07)'
  }
})

githubTheme.plugins = [
  new CodePlugin(),
]

const typography = new Typography(githubTheme)

export default typography
