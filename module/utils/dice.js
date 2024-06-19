/**
 * @param {Roll} roll
 * @return {Promise<void>}
 */
export const showDice = async (roll, rollMode = game.settings.get("core", "rollMode")) => {
  if (game.dice3d) {
    const { whisper, blind } = ChatMessage.applyRollMode({}, rollMode);
    await game.dice3d.showForRoll(roll, game.user, true, whisper.length > 0 ? whisper : null, blind);
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
    foundry.audio.AudioHelper.play({ src: CONFIG.sounds.dice, volume: 0.8, autoplay: true, loop: false }, true);
  }
};

/**
 * @param {Roll[]} rolls
 * @param {String} rollMode
 */
export const showDiceWithSound = async (rolls, rollMode = game.settings.get("core", "rollMode")) => {
  await showDice(Roll.fromTerms([foundry.dice.terms.PoolTerm.fromRolls(rolls)]), rollMode);
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
