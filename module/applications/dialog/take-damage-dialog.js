import { config } from "../../config.js";

class TakeDamageDialog extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  constructor({ actor, callback } = {}) {
    super();
    this.actor = actor;
    this.callback = callback;
  }

  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: ["mythic-bastionland", "take-damage-dialog"],
    window: {
      resizable: false,
      animate: false,
      title: "MB.TakeDamage"
    },
    form: {
      closeOnSubmit: false,
      submitOnChange: false,
      handler: TakeDamageDialog._onSubmit
    },
    position: {
      width: 500
    }
  };

  static PARTS = {
    form: {
      template: `${config.systemPath}/templates/applications/dialog/take-damage-dialog.hbs`
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
   * @override
   * 
   * @param {RenderOptions} options 
   * @returns {Promise<ApplicationRenderContext>}
   */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    return Object.assign(context, {
      config,
      armor: this.actor.items.reduce((armor, item) => {
        armor += ((item.system.armor ?? 0) && item.system.equipped) ? item.system.armor : 0;
        return armor;
      }, 0)
    });
  }

  static async _onSubmit() {
    const virtue = this.element.querySelector("[name=virtue]:checked").value;
    const exposed = !!this.element.querySelector("[name=exposed]").checked;
    const damage = this.element.querySelector("[name=damage]").value;
    const armor = this.element.querySelector("[name=armor]").value;

    if (!damage) {
      ui.notifications.warn("MB.TakeDamageNotificationInvalid", { localize: true });
      return;
    }

    this.callback({
      damage,
      armor,
      exposed,
      virtue
    });

    await this.close();
  }
}

/**
 * @returns {Promise.<{damage: Number, armor: Number, exposed: Boolean, virtue: Strign}>}
 */
export const showTakeDamageDialog = (data = {}) =>
  new Promise((resolve) => {
    new TakeDamageDialog({
      ...data,
      callback: resolve
    }).render(true);
  });
