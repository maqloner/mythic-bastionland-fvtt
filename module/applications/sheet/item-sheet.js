import { actorInlineRollAction } from "../../actions/actor-inline-roll-action.js";
import { config } from "../../config.js";

export class MBitemSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2) {

  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: ["mythic-bastionland", "sheet", "item"],
    form: {
      handler: MBitemSheet._onSubmitForm,
      submitOnChange: true
    }
  };

  /**
   * @override
   * @param {HandlebarsRenderOptions} options
   * @returns {Record<string, HandlebarsTemplatePart>}
   */
  _configureRenderParts() {
    return {
      form: {
        template: `${config.systemPath}/templates/applications/sheet/item/${this.item.type}-sheet.hbs`,
        scrollable: [".scrollable"]
      }
    };
  }

  /**
 * @override
 * @param {ApplicationRenderContext} context
 * @param {HandlebarsRenderOptions} options
 */
  _onRender(context, options) {
    super._onRender(context, options);
    // Not using action. Some inline-roll are inside item description
    this.element
      .querySelectorAll(".inline-roll")
      .forEach((el) => el.addEventListener("click", (event) => this._onInlineRoll(event)));
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
      config: config,
      extra: {
        enrichedDescription: await foundry.applications.ux.TextEditor.implementation.enrichHTML(context.document.system.description, { secret: context.editable })
      }
    });
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event 
   * @this MBitemSheet
   */
  async _onInlineRoll(event) {
    event.preventDefault();
    event.stopPropagation();
    await actorInlineRollAction(null, this._getInlineRollData(event));
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  _getInlineRollData(event) {
    return {
      formula: this._getEventData(event, "formula"),
      flavor: this._getEventData(event, "flavor"),
      source: this._getEventData(event, "source"),
      applyFatigue: this._getEventData(event, "fatigue")
    };
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event
   * @param {String} data 
   * @returns {String}
   */
  _getEventData(event, data) {
    return event.target.closest(`[data-${data}]`)?.getAttribute(`data-${data}`);;
  }


  static async _onSubmitForm(event, form, formData) {
    if (formData.object["system.damage"]) {
      formData.object["system.damage"] = Roll.validate(formData.object["system.damage"]) ? formData.object["system.damage"] : "d4";
    }

    if (formData.object["system.armor"]) {
      formData.object["system.armor"] = Math.max(formData.object["system.armor"], 0);
    }

    if (formData.object["system.quantity.value"]) {
      formData.object["system.quantity.value"] = Math.max(formData.object["system.quantity.value"], 0);
    }

    if (formData.object["system.quantity.max"] && formData.object["system.quantity.max"] !== "") {
      formData.object["system.quantity.max"] = Math.max(formData.object["system.quantity.max"], 0);
    }

    await this.document.update(formData.object);
  }
}
