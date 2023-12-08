import { config } from "../../config.js";

class AttackDialog extends Application {
  constructor({ actor, callback } = {}) {
    super();
    this.actor = actor;
    this.callback = callback;
  }

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: `${config.systemPath}/templates/applications/dialog/attack-dialog.hbs`,
      classes: ["mythic-bastionland", "attack-dialog"],
      title: game.i18n.localize("MB.VirtueLoss"),
      width: 500,
      height: "auto"
    });
  }

  /** @override */
  async getData(options) {
    const data = super.getData(options);
    data.config = config;
    data.equippedItems = this.actor.items.filter((item) => item.system.equipped && item.system.damage);
    data.unequippedItems = this.actor.items.filter((item) => !item.system.equipped && item.system.damage);
    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".cancel-button").on("click", this._onCancel.bind(this));
    html.find(".ok-button").on("click", this._onSubmit.bind(this));
  }

  async _onCancel(event) {
    event.preventDefault();
    await this.close();
  }

  async _onSubmit(event) {
    event.preventDefault();
    const weapons = this.element.find("input[name='weapon[]']:checked").map((i, input) => $(input).val()).get();
    const impairedWeapons = this.element.find("input[name='weapon_impaired[]']:checked").map((i, input) => $(input).val()).get();
    const items = weapons.map((id) => {
      const item = this.actor.items.get(id);
      return impairedWeapons.includes(id) ? "d4" : item.system.damage;
    }); 

    const amount = parseInt(this.element.find("[name=amount]").val(), 10);

    if (!amount) {
      return;
    }

    this.callback({
      amount
      // virtue
    });

    await this.close();
  }
}

/**
 * @returns {Promise.<{damage: Boolean, virtue: String}>}
 */
export const showAttackDialog = (data = {}) =>
  new Promise((resolve) => {
    new AttackDialog({
      ...data,
      callback: resolve
    }).render(true);
  });
