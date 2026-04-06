import { config } from "../../config.js";

class AddItemDialog extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  constructor({ callback } = {}) {
    super();
    this.callback = callback;
  }

  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: ["mythic-bastionland", "add-item-dialog"],
    window: {
      resizable: false,
      animate: false,
      title: "MB.CreateItem"
    },
    form: {
      closeOnSubmit: false,
      submitOnChange: false,
      handler: AddItemDialog._onSubmit
    },
    position: {
      width: 420
    }
  };

  static PARTS = {
    form: {
      template: `${config.systemPath}/templates/applications/dialog/add-item-dialog.hbs`
    }
  };

  _onRender(context, options) {
    super._onRender(context, options);
    this.element.addEventListener("keydown", this._onKeyDown.bind(this));
  }

  _onKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      return this.close();
    }
  }

  /**
   * @param {MouseEvent} event 
   * @this AddItemDialog
   */
  static async _onSubmit(event) {
    event.preventDefault();
    const name = this.element.querySelector("[name=itemname]").value;
    const type = this.element.querySelector("[name=itemtype]").value;

    if (!name || !type) {
      ui.notifications.warn("MB.AddItemNotificationInvalid", { localize: true });
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
