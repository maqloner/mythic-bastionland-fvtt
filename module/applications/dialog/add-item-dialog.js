import { config } from "../../config.js";

class AddItemDialog extends Application {
  constructor({ callback } = {}) {
    super();
    this.callback = callback;
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: `${config.systemPath}/templates/applications/dialog/add-item-dialog.hbs`,
      classes: ["mythic-bastionland", "add-item-dialog"],
      title: game.i18n.localize("MB.CreateItem"),
      width: 420,
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
    const name = this.element.find("[name=itemname]").val();
    const type = this.element.find("[name=itemtype]").val();

    if (!name || !type) {
      return;
    }

    this.callback({
      name,
      type
    });
    await this.close();
  }
}

/**
 * @returns {Promise.<{name: String, type: String}>}
 */
export const showAddItemDialog = (data = {}) =>
  new Promise((resolve) => {
    new AddItemDialog({
      ...data,
      callback: resolve
    }).render(true);
  });
