import { config } from "../../config.js";

class RollScarDialog extends Application {
  constructor({ callback } = {}) {
    super();
    this.callback = callback;
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: `${config.systemPath}/templates/applications/dialog/roll-scar-dialog.hbs`,
      classes: ["mythic-bastionland", "roll-scar-dialog"],
      title: game.i18n.localize("MB.RollScar"),
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
    const die = this.element.find("[name=die]:checked").val();

    if (!die) {
      return;
    }

    this.callback({
      die
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
      callback: resolve
    }).render(true);
  });
