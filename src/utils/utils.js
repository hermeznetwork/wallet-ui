/* global BigInt */
import { Scalar, utils as ffUtils } from 'ffjavascript'
import ethers from 'ethers'
const { babyJub, poseidon } = require('circomlib')

const hash = poseidon.createHash(6, 8, 57)
const F = poseidon.F

/**
 * Chunks inputs in five elements and hash with Poseidon all them togheter
 * @param {Array} arr - inputs hash
 * @returns {BigInt} - final hash
 */
function multiHash (arr) {
  let r = Scalar.e(0)
  for (let i = 0; i < arr.length; i += 5) {
    const fiveElems = []
    for (let j = 0; j < 5; j++) {
      if (i + j < arr.length) {
        fiveElems.push(arr[i + j])
      } else {
        fiveElems.push(Scalar.e(0))
      }
    }
    const ph = hash(fiveElems)
    r = F.add(r, ph)
  }
  return F.normalize(r)
}

/**
 * Poseidon hash of a generic buffer
 * @param {Buffer} msgBuff
 * @returns {BigInt} - final hash
 */
export function hashBuffer (msgBuff) {
  const n = 31
  const msgArray = []
  const fullParts = Math.floor(msgBuff.length / n)
  for (let i = 0; i < fullParts; i++) {
    const v = ffUtils.leBuff2int(msgBuff.slice(n * i, n * (i + 1)))
    msgArray.push(v)
  }
  if (msgBuff.length % n !== 0) {
    const v = ffUtils.leBuff2int(msgBuff.slice(fullParts * n))
    msgArray.push(v)
  }
  return multiHash(msgArray)
}

export const readFile = (file) => {
  return new Promise((resolve) => {
    const reader = new window.FileReader()
    reader.readAsText(file)
    reader.onload = function (event) {
      resolve(JSON.parse(event.target.result))
    }
  })
}

/**
 * Convert a fix to a float
 * @param {String} _f - Scalar encoded in fix
 * @returns {Scalar} Scalar encoded in float
 */
export const fix2float = (_f) => {
  const f = Scalar.e(_f)

  function dist (n1, n2) {
    const tmp = Scalar.sub(n1, n2)

    return Scalar.abs(tmp)
  }

  const fl1 = _floorFix2Float(f)
  const fi1 = float2fix(fl1)
  const fl2 = fl1 | 0x400
  const fi2 = float2fix(fl2)

  let m3 = (fl1 & 0x3ff) + 1
  let e3 = fl1 >> 11
  // eslint-disable-next-line eqeqeq
  if (m3 == 0x400) {
    m3 = 0x66 // 0x400 / 10
    e3++
  }
  const fl3 = m3 + (e3 << 11)
  const fi3 = float2fix(fl3)

  let res = fl1
  let d = dist(fi1, f)

  const d2 = dist(fi2, f)
  if (Scalar.gt(d, d2)) {
    res = fl2
    d = d2
  }

  const d3 = dist(fi3, f)
  if (Scalar.gt(d, d3)) {
    res = fl3
  }

  return res
}

/**
 * Convert a fix to a float, always rounding down
 * @param {String} _f - Scalar encoded in fix
 * @returns {Scalar} Scalar encoded in float
 */
function _floorFix2Float (_f) {
  const f = Scalar.e(_f)
  if (Scalar.isZero(f)) return 0

  let m = f
  let e = 0

  while (!Scalar.isZero(Scalar.shr(m, 10))) {
    m = Scalar.div(m, 10)
    e++
  }

  const res = Scalar.toNumber(m) + (e << 11)
  return res
}

/**
 * Convert a float to a fix
 * @param {Scalar} fl - Scalar encoded in float
 * @returns {Scalar} Scalar encoded in fix
 */
function float2fix (fl) {
  const m = fl & 0x3ff
  const e = fl >> 11
  const e5 = (fl >> 10) & 1

  // const exp = Scalar.pow(10, e);

  let exp = BigInt(1)
  for (let i = 0; i < e; i++) {
    exp *= BigInt(10)
  }

  let res = Scalar.mul(m, exp)
  if (e5 && e) {
    res = Scalar.add(res, Scalar.div(exp, 2))
  }
  return res
}

export const pointHexToCompress = (pointHex) => {
  if (!pointHex[0].startsWith('0x')) {
    pointHex[0] = `0x${pointHex[0]}`
  }
  if (!pointHex[1].startsWith('0x')) {
    pointHex[1] = `0x${pointHex[1]}`
  }
  const point = [BigInt(pointHex[0]), BigInt(pointHex[1])]
  const buf = babyJub.packPoint(point)
  return buf.toString('hex')
}

export const pointToCompress = (point) => {
  const pointBigInt = [BigInt(point[0]), BigInt(point[1])]
  const buf = babyJub.packPoint(pointBigInt)
  const compress = `0x${buf.toString('hex')}`
  return compress
}

