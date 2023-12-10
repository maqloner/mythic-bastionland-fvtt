import { showChatMessage } from "../chat-message/show-chat-message.js";
import { config } from "../config.js";
import { drawSystemTable } from "../utils/compendium.js";

class GMDashboard extends Application {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: `${config.systemPath}/templates/applications/gm-dashboard.hbs`,
      classes: ["mythic-bastionland", "sheet", "gm-dashboard"],
      title: game.i18n.localize("MB.Dashboard.Label"),
      width: 400,
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
  async getData(options) {
    const data = super.getData(options);
    data.rollModes = CONST.DICE_ROLL_MODES;
    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".roll-table").on("click", (event) => this.#onRollTable(event));
    html.find(".roll-table-multi").on("click", (event) => this.#onRollTableMulti(event));
  }

  async #onRollTable(event) {
    event.preventDefault();
    const tableName = $(event.target).closest("button").data("table");
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
  }

  async #onRollTableMulti(event) {
    event.preventDefault();
    const label = $(event.target).closest("button").data("label");
    const tableNames = $(event.target).closest("button").data("tables").split(";");
    const outcomes = [];
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
      title: label,
      outcomes: outcomes,
      rollMode: this.element.find("[name=roll_mode]").val()
    });
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
