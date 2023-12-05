import { actorInlineRollAction } from "../../actions/actor-inline-roll-action.js";
import { config } from "../../config.js";

/**
 * @extends {ItemSheet}
 */
export class MBitemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["mythic-bastionland", "sheet", "item"],
      width: 400,
      scrollY: [".scrollable"]
    });
  }

  /** @override */
  get title() {
    const title = super.title;
    return `${title} - ${game.i18n.localize(`TYPES.Item.${this.item.type}`)}`;
  }

  /** @override */
  get template() {
    const path = `${config.systemPath}/templates/applications/sheet/item/`;
    return `${path}/${this.item.type}-sheet.hbs`;
  }

  /** @override */
  async getData(options) {
    const data = super.getData(options);
    data.config = config;
    return data;
  }

  /**
   * @param {MouseEvent} event
   * @param {String} data 
   * @returns {String}
   */
  getClosestData(event, data) {
    return $(event.target).closest(`[data-${data}]`).data(data);
  }

  /**
   * @param {String} event
   * @param {Object} listeners
   */
  bindSelectorsEvent(event, listeners) {
    for (const [selector, callback] of Object.entries(listeners)) {
      this.element.find(selector).on(event, callback.bind(this));
    }
  }

  /**
   * @param {MouseEvent} event 
   * @param {Function} action 
   * @param  {...any} args 
   */
  async invokeAction(event, action, ...args) {
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
    this.bindSelectorsEvent("click", {
      ".inline-roll": event => this.invokeAction(event, actorInlineRollAction, null, ...this.getOnlineRollData(event))
    });
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  getOnlineRollData(event) {
    return [
      this.getClosestData(event, "formula"),
      this.getClosestData(event, "flavor"),
      this.getClosestData(event, "source"),
      this.getClosestData(event, "fatigue")
    ];
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

    const quantityMax = this.element.find("[name='system.quantity.max']");
    if (quantityMax.length) {
      quantityMax.val(Math.max(quantityMax.val(), 1));
    }

    return super._onSubmit(event, { updateData, preventClose });
  }
}
