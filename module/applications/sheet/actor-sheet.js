import { config } from "../../config.js";
import { actorRestAction } from "../../actions/actor-rest-action.js";
import { actorRollScarsAction } from "../../actions/actor-roll-scars-action.js";
import { actorSaveAction } from "../../actions/actor-save-action.js";
import { actorRestoreAction } from "../../actions/actor-restore-action.js";
import { actorTakeDamageAction } from "../../actions/actor-take-damage-action.js";
import { actorVirtueLossAction } from "../../actions/actor-virtue-loss-action.js";
import { actorAttackAction } from "../../actions/actor-attack-action.js";
import { actorRegenerateAction } from "../../actions/actor-regenerate-action.js";
import { actorAddItemAction } from "../../actions/actor-add-item-action.js";
import { actorInlineRollAction } from "../../actions/actor-inline-roll-action.js";

export class MBActorSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {

  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: ["mythic-bastionland", "sheet", "actor"],
    form: {
      handler: MBActorSheet._onSubmitForm,
      submitOnChange: true
    },
    position: {
      height: 600
    },
    window: {
      resizable: true,
      controls: [{
        action: "regenerateActor",
        visible: MBActorSheet._canRegenerateActor,
        label: "MB.Regenerate",
        icon: "fas fa-dice-d20"
      }]
    },
    actions: {
      rollSave: MBActorSheet._onRollSave,

      itemToggleEquipped: MBActorSheet._onToggleEquipped,
      itemEdit: MBActorSheet._onItemEdit,
      itemDelete: MBActorSheet._onItemDelete,
      itemIncreaseQuantity: MBActorSheet._onItemIncreaseQuantity,
      itemDecreaseQuantity: MBActorSheet._onItemDecreaseQuantity,

      actorEdit: MBActorSheet._onActorEdit,
      actorDelete: MBActorSheet._onActorDelete,

      buttonAttack: MBActorSheet._onButtonAttack,
      buttonTakeDamage: MBActorSheet._onButtonTakeDamage,
      buttonVirtueLoss: MBActorSheet._onButtonVirtueLoss,
      buttonRest: MBActorSheet._onButtonRest,
      buttonRestore: MBActorSheet._onButtonRestore,
      buttonRollScars: MBActorSheet._onButtonRollScars,
      buttonAddItem: MBActorSheet._onButtonAddItem,
      regenerateActor: MBActorSheet._onActorRegenerate
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
        template: `${config.systemPath}templates/applications/sheet/actor/${this.actor.type}-sheet.hbs`,
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

    const items = await this._prepareItems(context);
    const linkedActors = await this._prepareLinkedActors(context);

    return Object.assign(context, {
      config: config,
      values: {
        ages: Object.values(config.age).map(value => ({ value, label: `MB.Actor.Age.${value}` })),
        ranks: Object.values(config.rank).map(value => ({ value, label: `MB.Actor.Rank.${value}` }))
      },
      extra: {
        enrichedBiography: await foundry.applications.ux.TextEditor.implementation.enrichHTML(context.document.system.biography, { secret: context.editable }),
        steeds: linkedActors.filter((actor) => [config.actorTypes.steed].includes(actor.type)),
        companions: linkedActors.filter((actor) => [config.actorTypes.npc, config.actorTypes.creature, config.actorTypes.squire].includes(actor.type)),
        abilities: items.filter((item) => [config.itemTypes.ability].includes(item.type)),
        passions: items.filter((item) => [config.itemTypes.passion].includes(item.type)),
        scars: items.filter((item) => [config.itemTypes.scar].includes(item.type)),
        properties: items.filter((item) => [config.itemTypes.weapon, config.itemTypes.coat, config.itemTypes.plate, config.itemTypes.helm, config.itemTypes.shield, config.itemTypes.misc].includes(item.type)),
        totalArmor: items.reduce((totalArmor, item) => {
          return totalArmor + (item.system.equipped ? (item.system.armor ?? 0) : 0);
        }, 0)
      }
    });
  }

  /**
   * @private
   * 
   * @param {ApplicationRenderContext} context 
   * @returns {object[]}
   */
  async _prepareItems(context) {
    const itemTypeOrders = { weapon: 1, shield: 2, plate: 3, coat: 4, helm: 5, misc: 6, passion: 7, ability: 7, scar: 7 };

    const items = context.source.items
      .map(item => Object.assign({}, item))
      .sort((a, b) => itemTypeOrders[a.type] - itemTypeOrders[b.type] || a.name.localeCompare(b.name));


    for (const item of items) {
      item.extra = {
        enrichedDescription: await foundry.applications.ux.TextEditor.implementation.enrichHTML(item.system.description),
        isEquippable: [config.itemTypes.weapon, config.itemTypes.coat, config.itemTypes.plate, config.itemTypes.helm, config.itemTypes.shield].includes(item.type)
      };
    }

    return items;
  }

