import { configureEditor } from "../../utils/foundry.js";
import { config } from "../../config.js";
import { actorRestAction } from "../../actions/actor-rest-action.js";
import { showAddItemDialog } from "../dialog/add-item-dialog.js";
import { actorRollScarsAction } from "../../actions/actor-roll-scars-action.js";
import { actorSaveAction } from "../../actions/actor-save-action.js";
import { actorRestoreAction } from "../../actions/actor-restore-action.js";
import { actorTakeDamageAction } from "../../actions/actor-take-damage-action.js";
import { attackVirtueLossAction } from "../../actions/actor-virtue-loss-action.js";
import { actorAttackAction } from "../../actions/actor-attack-action.js";

/**
 * @extends {ActorSheet}
 */
export class MBActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["mythic-bastionland", "sheet", "actor"],
      width: 630,
      minWidth: 630,
      height: 600,
      scrollY: [".scrollable"],
    });
  }

  /** @override */
  get title() {
    const title = super.title;
    return `${title} - ${game.i18n.localize(`TYPES.Actor.${this.actor.type}`)}`;
  }

  /** @override */
  get template() {
    const path = "systems/mythicbastionland/templates/applications/sheet/actor/";
    return `${path}/${this.actor.type}-sheet.hbs`;
  }

  /** @override */
  async getData(options) {
    let data = super.getData(options);
    data.config = config;

    data = await this.prepareActors(data);
    data = await this.prepareItems(data);

    console.log(data);
    return data;
  }

  async prepareItems(data) {
    const itemTypeOrders = {
      weapon: 1,
      shield: 2,
      plate: 3,
      coat: 4,
      helm: 5,
      misc: 6,
      passion: 7,
      ability: 7,
      scar: 7
    }
    data.data.items = data.data.items.sort((a, b) => itemTypeOrders[a.type] - itemTypeOrders[b.type] || a.name.localeCompare(b.name));

    for (const item of data.data.items) {
      item.system.enrichedDescription = await TextEditor.enrichHTML(item.system.description);
      item.system.isEquippable = [config.itemTypes.weapon, config.itemTypes.coat, config.itemTypes.plate, config.itemTypes.helm, config.itemTypes.shield].includes(item.type);
    }

    data.data.abilities = data.data.items.filter((item) => item.type === config.itemTypes.ability);
    data.data.passions = data.data.items.filter((item) => item.type === config.itemTypes.passion);
    data.data.scars = data.data.items.filter((item) => item.type === config.itemTypes.scar);
    data.data.properties = data.data.items.filter((item) => ([config.itemTypes.weapon, config.itemTypes.coat, config.itemTypes.plate, config.itemTypes.helm, config.itemTypes.shield, config.itemTypes.misc].includes(item.type)));

    return data;
  }

  async prepareActors(data) {
    const actors = [];
    for (const uuid of data.data.system.actors ?? []) {
      const actor = await fromUuid(uuid);
      if (actor) {
        actors.push((await actor.sheet.getData()).data);
      }
    }
    data.data.steeds = actors.filter((actor) => actor.type === 'steed');
    data.data.companions = actors.filter((actor) => actor.type === 'npc');
    return data;
  }

  /**
   * @override
   */
  activateEditor(name, options = {}, initialContent = "") {
    configureEditor(options);
    super.activateEditor(name, options, initialContent);
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
   * @returns {PBItem}
   */
  getItem(event) {
    return this.actor.items.get(this.getItemId(event));
  }

  /**
   * @param {MouseEvent} event
   * @returns {PBItem}
   */
  getActor(event) {
    return game.actors.get(this.getItemId(event));
  }

  /**
   * @param {MouseEvent} event
   * @returns {String}
   */
  getItemId(event) {
    return $(event.target).closest(".item").data("item-id");
  }

  /**
   * @override
   *
   * @param {JQuery.<HTMLElement>} html
   */
  activateListeners(html) {
    super.activateListeners(html);

    if (!this.options.editable) return;

    this.bindSelectorsEvent("click", {
      ".item-toggle-equipped": this._onToggleEquipped,
      ".item-edit": this._onItemEdit,
      ".item-delete": this._onItemDelete,
      ".actor-edit": this._onActorEdit,
      ".actor-delete": this._onActorDelete,
      ".item-qty-plus": this._onItemAddQuantity,
      ".item-qty-minus": this._onItemSubtractQuantity,
      ".roll-save": this._onSaveRoll,
      ".button-add-item": this._onAddItem,
      ".button-rest": this._onRest,
      ".button-roll-scars": this._onRollScars,
      ".button-restore": this._onRestore,
      ".button-take-damage": this._onTakeDamage,
      ".button-virtue-loss": this._onVirtueLoss,
      ".button-attack": this._onAttack,
      ".inline-roll": this._onInlineRoll,
    });
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  async _onItemEdit(event) {
    event.preventDefault();
    const item = this.getItem(event);
    if (item) {
      item.sheet.render(true);
    }
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  async _onActorEdit(event) {
    event.preventDefault();
    const actor = this.getActor(event);
    if (actor) {
      actor.sheet.render(true);
    }
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  async _onAddItem(event) {
    event.preventDefault();
    const { name, type } = await showAddItemDialog();
    const item = await this.actor.createEmbeddedDocuments("Item", [{ name, type }]);
    item[0].sheet.render(true);
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  async _onItemDelete(event) {
    event.preventDefault();
    const item = this.getItem(event);
    await this.actor.deleteEmbeddedDocuments("Item", [item.id]);
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  async _onActorDelete(event) {
    event.preventDefault();
    const actor = this.getActor(event);
    const actors = this.actor.system.actors.filter((a) => a !== actor.uuid);
    this.actor.update({ "system.actors": actors });
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  async _onSaveRoll(event) {
    event.preventDefault();
    const virtue = $(event.target).closest(".roll-save").data('virtue');
    await actorSaveAction(this.actor, virtue);
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  async _onInlineRoll(event) {
    event.preventDefault();
    const virtue = $(event.target).closest(".inline-roll").data('flavor');
    if (['vigour', 'clarity', 'spirit'].includes(virtue)) {
      event.stopPropagation();
      await actorSaveAction(this.actor, virtue);
    }
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  async _onRollScars(event) {
    event.preventDefault();
    await actorRollScarsAction(this.actor);
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  async _onRestore(event) {
    event.preventDefault();
    await actorRestoreAction(this.actor);
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  async _onTakeDamage(event) {
    event.preventDefault();
    await actorTakeDamageAction(this.actor);
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  async _onVirtueLoss(event) {
    event.preventDefault();
    await attackVirtueLossAction(this.actor)
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  async _onAttack(event) {
    event.preventDefault();
    await actorAttackAction(this.actor)
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  async _onItemAddQuantity(event) {
    event.preventDefault();
    const item = this.getItem(event);
    await item.update({ 'system.quantity.value': Math.min(item.system.quantity.value + 1, item.system.quantity.max) });
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  async _onItemSubtractQuantity(event) {
    event.preventDefault();
    const item = this.getItem(event);
    await item.update({ 'system.quantity.value': Math.max(item.system.quantity.value - 1, 0) });
  }

  async _onRest() {
    await actorRestAction(this.actor);
  }

  /**
   * @private
   *
   * @param {MouseEvent} event
   */
  async _onToggleEquipped(event) {
    const item = this.getItem(event);

    if (!item.system.equipped && [config.itemTypes.coat, config.itemTypes.helm, config.itemTypes.shield, config.itemTypes.plate].includes(item.type)) {
      const equippedItems = this.actor.items.filter((equippedItem) => (item.type === equippedItem.type) && equippedItem.system.equipped);
      for (const equippedItem of equippedItems) {
        await equippedItem.update({ 'system.equipped': false });
      }
    }

    await item.update({ 'system.equipped': !item.system.equipped });
  }

  /** @override */
  async _updateObject(event, formData) {
    const fields = [
      'system.glory',
      'system.guard.value', 'system.guard.max',
      'system.virtues.vigour.value', 'system.virtues.vigour.max',
      'system.virtues.clarity.value', 'system.virtues.clarity.max',
      'system.virtues.spirit.value', 'system.virtues.spirit.max',
    ];

    fields.forEach((key) => {
      if (key in formData) {
        formData[key] = Math.max(formData[key], 0);
      }
    });

    this.render();
    return super._updateObject(event, formData);
  }

  /**
   * @param {DragEvent} event
   * @param {ActorSheet.DropData.Actor} actorData
   * @private
   */
  async _onDropActor(event, actorData) {
    const actor = await fromUuid(actorData.uuid);
    if ([config.actorTypes.steed, config.actorTypes.npc].includes(actor.type)) {
      this.actor.update({ "system.actors": [...new Set([...this.actor.system.actors, actorData.uuid])] });
    }
  }
}
