import { showChatMessage } from "../chat-message/show-chat-message.js";
import { config } from "../config.js";
import { generateHolding, generateLand, generatePerson, generateSkyWeather, generateBeast } from "../generators/generator.js";
import { drawSystemTable } from "../utils/compendium.js";

class GMDashboard extends Application {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: `${config.systemPath}/templates/applications/gm-dashboard.hbs`,
      classes: ["mythic-bastionland", "sheet", "gm-dashboard"],
      title: game.i18n.localize("MB.Dashboard.Label"),
      width: 450,
      resizable: false,
      height: "auto",
      scrollY: [".scrollable"],
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "travel"
        }
      ]
    });
  }

  /** @override */
  _getHeaderButtons() {
    const buttons = [
      {
        label: "Close",
        class: "close",
        icon: "fas fa-times",
        onclick: () => this.close({force: true})
      }
    ];
    return buttons;
  }

  /** @override */
  async getData(options) {
    const data = super.getData(options);
    data.rollModes = Object.values(CONST.DICE_ROLL_MODES).map((rollMode) => ({label: `MB.RollMode.${rollMode}`, value: rollMode}));
    data.myths = await this.#getMythTables();
    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".roll-table").on("click", (event) => this.#onRollTable(event));
    html.find(".roll-table-multi").on("click", (event) => this.#onRollTableMulti(event));

    html.find(".roll-sky-weather").on("click", (event) => this.#onRollGenerator(event, generateSkyWeather));
    html.find(".roll-person").on("click", (event) => this.#onRollGenerator(event, generatePerson));
    html.find(".roll-land").on("click", (event) => this.#onRollGenerator(event, generateLand));
    html.find(".roll-holding").on("click", (event) => this.#onRollGenerator(event, generateHolding));
    html.find(".roll-beast").on("click", (event) => this.#onRollGenerator(event, generateBeast));
  }

  async close(options) {    
    if (options.force) {
      return super.close(options);
    }
  }

  async #getMythTables() {
    return game.packs
      .get(config.coreRollTable)
      .folders.find(folder => folder.name === "Myths")
      .children.map(child => ({
        name: child.folder.name,        
        title: child.entries[0].name.split(" - ")[0].trim(),
        tables: child.entries.map(entry => entry.name).join(";")
      }));
  }

  async #onRollGenerator(event, generatorAction) {
    event.preventDefault();
    const button = $(event.target).closest("button");
    const title = button.data("title");

    button.attr("disabled", true);

    await showChatMessage({
      title,
      outcomes: [{
        type: "generator-action",
        description: await generatorAction()
      }],
      rollMode: this.element.find("[name=roll_mode]").val()
    });
    button.removeAttr("disabled");
  }

  async #onRollTable(event) {
    event.preventDefault();
    const button = $(event.target).closest("button");
    const tableName = button.data("table");

    button.attr("disabled", true);

    const draw = (await drawSystemTable(tableName));
    const result = draw.results.pop();

    await showChatMessage({
      title: result.parent.name,
      outcomes: [{
        type: "roll-table",
        formulaLabel: draw.roll.formula,
        roll: draw.roll,
        description: result.text
      }],
      rollMode: this.element.find("[name=roll_mode]").val()
    });

    button.removeAttr("disabled");
  }

  async #onRollTableMulti(event) {
    event.preventDefault();
    const button = $(event.target).closest("button");

    const rollMode = this.element.find("[name=roll_mode]").val();
    const title = button.data("label");
    const tableNames = $(event.target).closest("button").data("tables").split(";");
    const outcomes = [];

    button.attr("disabled", true);

    for (const tableName of tableNames) {
      const draw = (await drawSystemTable(tableName));
      const result = draw.results.pop();
      outcomes.push({
        type: "roll-table-multi",
        title: result.parent.name.split(" - ")[1],
        formulaLabel: draw.roll.formula,
        roll: draw.roll,
        description: result.text
      });
    }

    await showChatMessage({
      title,
      outcomes,
      rollMode
    });

    button.removeAttr("disabled");
  }
}


let dashboard = null;
export const showGMDashboard = () =>
  new Promise(() => {
    if (!dashboard) {
      dashboard = new GMDashboard();
    }
    dashboard.render(true);
  });
