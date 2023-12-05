import { config } from "../../config.js";

class RestoreDialog extends Application {
  constructor({ callback } = {}) {
    super();
    this.callback = callback;
  }

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: `${config.systemPath}/templates/applications/dialog/restore-dialog.hbs`,
      classes: ["mythic-bastionland", "restore-dialog"],
      title: game.i18n.localize("MB.Restore"),
      width: 500,
      height: "auto"
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
    const vigour = !!this.element.find("[name=vigour]:checked").val();
    const spirit = !!this.element.find("[name=spirit]:checked").val();
    const clarity = !!this.element.find("[name=clarity]:checked").val();

    if (!(vigour || spirit || clarity)) {
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
