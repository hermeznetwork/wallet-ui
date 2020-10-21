const theme = {
  palette: {
    primary: {
      main: '#faf4ea',
      dark: '#f6e9d3'
    },
    secondary: {
      light: '#fef5ed',
      main: '#e75a2b',
      dark: '#d8853b'
    },
    white: '#ffffff',
    black: '#2b2b2b',
    grey: {
      soLight: 'rgba(122, 124, 137, 0.46)',
      veryLight: '#e1e1f1',
      light: '#f3f3f8',
      main: '#888baa',
      dark: '#7a7c89'
    },
    red: {
      light: 'rgba(255, 75, 64, 0.15)',
      main: '#ff4b40'
    },
    orange: {
      light: 'rgba(242, 153, 74, 0.1)',
      main: '#ffa600',
      dark: '#d8853b'
    }
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    bold: '700',
    extraBold: '800'
  },
  spacing: (value) => value * 8,
  headerHeight: 72
}

export default theme
