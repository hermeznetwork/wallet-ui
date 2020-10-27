import React from 'react'
import { useTheme } from 'react-jss'

import Spinner from '../spinner/spinner.view'
import useInfiniteScrollStyles from './infinite-scroll.styles'

const TRESHOLD = 0.9

function InfiniteScroll ({
  dataLength,
  asyncTaskStatus,
  children,
  onLoadNextPage,
  paginationData
}) {
  const theme = useTheme()
  const classes = useInfiniteScrollStyles()
  const [shouldLoad, setShouldLoad] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const ref = React.useRef()

  React.useEffect(() => {
    const onScroll = () => {
      if (ref.current.getBoundingClientRect().bottom * TRESHOLD <= window.innerHeight) {
        setShouldLoad(true)
      }
    }

    if (ref) {
      document.addEventListener('scroll', onScroll)

      return () => document.removeEventListener('scroll', onScroll)
    }
  }, [ref, setIsLoading])

  React.useEffect(() => {
    if (shouldLoad && paginationData.hasMoreItems && !isLoading) {
      setShouldLoad(false)
      setIsLoading(true)
      onLoadNextPage(paginationData.fromItem)
    }
  }, [paginationData, shouldLoad, isLoading, onLoadNextPage, setIsLoading])

  React.useEffect(() => {
    if (asyncTaskStatus === 'successful') {
      setIsLoading(false)
    }
  }, [asyncTaskStatus, setIsLoading])

  return (
    <div
      className={classes.root}
      ref={ref}
    >
      {children}
      <div className={classes.spinnerWrapper}>
        {isLoading && <Spinner size={theme.spacing(3)} />}
      </div>
    </div>
  )
}

export default InfiniteScroll
