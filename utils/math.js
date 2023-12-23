const BN = require("bignumber.js");
BN.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const Q96 = new BN(2).pow(96);

// private helper functions
const encodeSqrtPriceX96 = (price) => {
    return new BN(price).sqrt().multipliedBy(Q96).integerValue(3);
};

const expandDecimals = (n, exp) => {
    return new BN(n).multipliedBy(new BN(10).pow(exp));
};

const mulDiv = (a, b, multiplier) => {
    return a.multipliedBy(b).div(multiplier);
};

const getPriceFromTick = (
    tick,
    token0Decimal,
    token1Decimal
) => {
    const sqrtPrice = new BN(Math.pow(Math.sqrt(1.0001), tick)).multipliedBy(
        new BN(2).pow(96)
    );
    const token0 = expandDecimals(1, Number(token0Decimal));
    const token1 = expandDecimals(1, Number(token1Decimal));
    const L2 = mulDiv(
        encodeSqrtPriceX96(token0),
        encodeSqrtPriceX96(token1),
        Q96
    );
    const price = mulDiv(L2, Q96, sqrtPrice)
        .div(new BN(2).pow(96))
        .div(new BN(10).pow(token0Decimal))
        .pow(2);

    return price.toNumber();
};

// Calculate the position tokens deposit ratio.
const getPositionTokensDepositRatio = (
    P,
    Pl,
    Pu
) => {
    const deltaL = 1000; // can be any number

    let deltaY = deltaL *
        (Math.sqrt(P) - Math.sqrt(Pl));
    if (P < Pl) deltaY = 0;
    if (P >= Pu) deltaY = deltaL * (Math.sqrt(Pu) - Math.sqrt(Pl));

    let deltaX = deltaL * (1 / Math.sqrt(P) - 1 / Math.sqrt(Pu));
    if (P < Pl) deltaX = deltaL * (1 / Math.sqrt(Pl) - 1 / Math.sqrt(Pu));
    if (P >= Pu) deltaX = 0;

    return deltaY / deltaX;
};

const calculatePl = (P, Pu, x, y)=>{
    const sp = Math.sqrt(P);
    const sb = Math.sqrt(Pu);

    const sa =( y / (sb * x)) + sp - (y / (sp * x))  // from eq(16) in Tech Note
    return sa ** 2
}

const calculatePu = (P, Pl, x, y)=>{
    const sp = Math.sqrt(P);
    const sa = Math.sqrt(Pl);

    const sb  = (sp * y)/((sa * sp * x) - (P * x) + y) // from eq(17) in Tech Note
    return sb ** 2
}

module.exports= {
    getPositionTokensDepositRatio,
    getPriceFromTick,
    calculatePl,
    calculatePu
}