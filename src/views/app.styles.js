import { createUseStyles } from 'react-jss'

const useAppStyles = createUseStyles({
  '@font-face': [
    {
      fontFamily: 'Modern Era',
      src: 'url(./fonts/modern-era/ModernEra-ExtraBold.woff2) format(woff2)',
      fallbacks: [
        { src: 'url(./fonts/modern-era/ModernEra-ExtraBold.woff) format(woff)' },
        { src: 'url(./fonts/modern-era/ModernEra-ExtraBold.ttf) format(truetype)' }
      ],
      fontWeight: 800,
      fontStyle: 'normal',
      fontDisplay: 'swap'
    },
    {
      fontFamily: 'Modern Era',
      src: "url('./fonts/modern-era/ModernEra-Regular.woff2') format('woff2')",
      fallbacks: [
        { src: "url('./fonts/modern-era/ModernEra-Regular.woff') format('woff')" },
        { src: "url('./fonts/modern-era/ModernEra-Regular.ttf') format('truetype')" }
      ],
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontDisplay: 'swap'
    },
    {
      fontFamily: 'Modern Era',
      src: 'url(./fonts/modern-era/ModernEra-Medium.woff2) format(woff2)',
      fallbacks: [
        { src: 'url(./fonts/modern-era/ModernEra-Medium.woff) format(woff)' },
        { src: 'url(./fonts/modern-era/ModernEra-Medium.ttf) format(truetype)' }
      ],
      fontWeight: 500,
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
      alignItems: 'center'
    },
    body: {
      fontFamily: 'Modern Era'
    }
  }
})

export default useAppStyles
