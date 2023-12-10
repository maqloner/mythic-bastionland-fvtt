/**
 * @param {Roll} roll
 * @return {Promise<void>}
 */
export const showDice = async (roll) => {
  if (game.dice3d) {
    await game.dice3d.showForRoll(roll, game.user, true, null, false);
  }
};

/**
 * @return {string|null}
 */
export const diceSound = () => {
  if (game.dice3d) {
    return null;
  }
  return CONFIG.sounds.dice;
};

export const playDiceSound = () => {
  if (!game.dice3d) {
    AudioHelper.play({ src: CONFIG.sounds.dice, volume: 0.8, autoplay: true, loop: false }, true);
  }
};

/**
 * @param {Roll[]} rolls
 */
export const showDiceWithSound = async (rolls) => {
  await showDice(Roll.fromTerms([PoolTerm.fromRolls(rolls)]));
  playDiceSound();
};

/**
 * @param {String} targetMessageId
 * @return {Promise<Boolean>}
 */
export const waitForMessageRoll = (targetMessageId) => {
  const createHook = (resolve) => {
    Hooks.once("diceSoNiceRollComplete", (messageId) => {
      if (targetMessageId === messageId) {
        resolve(true);
      }
      else {
        createHook(resolve);
      }
    });
  };
  return new Promise((resolve) => {
    if (game.dice3d) {
      createHook(resolve);
    } else {
      resolve(true);
    }
  });
};
