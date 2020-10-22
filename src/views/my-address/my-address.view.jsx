import React from 'react'
import { connect } from 'react-redux'
import { useTheme } from 'react-jss'
import QRCode from 'qrcode.react'

import useMyAddressStyles from './my-address.styles'
import withAuthGuard from '../shared/with-auth-guard/with-auth-guard.view'
import Container from '../shared/container/container.view'
import { changeHeader } from '../../store/global/global.actions'
import { MY_ADDRESS } from '../../constants'

function MyAddress ({ metaMaskWalletTask, onChangeHeader }) {
  const theme = useTheme()
  const classes = useMyAddressStyles()

  React.useEffect(() => {
    onChangeHeader({ type: 'page', data: { title: 'My address', previousRoute: '/' } })
  }, [onChangeHeader])

  return (
    <Container backgroundColor={theme.palette.primary.main} fullHeight>
      <div className={classes.root}>
        {
          metaMaskWalletTask.status === 'successful'
            ? (
              <>
                <QRCode
                  value={metaMaskWalletTask.data.hermezEthereumAddress}
                  size={MY_ADDRESS.QR_CODE_SIZE}
                  bgColor='transparent'
                  fgColor={theme.palette.black}
                  className={classes.qrCode}
                />
                <p className={classes.address}>
                  {metaMaskWalletTask.data.hermezEthereumAddress}
                </p>
              </>
            )
            : <></>
        }
      </div>
    </Container>
  )
}

const mapStateToProps = (state) => ({
  metaMaskWalletTask: state.global.metaMaskWalletTask
})

const mapDispatchToProps = (dispatch) => ({
  onChangeHeader: (headerData) => dispatch(changeHeader(headerData))
})

export default withAuthGuard(connect(mapStateToProps, mapDispatchToProps)(MyAddress))
