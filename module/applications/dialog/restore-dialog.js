import { config } from "../../config.js";

class RestoreDialog extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  constructor({ callback } = {}) {
    super();
    this.callback = callback;
  }

  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: ["mythic-bastionland", "restore-dialog"],
    window: {
      resizable: false,
      animate: false,
      title: "MB.Restore"
    },
    form: {
      closeOnSubmit: false,
      submitOnChange: false,
      handler: RestoreDialog._onSubmit
    },
    position: {
      width: 500
    }
  };

  static PARTS = {
    form: {
      template: `${config.systemPath}/templates/applications/dialog/restore-dialog.hbs`
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
    const vigour = !!this.element.querySelector("[name=vigour]").checked;
    const spirit = !!this.element.querySelector("[name=spirit]").checked;
    const clarity = !!this.element.querySelector("[name=clarity]").checked;

    if (!(vigour || spirit || clarity)) {
      ui.notifications.warn("MB.RestoreNotificationInvalid", { localize: true });
      return;
    }

    this.callback({
      vigour,
      spirit,
      clarity
    });

    await this.close();
  }
}

/**
 * @returns {Promise.<{vigour: Boolean, spirit: Boolean, clarity: Boolean}>}
 */
export const showRestoreDialog = (data = {}) =>
  new Promise((resolve) => {
    new RestoreDialog({
      ...data,
      callback: resolve
    }).render(true);
  });
