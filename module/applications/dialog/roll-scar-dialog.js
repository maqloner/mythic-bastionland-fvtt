import { config } from "../../config.js";

const ADD_ITEM_TEMPLATE = "systems/mythicbastionland/templates/applications/dialog/roll-scar-dialog.hbs";

class RollScarDialog extends Application {
  constructor({ callback } = {}) {
    super();
    this.callback = callback;
  }

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: ADD_ITEM_TEMPLATE,
      classes: ["mythic-bastionland", "roll-scar-dialog"],
      title: game.i18n.localize("MB.RollScar"),
      width: 500,
      height: "auto",
    });
  }

  /** @override */
  async getData(options) {
    const data = super.getData(options);
    data.config = config;
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
    const die = this.element.find("[name=die]:checked").val();

    if (!die) {
      return;
    }

    this.callback({
      die,
    });

    await this.close();
  }
}

/**
 * @returns {Promise.<{die: String}>}
 */
export const showRollScarDialog = (data = {}) =>
  new Promise((resolve) => {
    new RollScarDialog({
      ...data,
      callback: resolve,
    }).render(true);
  });
