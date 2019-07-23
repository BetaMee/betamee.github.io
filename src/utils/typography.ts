import Typography from 'typography'
import CodePlugin from 'typography-plugin-code'
import funstonTheme from 'typography-theme-funston'

funstonTheme.overrideThemeStyles = () => ({
  'html': {
    font: `100%/1.4 'Cabin Condensed','georgia',sans-serif`
  },
  'h2': {
    fontWeight: 700,
    marginTop: '48px',
    fontSize: '2rem'
  },
  'h3': {

  },
  'h4': {
    
  }
})

funstonTheme.plugins = [
  new CodePlugin()
]

const typography = new Typography(funstonTheme)

export default typography
