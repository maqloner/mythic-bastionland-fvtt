import { config } from "../../config.js";
import { findlinkedActors } from "../../utils/actor.js";

class AttackDialog extends Application {
  constructor({ actor, callback } = {}) {
    super();
    this.actor = actor;
    this.callback = callback;
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: `${config.systemPath}/templates/applications/dialog/attack-dialog.hbs`,
      classes: ["mythic-bastionland", "attack-dialog"],
      title: game.i18n.localize("MB.Attack"),
      width: 500,
      height: "auto"
    });
  }

  /** @override */
  async getData(options) {
    const data = super.getData(options);
    data.equippedItems = this.actor.items.filter((item) => item.system.equipped && item.system.damage);
    data.unequippedItems = this.actor.items.filter((item) => !item.system.equipped && item.system.damage);
    data.steeds = (await findlinkedActors(this.actor)).filter((actor) => actor.system.trample);
    data.isKnight = this.actor.type === config.actorTypes.knight;
    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".cancel-button").on("click", (event) => this.#onCancel(event));
    html.find(".ok-button").on("click", (event) => this.#onSubmit(event));
  }

  async #onCancel(event) {
    event.preventDefault();
    await this.close();
  }

  async #onSubmit(event) {
    event.preventDefault();

    $(this.element).find("input[type='text']").each((index, input) => {
      $(input).val($(input).val() ? (Roll.validate($(input).val()) ? $(input).val() : "0") : "");
    });

    const weapons = this.element.find("input[name='weapon[]']:checked").map((i, input) => $(input).val()).get();
    const steeds = this.element.find("input[name='steed[]']:checked").map((i, input) => $(input).val()).get();
    const impairedSteeds = this.element.find("input[name='steed_impaired[]']:checked").map((i, input) => $(input).val()).get();
    const impairedWeapons = this.element.find("input[name='weapon_impaired[]']:checked").map((i, input) => $(input).val()).get();
    const smite = !!this.element.find("[name=smite]:checked").val();
    const smiteType = this.element.find("[name=smite_type]:checked").val();
    const impaired = !!this.element.find("[name=impaired]:checked").val();
    const bonusDice = this.element.find("[name=bonus_dice]").val();
    const overrideDamage = this.element.find("[name=override_damage]").val();

    if (!impaired && !bonusDice && !overrideDamage && !weapons.length && !steeds.length) {
      return;
    }

    this.callback({
      weapons,
      impairedWeapons,
      impairedSteeds,
      steeds,
      smite,
      smiteType,
      impaired,
      bonusDice,
      overrideDamage
    });

    await this.close();
  }
}

/**
 * @returns {Promise.<{
 *  weapons: String[], 
 *  impairedWeapons: String[], 
 *  impairedSteeds: String[], 
 *  steeds: String[], 
 *  smite: Boolean, 
 *  smiteType: String 
 *  impaired: Boolean, 
 *  bonusDice: String, 
 *  overrideDamage: String
 * }>}
 */
export const showAttackDialog = (data = {}) =>
  new Promise((resolve) => {
    new AttackDialog({
      ...data,
      callback: resolve
    }).render(true);
  });
