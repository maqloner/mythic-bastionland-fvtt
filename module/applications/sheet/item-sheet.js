import { configureEditor } from "../../utils/foundry.js";
import { config } from "../../config.js";
// import { showAddItemDialog } from "../../dialog/add-item-dialog.js";

/**
 * @extends {ItemSheet}
 */
export class MBitemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["mythic-bastionland", "sheet", "item"],
      width: 400,
      scrollY: [".scrollable"],
    });
  }

  /** @override */
  get title() {
    const title = super.title;
    return `${title} - ${game.i18n.localize(`TYPES.Item.${this.item.type}`)}`;
  }

  /** @override */
  get template() {
    const path = "systems/mythicbastionland/templates/applications/sheet/item/";
    return `${path}/${this.item.type}-sheet.hbs`;
  }

  /** @override */
  async getData(options) {
    const data = super.getData(options);
    data.config = config;
    console.log(data)
    return data;
  }


  /** @override */
  async _updateObject(event, formData) {
    if ('system.armor' in formData) {
      formData['system.armor'] = Math.max(formData['system.armor'], 0);
    }
    if ('system.damage' in formData) {
      formData['system.damage'] = Roll.validate(formData['system.damage']) ? formData['system.damage'] : 'd4';
    }
    if ('system.quantity.value' in formData) {
      formData['system.quantity.value'] = Math.max(formData['system.quantity.value'], 0);
    }
    if ('system.quantity.max' in formData) {
      formData['system.quantity.max'] = Math.max(formData['system.quantity.max'], 1);
    }

    this.render();
    return super._updateObject(event, formData);
  }

  /**
   * @override
   */
  activateEditor(name, options = {}, initialContent = "") {
    configureEditor(options);
    super.activateEditor(name, options, initialContent);
  }
}
