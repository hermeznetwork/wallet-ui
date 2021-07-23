import { ReactComponent as eth } from '../../node_modules/cryptocurrency-icons/svg/icon/eth.svg'
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
import { ReactComponent as gnt } from '../../node_modules/cryptocurrency-icons/svg/icon/gnt.svg'
import { ReactComponent as ant } from '../../node_modules/cryptocurrency-icons/svg/icon/ant.svg'
import { ReactComponent as crv } from '../../node_modules/cryptocurrency-icons/svg/icon/crv.svg'
import { ReactComponent as generic } from '../../node_modules/cryptocurrency-icons/svg/icon/2give.svg'

const tokens = {
  ETH: {
    id: 0,
    ethereumAddress: '0x0000000000000000000000000000000000000000',
    name: 'Ether',
    symbol: 'ETH',
    icon: eth
  },
  HEZ: {
    id: 1,
    ethereumAddress: '0xeef9f339514298c6a857efcfc1a762af84438dee',
    name: 'Hermez Network Token',
    symbol: 'HEZ',
    icon: generic
  },
  USDT: {
    id: 2,
    ethereumAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    name: 'Tether USD',
    symbol: 'USDT',
    icon: usdt
  },
  USDC: {
    id: 3,
    ethereumAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    name: 'USD Coin',
    symbol: 'USDC',
    icon: usdc
  },
  DAI: {
    id: 4,
    ethereumBlockNum: 12094384,
    ethereumAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    icon: dai
  },
  WBTC: {
    id: 5,
    ethereumAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    icon: wbtc
  },
  WETH: {
    id: 6,
    ethereumAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    name: 'Wrapped Ether',
    symbol: 'WETH',
    icon: eth
  },
  XAUt: {
    id: 7,
    ethereumAddress: '0x4922a015c4407f87432b179bb209e125432e4a2a',
    name: 'Gold Tether',
    symbol: 'XAUt',
    icon: generic
  },
  UNI: {
    id: 8,
    ethereumAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    name: 'Uniswap',
    symbol: 'UNI',
    icon: uni
  },
  SUSHI: {
    id: 9,
    ethereumAddress: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    name: 'SushiToken',
    symbol: 'SUSHI',
    icon: sushi
  },
  COMP: {
    id: 10,
    ethereumAddress: '0xc00e94cb662c3520282e6f5717214004a7f26888',
    name: 'Compound',
    symbol: 'COMP',
    icon: comp
  },
  BAL: {
    id: 11,
    ethereumAddress: '0xba100000625a3754423978a60c9317c58a424e3d',
    name: 'Balancer',
    symbol: 'BAL',
    icon: bal
  },
  AAVE: {
    id: 12,
    ethereumAddress: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    name: 'Aave Token',
    symbol: 'AAVE',
    icon: aave
  },
  YFI: {
    id: 13,
    ethereumAddress: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
    name: 'yearn.finance',
    symbol: 'YFI',
    icon: yfi
  },
  LINK: {
    id: 14,
    ethereumAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
    name: 'ChainLink Token',
    symbol: 'LINK',
    icon: link
  },
  SNT: {
    id: 15,
    ethereumAddress: '0x744d70fdbe2ba4cf95131626614a1763df805b9e',
    name: 'Status Network Token',
    symbol: 'SNT',
    icon: snt
  },
  BAT: {
    id: 16,
    ethereumAddress: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
    name: 'Basic Attention Toke',
    symbol: 'BAT',
    icon: bat
  },
  GTC: {
    id: 17,
    ethereumAddress: '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f',
    name: 'Gitcoin',
    symbol: 'GTC',
    icon: generic
  },
  MATIC: {
    id: 18,
    ethereumAddress: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    name: 'Matic Token',
    symbol: 'MATIC',
    icon: matic
  },
  MKR: {
    id: 19,
    ethereumAddress: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    name: 'Maker',
    symbol: 'MKR',
    icon: mkr
  },
  BNT: {
    id: 20,
    ethereumAddress: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
    name: 'Bancor Network Token',
    symbol: 'BNT',
    icon: bnt
  },
  GRT: {
    id: 21,
    ethereumAddress: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
    name: 'Graph Token',
    symbol: 'GRT',
    icon: grt
  },
  ZRX: {
    id: 22,
    ethereumAddress: '0xe41d2489571d322189246dafa5ebde1f4699f498',
    name: '0x Protocol Token',
    symbol: 'ZRX',
    icon: zrx
  },
  GNO: {
    id: 23,
    ethereumAddress: '0x6810e776880c02933d47db1b9fc05908e5386b96',
    name: 'Gnosis Token',
    symbol: 'GNO',
    icon: gno
  },
  GLM: {
    id: 24,
    ethereumAddress: '0x7dd9c5cba05e151c895fde1cf355c9a1d5da6429',
    name: 'Golem Network Token',
    symbol: 'GLM',
    icon: gnt
  },
  ANT: {
    id: 25,
    ethereumAddress: '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
    name: 'Aragon Network Token',
    symbol: 'ANT',
    icon: ant
  },
  CRV: {
    id: 26,
    ethereumAddress: '0xd533a949740bb3306d119cc777fa900ba034cd52',
    name: 'Curve DAO Token',
    symbol: 'CRV',
    icon: crv
  }
}

export const getTokenIcon = id => {
  if (tokens[id]) return tokens[id].icon
  return generic
}

export default tokens
