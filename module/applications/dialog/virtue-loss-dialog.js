import { config } from "../../config.js";

class VirtueLossDialog extends Application {
  constructor({ callback } = {}) {
    super();
    this.callback = callback;
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
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

    const amountField = this.element.find("[name=amount]");
    const amountIsValid = Roll.validate($(amountField).val());

    const virtue = this.element.find("[name=virtue]:checked").val();
    const amountFormula = this.element.find("[name=amount]").val();

    if (!amountFormula || !amountIsValid) {
      return;
    }

    this.callback({
      amountFormula,
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
