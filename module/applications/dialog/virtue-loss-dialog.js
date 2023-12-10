import { config } from "../../config.js";

class VirtueLossDialog extends Application {
  constructor({ callback } = {}) {
    super();
    this.callback = callback;
  }

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: `${config.systemPath}/templates/applications/dialog/virtue-loss-dialog.hbs`,
      classes: ["mythic-bastionland", "take-damage-dialog"],
      title: game.i18n.localize("MB.VirtueLoss"),
      width: 500,
      height: "auto"
    });
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
    const amount = parseInt(this.element.find("[name=amount]").val(), 10);

    if (!amount) {
      return;
    }

    this.callback({
      amount,
      virtue
    });

    await this.close();
  }
}

/**
 * @returns {Promise.<{damage: Boolean, virtue: String}>}
 */
export const showVirtueLossDialog = (data = {}) =>
  new Promise((resolve) => {
    new VirtueLossDialog({
      ...data,
      callback: resolve
    }).render(true);
  });
