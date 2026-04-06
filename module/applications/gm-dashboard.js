import { showChatMessage } from "../chat-message/show-chat-message.js";
import { config } from "../config.js";
import { generateHolding, generateLand, generatePerson, generateSkyWeather, generateBeast } from "../generators/generator.js";
import { createKnight } from "../generators/knight.js";
import { createNpc } from "../generators/npc.js";
import { createSquire } from "../generators/squire.js";
import { createWarband } from "../generators/warband.js";
import { drawSystemTable } from "../utils/compendium.js";

class GMDashboard extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: ["mythic-bastionland", "sheet", "gm-dashboard"],

    sheet: {
      initial: "travel"
    },
    window: {
      resizable: false,
      title: "MB.Dashboard.Label"
    },
    position: {
      width: 400
    },
    actions: {
      rollTable: GMDashboard._onRollTable,
      rollMultipleTables: GMDashboard._onRollMultipleTables,
      rollGenerator: GMDashboard._onRollGenerator,
      rollActorGenerator: GMDashboard._onRollActorGenerator
    }
  };

  static PARTS = {
    template: {
      template: `${config.systemPath}templates/applications/gm-dashboard.hbs`
    }
  };

  GENERATORS = {
    "sky-weather": generateSkyWeather,
    "person": generatePerson,
    "land": generateLand,
    "holding": generateHolding,
    "beast": generateBeast
  };

  ACTOR_GENERATORS = {
    "knight": createKnight,
    "npc": createNpc,
    "warband": createWarband,
    "squire": createSquire
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.rollModes = Object.keys(CONFIG.ChatMessage.modes).map(key => ({ label: `${CONFIG.ChatMessage.modes[key].label}`, value: key }));
    context.myths = await this._getMythTables();
    context.tabs = this._prepareTabs("primary");

    return context;
  }

  async close(options) {
    if (options?.closeKey !== true) {
      return super.close(options);
    }
  }

  async _getMythTables() {
    return game.packs
      .get(config.coreRollTable)
      .folders.find(folder => folder.name === "Myths")
      .children.map(child => ({
        name: child.folder.name,
        title: child.entries[0].name.split(" - ")[0].trim(),
        tables: child.entries.map(entry => entry.name).join(";")
      }));
  }

  /**
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onRollGenerator(event) {
    event.preventDefault();
    const button = event.target;
    const title = button.dataset["title"];
    const generator = button.dataset["generator"];
    const generatorAction = this.GENERATORS[generator];
    const rollMode = this.element.querySelector("[name=roll_mode]").value;

    if (generatorAction) {
      button.setAttribute("disabled", true);

      await showChatMessage({
        title,
        outcomes: [{
          type: "generator-action",
          description: await generatorAction()
        }],
        rollMode
      });
      button.removeAttribute("disabled");
    }
  }

  /**
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onRollActorGenerator(event) {
    event.preventDefault();
    const button = event.target;
    const title = button.dataset["title"];
    const generator = button.dataset["generator"];
    const generatorAction = this.ACTOR_GENERATORS[generator];
    const rollMode = this.element.querySelector("[name=roll_mode]").value;

    if (generatorAction) {
      button.setAttribute("disabled", true);
      const actor = await generatorAction();

      await showChatMessage({
        title,
        outcomes: [{
          type: "generator-action",
          description: actor.name
        }],
        rollMode
      });
      button.removeAttribute("disabled");
    }
  }

  /**
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onRollTable(event) {
    const button = event.target;
    const tableName = button.dataset["table"];
    const rollMode = this.element.querySelector("[name=roll_mode]").value;

    button.setAttribute("disabled", true);

    const draw = (await drawSystemTable(tableName));
    const result = draw.results.pop();

    await showChatMessage({
      title: result.parent.name,
      outcomes: [{
        type: "roll-table",
        formulaLabel: draw.roll.formula,
        roll: draw.roll,
        description: result.description
      }],
      rollMode
    });

    button.removeAttribute("disabled");
  }

  /**
   * @param {MouseEvent} event 
   * @this MBActorSheet
   */
  static async _onRollMultipleTables(event) {
    event.preventDefault();
    const button = event.target;

    const rollMode = this.element.querySelector("[name=roll_mode]").value;
    const title = button.dataset["label"];
    const tableNames = button.dataset["tables"].split(";");
    const outcomes = [];

    button.setAttribute("disabled", true);

    for (const tableName of tableNames) {
      const draw = (await drawSystemTable(tableName));
      const result = draw.results.pop();
      outcomes.push({
        type: "roll-table-multi",
        title: result.parent.name.split(" - ")[1],
        formulaLabel: draw.roll.formula,
        roll: draw.roll,
        description: result.description
      });
    }

    await showChatMessage({
      title,
      outcomes,
      rollMode
    });

    button.removeAttribute("disabled");
  }
}

export const showGMDashboard = async () => {
  const dashboard = new GMDashboard();
  dashboard.render(true);
};
