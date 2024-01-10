import invariant from 'tiny-invariant'
const BN = require('bignumber.js')

BN.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 })

const Q96 = new BN(2).pow(96)
const MIN_TICK = -887272
const MAX_TICK = 887272

/**
 * Returns the closest tick that is nearest a given tick and usable for the given tick spacing
 * @param tick the target tick
 * @param tickSpacing the spacing of the pool
 */
function nearestUsableTick(tick, tickSpacing) {
  invariant(Number.isInteger(tick) && Number.isInteger(tickSpacing), 'INTEGERS')
  invariant(tickSpacing > 0, 'TICK_SPACING')
  invariant(tick >= MIN_TICK && tick <= MAX_TICK, 'TICK_BOUND')
  const rounded = Math.round(tick / tickSpacing) * tickSpacing
  if (rounded < MIN_TICK) return rounded + tickSpacing
  else if (rounded > MAX_TICK) return rounded - tickSpacing
  else return rounded
}

// private helper functions
const encodeSqrtPriceX96 = (price) => {
  return new BN(price).sqrt().multipliedBy(Q96).integerValue(3)
}

const expandDecimals = (n, exp) => {
  return new BN(n).multipliedBy(new BN(10).pow(exp))
}

const mulDiv = (a, b, multiplier) => {
  return a.multipliedBy(b).div(multiplier)
}

const getPriceFromTick = (tick, token0Decimal, token1Decimal) => {
  const sqrtPrice = new BN(Math.pow(Math.sqrt(1.0001), tick)).multipliedBy(
    new BN(2).pow(96)
  )
  const token0 = expandDecimals(1, Number(token0Decimal))
  const token1 = expandDecimals(1, Number(token1Decimal))
  const L2 = mulDiv(encodeSqrtPriceX96(token0), encodeSqrtPriceX96(token1), Q96)
  const price = mulDiv(L2, Q96, sqrtPrice)
    .div(new BN(2).pow(96))
    .div(new BN(10).pow(token0Decimal))
    .pow(2)

  return price.toNumber()
}

const getTickFromPrice = (price, token0Decimal, token1Decimal) => {
  const token0 = expandDecimals(price, Number(token0Decimal))
  const token1 = expandDecimals(1, Number(token1Decimal))
  const sqrtPrice = encodeSqrtPriceX96(token1).div(encodeSqrtPriceX96(token0))

  return Math.round(
    Math.log(sqrtPrice.toNumber()) / Math.log(Math.sqrt(1.0001))
  )
}

// Calculate the position tokens deposit ratio.
const getPositionTokensDepositRatio = (P, Pl, Pu) => {
  const deltaL = 1000 // can be any number

  let deltaY = deltaL * (Math.sqrt(P) - Math.sqrt(Pl))
  if (P < Pl) deltaY = 0
  if (P >= Pu) deltaY = deltaL * (Math.sqrt(Pu) - Math.sqrt(Pl))

  let deltaX = deltaL * (1 / Math.sqrt(P) - 1 / Math.sqrt(Pu))
  if (P < Pl) deltaX = deltaL * (1 / Math.sqrt(Pl) - 1 / Math.sqrt(Pu))
  if (P >= Pu) deltaX = 0

  return deltaY / deltaX
}

const calculatePl = (P, Pu, x, y) => {
  const sp = Math.sqrt(P)
  const sb = Math.sqrt(Pu)

  const sa = y / (sb * x) + sp - y / (sp * x) // from eq(16) in Tech Note
  return sa ** 2
}

const calculatePu = (P, Pl, x, y) => {
  const sp = Math.sqrt(P)
  const sa = Math.sqrt(Pl)

  const sb = (sp * y) / (sa * sp * x - P * x + y) // from eq(17) in Tech Note
  return sb ** 2
}

/**
 *
 * @param {Number} price
 * @param {Number} tick
 * @param {Object} poolInfo
 * @param {Number} token0Decimal
 * @param {Number} token1Decimal
 * @returns {Number}
 */
const calculateNearestPrice = (
  price,
  poolInfo,
  token0Decimal,
  token1Decimal
) => {
  const { tickSpacing, tick: initialTick } = poolInfo
  let tick = getTickFromPrice(price, token0Decimal, token1Decimal)
  if (initialTick < 0 && tick > 0) tick *= -1
  const nearestTick = nearestUsableTick(tick, tickSpacing)
  const nearestPrice = getPriceFromTick(
    Math.abs(nearestTick),
    token0Decimal,
    token1Decimal
  )

  const nearestPriceLow = getPriceFromTick(
    Math.abs(nearestTick) - tickSpacing,
    token0Decimal,
    token1Decimal
  )

  const nearestPriceHigh = getPriceFromTick(
    Math.abs(nearestTick) + tickSpacing,
    token0Decimal,
    token1Decimal
  )
  const diffLow = Math.abs(price - nearestPriceLow)
  const diffHigh = Math.abs(price - nearestPriceHigh)
  const diff = Math.abs(price - nearestPrice)
  if (diffLow < diff && diffLow < diffHigh) return nearestPriceLow
  if (diffHigh < diff && diffHigh < diffLow) return nearestPriceHigh
  return nearestPrice
}

export {
  getPositionTokensDepositRatio,
  getPriceFromTick,
  calculatePl,
  calculatePu,
  getTickFromPrice,
  nearestUsableTick,
  calculateNearestPrice,
}
