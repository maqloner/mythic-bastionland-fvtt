import { config } from "../../config.js";

class TakeDamageDialog extends Application {
  constructor({ actor, callback } = {}) {
    super();
    this.actor = actor;
    this.callback = callback;
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: `${config.systemPath}/templates/applications/dialog/take-damage-dialog.hbs`,
      classes: ["mythic-bastionland", "take-damage-dialog"],
      title: game.i18n.localize("MB.TakeDamage"),
      width: 500,
      height: "auto"
    });
  }

  /** @override */
  async getData(options) {
    const data = super.getData(options);
    data.config = config;
    data.armor = this.actor.items.reduce((armor, item) => {
      armor += ((item.system.armor ?? 0) && item.system.equipped) ? item.system.armor : 0;
      return armor;
    }, 0);
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
    const virtue = this.element.find("[name=virtue]:checked").val();
    const exposed = !!this.element.find("[name=exposed]:checked").val();
    const damage = parseInt(this.element.find("[name=damage]").val(), 10);
    const armor = parseInt(this.element.find("[name=armor]").val(), 10);

    if (!damage) {
      return;
    }

    this.callback({
      damage,
      armor,
      exposed,
      virtue
    });

    await this.close();
  }
}

/**
 * @returns {Promise.<{damage: Number, armor: Number, exposed: Boolean, virtue: Strign}>}
 */
export const showTakeDamageDialog = (data = {}) =>
  new Promise((resolve) => {
    new TakeDamageDialog({
      ...data,
      callback: resolve
    }).render(true);
  });
