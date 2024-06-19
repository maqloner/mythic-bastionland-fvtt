/**
 * @param {String} formula
 * @param {Object} [data]
 * @return {Promise<Roll>}
 */
export const evaluateFormula = async (formula, data) => {
  const roll = new Roll(formula, data);
  return roll.evaluate();
};

/**
 * @param {Number} min 
 * @param {Number} max 
 * @returns 
 */
export const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
