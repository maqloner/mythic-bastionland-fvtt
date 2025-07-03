import { actorInlineRollAction } from "../../actions/actor-inline-roll-action.js";
import { config } from "../../config.js";

/**
 * @extends {ItemSheet}
 */
export class MBitemSheet extends foundry.appv1.sheets.ItemSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["mythic-bastionland", "sheet", "item"],
      width: 400,
      scrollY: [".scrollable"]
    });
  }

  /** @override */
  get title() {
    return `${super.title} - ${game.i18n.localize(`TYPES.Item.${this.item.type}`)}`;
  }

  /** @override */
  get template() {
    return `${config.systemPath}/templates/applications/sheet/item/${this.item.type}-sheet.hbs`;
  }

  /** @override */
  async getData(options) {
    const data = super.getData(options);
    data.data.system.description = await foundry.applications.ux.TextEditor.implementation.enrichHTML(data.data.system.description, { secret: data.editable });
    return data;
  }

  /**
   * @param {MouseEvent} event
   * @param {String} data 
   * @returns {String}
   */
  #getEventData(event, data) {
    return $(event.target).closest(`[data-${data}]`).data(data);
  }

  /**
   * @param {String} event
   * @param {Object} listeners
   */
  #bindSelectorsEvent(event, listeners) {
    for (const [selector, callback] of Object.entries(listeners)) {
      this.element.find(selector).on(event, callback.bind(this));
    }
  }

  /**
   * @param {MouseEvent} event 
   * @param {Function} action 
   * @param  {...any} args 
   */
  async #invokeAction(event, action, ...args) {
    event.preventDefault();
    event.stopPropagation();
    await action(...args);
  }

  /**
   * @override
   *
   * @param {JQuery.<HTMLElement>} html
   */
  activateListeners(html) {
    super.activateListeners(html);
    this.#bindSelectorsEvent("click", {
      ".inline-roll": event => this.#invokeAction(event, actorInlineRollAction, null, this.#getOnlineRollData(event))
    });
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  #getOnlineRollData(event) {
    return {
      formula: this.#getEventData(event, "formula"),
      flavor: this.#getEventData(event, "flavor"),
      source: this.#getEventData(event, "source"),
      applyFatigue: this.#getEventData(event, "fatigue")
    };
  }

  async _onSubmit(event, { updateData = null, preventClose = false } = {}) {
    const damage = this.element.find("[name='system.damage']");
    if (damage.length) {
      damage.val(Roll.validate($(damage).val()) ? $(damage).val() : "d4");
    }

    const armor = this.element.find("[name='system.armor']");
    if (armor.length) {
      armor.val(Math.max(armor.val(), 0));
    }

    const quantityValue = this.element.find("[name='system.quantity.value']");
    if (quantityValue.length) {
      quantityValue.val(Math.max(quantityValue.val(), 0));
    }

    return super._onSubmit(event, { updateData, preventClose });
  }
}
