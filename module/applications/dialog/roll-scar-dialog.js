import { config } from "../../config.js";

class RollScarDialog extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  constructor({ callback } = {}) {
    super();
    this.callback = callback;
  }

  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: ["mythic-bastionland", "roll-scar-dialog"],
    window: {
      resizable: false,
      animate: false,
      title: "MB.RollScar"
    },
    form: {
      closeOnSubmit: false,
      submitOnChange: false,
      handler: RollScarDialog._onSubmit
    },
    position: {
      width: 500
    }
  };

  static PARTS = {
    form: {
      template: `${config.systemPath}/templates/applications/dialog/roll-scar-dialog.hbs`
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
    const die = this.element.querySelector("[name=die]:checked")?.value;

    if (!die) {
      ui.notifications.warn("MB.RollScarNotificationInvalid", { localize: true });
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
