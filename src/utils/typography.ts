import Typography from 'typography'
import CodePlugin from 'typography-plugin-code'
import funstonTheme from 'typography-theme-funston'

funstonTheme.overrideThemeStyles = () => ({
  'html': {
    font: `100%/1.4 'Cabin Condensed','georgia',sans-serif`,
    letterSpacing: '.05em'
  },
  'h2': {
    fontWeight: 700,
    marginTop: '48px',
    fontSize: '2rem'
  },
  'h3': {
    fontWeight: 700,
    fontSize: '1.8rem'
  },
  'h4': {
    fontWeight: 700,
    fontSize: '1.5rem'
  },
  'blockquote': {
    lineHeight: '1.6rem',
    fontSize: '1rem',
    backgroundColor: '#f8f8f8',
    borderLeft: '0.2625rem solid #cbcbcb',
    paddingTop: '10px',
    paddingBottom: '10px'
  },
  'a': {
    color: '#358ccb'
  },
  'p': {
    lineHeight: '1.6rem'
  },
  'ol': {
    lineHeight: '1.6rem'
  }
})

funstonTheme.plugins = [
  new CodePlugin()
]

const typography = new Typography(funstonTheme)

export default typography
