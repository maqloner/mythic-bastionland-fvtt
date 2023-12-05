import { showChatMessage } from "../chat-message/show-chat-message.js";
import { config } from "../config.js";
import { drawSystemTable } from "../utils/compendium.js";

class GMDashboard extends Application {
  constructor({ callback } = {}) {
    super();
    this.callback = callback;
  }

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
    console.log("activate listeners", html.find(".roll-table"));
    html.find(".roll-table").on("click", this._onRollTable.bind(this));
    html.find(".roll-table-multi").on("click", this._onRollTableMulti.bind(this));
  }

  async _onRollTable(event) {
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
      rollMode: this.getRollMode()
    });
  }

  async _onRollTableMulti(event) {
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
      rollMode: this.getRollMode()
    });
  }

  getRollMode() {
    const rollMode =  this.element.find("[name=roll_mode]").val();
    console.log(rollMode);
    return rollMode;
  }
}


let dashboard = null;
/**
 * @returns {Promise.<{damage: Boolean, virtue: String}>}
 */
export const showGMDashboard = (data = {}) =>
  new Promise((resolve) => {
    if (!dashboard) {
      dashboard = new GMDashboard({
        ...data,
        callback: resolve
      });
    }
    dashboard.render(true);
  });
