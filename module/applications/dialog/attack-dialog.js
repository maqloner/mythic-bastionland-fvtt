import { config } from "../../config.js";
import { findlinkedActors } from "../../utils/actor.js";

class AttackDialog extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  constructor({ actor, callback } = {}) {
    super();
    this.actor = actor;
    this.callback = callback;
  }

  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: ["mythic-bastionland", "attack-dialog"],
    window: {
      resizable: false,
      animate: false,
      title: "MB.Attack"
    },
    form: {
      closeOnSubmit: false,
      submitOnChange: false,
      handler: AttackDialog._onSubmit
    },
    position: {
      width: 500
    }
  };

  static PARTS = {
    form: {
      template: `${config.systemPath}/templates/applications/dialog/attack-dialog.hbs`
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
      equippedItems: this.actor.items.filter((item) => item.system.equipped && item.system.damage),
      unequippedItems: this.actor.items.filter((item) => !item.system.equipped && item.system.damage),
      steeds: (await findlinkedActors(this.actor)).filter((actor) => actor.system.trample),
      isKnight: this.actor.type === config.actorTypes.knight
    });
  }

  static async _onSubmit() {
    this.element.querySelectorAll("input[type='text']").forEach(input => {
      input.value = input.value ? (Roll.validate(input.value) ? input.value : "0") : "";
    });

    const weapons = Array.from(this.element.querySelectorAll("input[name='weapon[]']:checked")).map(input => input.value);
    const steeds = Array.from(this.element.querySelectorAll("input[name='steed[]']:checked")).map(input => input.value);
    const impairedSteeds = Array.from(this.element.querySelectorAll("input[name='steed_impaired[]']:checked")).map(input => input.value);
    const impairedWeapons = Array.from(this.element.querySelectorAll("input[name='weapon_impaired[]']:checked")).map(input => input.value);

    const smite = !!this.element.querySelector("[name=smite]").checked;
    const smiteType = this.element.querySelector("[name=smite_type]:checked").value;
    const impaired = !!this.element.querySelector("[name=impaired]").checked;
    const bonusDice = this.element.querySelector("[name=bonus_dice]").value;
    const overrideDamage = this.element.querySelector("[name=override_damage]").value;

    if (!impaired && !bonusDice && !overrideDamage && !weapons.length && !steeds.length) {
      ui.notifications.warn("MB.AttackNotificationInvalid", { localize: true });
      return;
    }

    this.callback({
      weapons,
      impairedWeapons,
      impairedSteeds,
      steeds,
      smite,
      smiteType,
      impaired,
      bonusDice,
      overrideDamage
    });

    await this.close();
  }
}

/**
 * @returns {Promise.<{
 *  weapons: String[],
 *  impairedWeapons: String[],
 *  impairedSteeds: String[],
 *  steeds: String[],
 *  smite: Boolean,
 *  smiteType: String
 *  impaired: Boolean,
 *  bonusDice: String,
 *  overrideDamage: String
 * }>}
 */
export const showAttackDialog = (data = {}) =>
  new Promise((resolve) => {
    new AttackDialog({
      ...data,
      callback: resolve
    }).render(true);
  });