export const hexToPoint = (compress) => {
  let compressHex
  if (compress.startsWith('0x')) compressHex = compress.slice(2)
  else compressHex = compress
  const buf = Buffer.from(compressHex, 'hex')
  const point = babyJub.unpackPoint(buf)
  const pointHexAx = point[0].toString(16)
  const pointHexAy = point[1].toString(16)
  const pointHex = [pointHexAx, pointHexAy]
  return pointHex
}

export const state2array = (amount, token, ax, ay, ethAddress, nonce) => {
  let data = Scalar.e(0)

  data = Scalar.add(data, token)
  data = Scalar.add(data, Scalar.shl(nonce, 32))

  return [
    data,
    Scalar.e(amount),
    Scalar.fromString(ax, 16),
    Scalar.fromString(ay, 16),
    Scalar.fromString(ethAddress, 16)
  ]
}

export const hashState = (st) => {
  const hash = poseidon.createHash(6, 8, 57)
  return hash(st)
}

export const getNullifier = async (wallet, info, contractRollup, batch) => {
  const [ax, ay] = wallet.publicKey
  const exitEntry = state2array(
    info.data.state.amount,
    info.data.state.coin,
    ax.toString(16),
    ay.toString(16),
    wallet.ethereumAddress,
    0
  )
  const valueExitTree = hashState(exitEntry)
  const exitRoot = await contractRollup.getExitRoot(batch)
  const nullifier = []
  nullifier[0] = valueExitTree
  nullifier[1] = batch
  nullifier[2] = BigInt(exitRoot)
  const hashNullifier = hashState(nullifier)
  const boolNullifier = await contractRollup.exitNullifier(
    hashNullifier.toString()
  )
  return boolNullifier
}

export const getWei = (ether) => {
  let wei
  try {
    wei = ethers.utils.parseUnits(ether, 'ether').toString()
  } catch (err) {
    wei = '0'
  }
  return wei
}

export const hexToBuffer = (hexString) => {
  return Buffer.from(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
}

/**
 * Encode tx Data
 * @param {String} tx - Transaction object
 * @returns {Scalar} Encoded TxData
 */
export function buildTxData (tx) {
  const IDEN3_ROLLUP_TX = Scalar.fromString('4839017969649077913')
  let res = Scalar.e(0)

  res = Scalar.add(res, IDEN3_ROLLUP_TX)
  res = Scalar.add(res, Scalar.shl(fix2float(tx.amount || 0), 64))
  res = Scalar.add(res, Scalar.shl(tx.coin || 0, 80))
  res = Scalar.add(res, Scalar.shl(tx.nonce || 0, 112))
  res = Scalar.add(res, Scalar.shl(tx.fee || 0, 160))
  res = Scalar.add(res, Scalar.shl(tx.rqOffset || 0, 164))
  res = Scalar.add(res, Scalar.shl(tx.onChain ? 1 : 0, 167))
  res = Scalar.add(res, Scalar.shl(tx.newAccount ? 1 : 0, 168))

  return res
}

export const feeTable = {
  '0%': 0,
  '0.001%': 1,
  '0.002%': 2,
  '0.005%': 3,
  '0.01%': 4,
  '0.02%': 5,
  '0.05%': 6,
  '0.1%': 7,
  '0.2%': 8,
  '0.5%': 9,
  '1%': 10,
  '2%': 11,
  '5%': 12,
  '10%': 13,
  '20%': 14,
  '50%': 15
}

export const feeTableDropdown = [
  {
    key: '0%',
    text: '0%',
    value: '0%'
  },
  {
    key: '0.001%',
    text: '0.001%',
    value: '0.001%'
  },
  {
    key: '0.002%',
    text: '0.002%',
    value: '0.002%'
  },
  {
    key: '0.005%',
    text: '0.005%',
    value: '0.005%'
  },
  {
    key: '0.01%',
    text: '0.01%',
    value: '0.01%'
  },
  {
    key: '0.02%',
    text: '0.02%',
    value: '0.02%'
  },
  {
    key: '0.05%',
    text: '0.05%',
    value: '0.05%'
  },
  {
    key: '0.1%',
    text: '0.1%',
    value: '0.1%'
  },
  {
    key: '0.2%',
    text: '0.2%',
    value: '0.2%'
  },
  {
    key: '0.5%',
    text: '0.5%',
    value: '0.5%'
  },
  {
    key: '1%',
    text: '1%',
    value: '1%'
  },
  {
    key: '2%',
    text: '2%',
    value: '2%'
  },
  {
    key: '5%',
    text: '5%',
    value: '5%'
  },
  {
    key: '10%',
    text: '10%',
    value: '10%'
  },
  {
    key: '20%',
    text: '20%',
    value: '20%'
  },
  {
    key: '50%',
    text: '50%',
    value: '50%'
  }
]

export const exitAx =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
export const exitAy =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
