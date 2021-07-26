import {
  ReactComponent as eth,
  ReactComponent as weth
} from '../../node_modules/cryptocurrency-icons/svg/icon/eth.svg'
import { ReactComponent as usdc } from '../../node_modules/cryptocurrency-icons/svg/icon/usdc.svg'
import { ReactComponent as usdt } from '../../node_modules/cryptocurrency-icons/svg/icon/usdt.svg'
import { ReactComponent as dai } from '../../node_modules/cryptocurrency-icons/svg/icon/dai.svg'
import { ReactComponent as wbtc } from '../../node_modules/cryptocurrency-icons/svg/icon/wbtc.svg'
import { ReactComponent as uni } from '../../node_modules/cryptocurrency-icons/svg/icon/uni.svg'
import { ReactComponent as sushi } from '../../node_modules/cryptocurrency-icons/svg/icon/sushi.svg'
import { ReactComponent as comp } from '../../node_modules/cryptocurrency-icons/svg/icon/comp.svg'
import { ReactComponent as bal } from '../../node_modules/cryptocurrency-icons/svg/icon/bal.svg'
import { ReactComponent as aave } from '../../node_modules/cryptocurrency-icons/svg/icon/aave.svg'
import { ReactComponent as yfi } from '../../node_modules/cryptocurrency-icons/svg/icon/yfi.svg'
import { ReactComponent as link } from '../../node_modules/cryptocurrency-icons/svg/icon/link.svg'
import { ReactComponent as snt } from '../../node_modules/cryptocurrency-icons/svg/icon/snt.svg'
import { ReactComponent as bat } from '../../node_modules/cryptocurrency-icons/svg/icon/bat.svg'
import { ReactComponent as matic } from '../../node_modules/cryptocurrency-icons/svg/icon/matic.svg'
import { ReactComponent as mkr } from '../../node_modules/cryptocurrency-icons/svg/icon/mkr.svg'
import { ReactComponent as bnt } from '../../node_modules/cryptocurrency-icons/svg/icon/bnt.svg'
import { ReactComponent as grt } from '../../node_modules/cryptocurrency-icons/svg/icon/grt.svg'
import { ReactComponent as zrx } from '../../node_modules/cryptocurrency-icons/svg/icon/zrx.svg'
import { ReactComponent as gno } from '../../node_modules/cryptocurrency-icons/svg/icon/gno.svg'
import { ReactComponent as glm } from '../../node_modules/cryptocurrency-icons/svg/icon/gnt.svg'
import { ReactComponent as ant } from '../../node_modules/cryptocurrency-icons/svg/icon/ant.svg'
import { ReactComponent as crv } from '../../node_modules/cryptocurrency-icons/svg/icon/crv.svg'
import { ReactComponent as generic } from '../../node_modules/cryptocurrency-icons/svg/icon/2give.svg'

const tokens = {
  eth,
  usdt,
  usdc,
  dai,
  wbtc,
  weth,
  uni,
  sushi,
  comp,
  bal,
  aave,
  yfi,
  link,
  snt,
  bat,
  matic,
  mkr,
  bnt,
  grt,
  zrx,
  gno,
  glm,
  ant,
  crv
}

export const getTokenIcon = id => {
  if (tokens[id.toLowerCase]) return tokens[id]
  return generic
}

export default tokens
