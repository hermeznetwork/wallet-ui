import {
  ReactComponent as eth,
  ReactComponent as weth,
} from "cryptocurrency-icons/svg/icon/eth.svg";
import { ReactComponent as usdc } from "cryptocurrency-icons/svg/icon/usdc.svg";
import { ReactComponent as usdt } from "cryptocurrency-icons/svg/icon/usdt.svg";
import { ReactComponent as dai } from "cryptocurrency-icons/svg/icon/dai.svg";
import { ReactComponent as wbtc } from "cryptocurrency-icons/svg/icon/wbtc.svg";
import { ReactComponent as uni } from "cryptocurrency-icons/svg/icon/uni.svg";
import { ReactComponent as sushi } from "cryptocurrency-icons/svg/icon/sushi.svg";
import { ReactComponent as comp } from "cryptocurrency-icons/svg/icon/comp.svg";
import { ReactComponent as bal } from "cryptocurrency-icons/svg/icon/bal.svg";
import { ReactComponent as aave } from "cryptocurrency-icons/svg/icon/aave.svg";
import { ReactComponent as yfi } from "cryptocurrency-icons/svg/icon/yfi.svg";
import { ReactComponent as link } from "cryptocurrency-icons/svg/icon/link.svg";
import { ReactComponent as snt } from "cryptocurrency-icons/svg/icon/snt.svg";
import { ReactComponent as bat } from "cryptocurrency-icons/svg/icon/bat.svg";
import { ReactComponent as matic } from "cryptocurrency-icons/svg/icon/matic.svg";
import { ReactComponent as mkr } from "cryptocurrency-icons/svg/icon/mkr.svg";
import { ReactComponent as bnt } from "cryptocurrency-icons/svg/icon/bnt.svg";
import { ReactComponent as grt } from "cryptocurrency-icons/svg/icon/grt.svg";
import { ReactComponent as zrx } from "cryptocurrency-icons/svg/icon/zrx.svg";
import { ReactComponent as gno } from "cryptocurrency-icons/svg/icon/gno.svg";
import { ReactComponent as glm } from "cryptocurrency-icons/svg/icon/gnt.svg";
import { ReactComponent as ant } from "cryptocurrency-icons/svg/icon/ant.svg";
import { ReactComponent as crv } from "cryptocurrency-icons/svg/icon/crv.svg";
import { ReactComponent as generic } from "cryptocurrency-icons/svg/icon/2give.svg";

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
  crv,
};

export const getTokenIcon = (id) => {
  const symbol = id?.toLowerCase();
  if (tokens[symbol]) {
    return tokens[symbol];
  }
  return generic;
};

export default tokens;