  /**
   * @private
   * 
   * @param {ApplicationRenderContext} context 
   * @returns {object[]}
   */
  async _prepareLinkedActors(context) {
    const actors = [];

    for (const uuid of context.document.system.actors ?? []) {
      const actor = await fromUuid(uuid);
      if (actor) {
        actors.push((await actor.sheet._prepareContext()).source);
      }
    }

    return actors;
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

  /**
   * @private
   * 
   * @param {MouseEvent} event
   * @returns {Item}
   */
  _getItem(event) {
    return this.actor.items.get(this._getEventData(event, "item-id"));
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event
   * @returns {Actor}
   */
  _getActor(event) {
    return game.actors.get(this._getEventData(event, "actor-id"));
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
   * @this MBActorSheet
   */
  static async _onActorRegenerate() {
    await actorRegenerateAction(this.actor);
  }

  /**
   * @private
   * 
   * @returns {Boolean}
   */
  static _canRegenerateActor() {
    return [config.actorTypes.knight, config.actorTypes.npc, config.actorTypes.squire, config.actorTypes.warband].includes(this.actor.type) && (game.user.isGM || (game.settings.get("mythicbastionland", "MB.AllowPlayerRegenerateButton")));
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onRollSave(event) {
    await actorSaveAction(this.actor, { virtue: this._getEventData(event, "virtue") });
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  async _onInlineRoll(event) {
    event.preventDefault();
    event.stopPropagation();
    await actorInlineRollAction(this.actor, this._getInlineRollData(event));
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onButtonAttack() {
    await actorAttackAction(this.actor);
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onButtonTakeDamage() {
    await actorTakeDamageAction(this.actor);
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onButtonVirtueLoss() {
    await actorVirtueLossAction(this.actor);
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onButtonRest() {
    await actorRestAction(this.actor);
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onButtonRestore() {
    await actorRestoreAction(this.actor);
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onButtonRollScars() {
    await actorRollScarsAction(this.actor);
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onButtonAddItem() {
    await actorAddItemAction(this.actor);
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onItemEdit(event) {
    const item = this._getItem(event);
    if (item) {
      item.sheet.render(true);
    }
  }


  /**
   * @private
   * 
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onItemDelete(event) {
    const item = this._getItem(event);
    await this.actor.deleteEmbeddedDocuments("Item", [item.id]);
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onItemIncreaseQuantity(event) {
    const item = this._getItem(event);
    await item.update({ "system.quantity.value": item.system.quantity.max ? Math.min(item.system.quantity.value + 1, item.system.quantity.max) : item.system.quantity.value + 1 });
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onItemDecreaseQuantity(event) {
    const item = this._getItem(event);
    await item.update({ "system.quantity.value": Math.max(item.system.quantity.value - 1, 0) });
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onToggleEquipped(event) {
    const item = this._getItem(event);
    await item.update({ "system.equipped": !item.system.equipped });
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onActorEdit(event) {
    const actor = this._getActor(event);
    if (actor) {
      actor.sheet.render(true);
    }
  }

  /**
   * @private
   * 
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onActorDelete(event) {
    const actor = this._getActor(event);
    this.actor.update({ "system.actors": this.actor.system.actors.filter((a) => a !== actor.uuid) });
  }


  /**
   * @override
   * @param {Event} event 
   * @param {{updateData: Object, preventClose: Boolean}}
   * @returns 
   */
  static async _onSubmitForm(event, form, formData) {
    event.preventDefault();

    const fields = [
      "system.glory.value", "system.glory.max",
      "system.guard.value", "system.guard.max",
      "system.virtues.vigour.value", "system.virtues.vigour.max",
      "system.virtues.clarity.value", "system.virtues.clarity.max",
      "system.virtues.spirit.value", "system.virtues.spirit.max"
    ];

    fields.forEach((key) => {
      formData.object[key] = Math.max(formData.object[key], 0);
    });

    await this.document.update(formData.object);
  }

  /**
   * @override
   * @param {DragEvent} event
   * @param {foundry.applications.sheets.ActorSheetV2.DropData.Actor} actorData
   * @private
   */
  async _onDropActor(event, actorData) {
    const actor = await fromUuid(actorData.uuid);
    if ([config.actorTypes.steed, config.actorTypes.npc, config.actorTypes.squire, config.actorTypes.creature].includes(actor.type)) {
      this.actor.update({ "system.actors": [...new Set([...this.actor.system.actors, actorData.uuid])] });
    }
  }
}
