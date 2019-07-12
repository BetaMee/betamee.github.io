import Typography from 'typography'
import CodePlugin from 'typography-plugin-code'
import funstonTheme from 'typography-theme-funston'

funstonTheme.overrideThemeStyles = () => ({
  // 'h1,h2,h3': {
  //   borderBottom: '1px solid hsla(0,0%,0%,0.07)'
  // }
})

funstonTheme.plugins = [
  new CodePlugin()
]

const typography = new Typography(funstonTheme)

export default typography
