import { createUseStyles } from 'react-jss'

const useAppStyles = createUseStyles({
  '@font-face': [
    {
      fontFamily: 'Modern Era',
      src: "url('./fonts/modern-era/ModernEra-Regular.woff2') format('woff2')",
      fallbacks: [
        { src: "url('./fonts/modern-era/ModernEra-Regular.woff') format('woff')" },
        { src: "url('./fonts/modern-era/ModernEra-Regular.ttf') format('truetype')" }
      ],
      fontWeight: 400,
      fontStyle: 'normal',
      fontDisplay: 'swap'
    },
    {
      fontFamily: 'Modern Era',
      src: "url('./fonts/modern-era/ModernEra-Medium.woff2') format('woff2')",
      fallbacks: [
        { src: "url('./fonts/modern-era/ModernEra-Medium.woff') format('woff')" },
        { src: "url('./fonts/modern-era/ModernEra-Medium.ttf') format('truetype')" }
      ],
      fontWeight: 500,
      fontStyle: 'normal',
      fontDisplay: 'swap'
    },
    {
      fontFamily: 'Modern Era',
      src: "url('./fonts/modern-era/ModernEra-Bold.woff2') format('woff2')",
      fallbacks: [
        { src: "url('./fonts/modern-era/ModernEra-Bold.woff') format('woff')" },
        { src: "url('./fonts/modern-era/ModernEra-Bold.ttf') format('truetype')" }
      ],
      fontWeight: 700,
      fontStyle: 'normal',
      fontDisplay: 'swap'
    },
    {
      fontFamily: 'Modern Era',
      src: "url('./fonts/modern-era/ModernEra-ExtraBold.woff2') format('woff2')",
      fallbacks: [
        { src: "url('./fonts/modern-era/ModernEra-ExtraBold.woff') format('woff')" },
        { src: "url('./fonts/modern-era/ModernEra-ExtraBold.ttf') format('truetype')" }
      ],
      fontWeight: 800,
      fontStyle: 'normal',
      fontDisplay: 'swap'
    }
  ],
  '@global': {
    '*': {
      boxSizing: 'border-box'
    },
    '#root': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100vh'
    },
    html: {
      minHeight: '100vh',
      height: '100%'
    },
    body: {
      fontFamily: 'Modern Era',
      fontSize: 16,
      minHeight: '100vh'
    },
    a: {
      textDecoration: 'none',
      color: 'inherit'
    },
    p: {
      margin: 0
    },
    h1: {
      margin: 0
    }
  }
})

export default useAppStyles
