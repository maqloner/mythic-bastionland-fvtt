import { config } from "../../config.js";

class VirtueLossDialog extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  constructor({ callback } = {}) {
    super();
    this.callback = callback;
  }

  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: ["mythic-bastionland", "virtue-loss-dialog"],
    window: {
      resizable: false,
      animate: false,
      title: "MB.VirtueLoss"
    },
    form: {
      closeOnSubmit: false,
      submitOnChange: false,
      handler: VirtueLossDialog._onSubmit
    },
    position: {
      width: 500
    }
  };

  static PARTS = {
    form: {
      template: `${config.systemPath}/templates/applications/dialog/virtue-loss-dialog.hbs`
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

  static async _onSubmit() {
    const amountFormula = this.element.querySelector("[name=amount]").value;
    const virtue = this.element.querySelector("[name=virtue]:checked").value;

    const amountIsValid = Roll.validate(amountFormula);

    if (!amountFormula || !amountIsValid) {
      ui.notifications.warn("MB.VirtueLossNotificationInvalid", { localize: true });
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
