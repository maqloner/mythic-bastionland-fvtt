import { config } from "../../config.js";

class GenerateNpcDialog extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  constructor({ generatorConfig = {}, callback } = {}) {
    super();
    this.callback = callback;
    this.generatorConfig = generatorConfig;
  }

  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: ["mythic-bastionland", "take-damage-dialog"],
    window: {
      resizable: false,
      animate: false,
      title: "MB.GenerateDialogTitle"
    },
    form: {
      closeOnSubmit: false,
      submitOnChange: false,
      handler: GenerateNpcDialog._onSubmit
    },
    position: {
      width: 600
    }
  };

  static PARTS = {
    form: {
      template: `${config.systemPath}/templates/applications/dialog/generate-npc-dialog.hbs`
    }
  };

  _onKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      return this.close();
    }
  }

  _onRender(context, options) {
    super._onRender(context, options);
    this.element.querySelectorAll("input[name=type]").forEach(input => {
      input.addEventListener("change", (event) => this._onTypeChange(event));
    });
    this.element.addEventListener("keydown", this._onKeyDown.bind(this));
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
      config: foundry.utils.mergeObject(this._getDefaultGeneratorConfig(), this.generatorConfig)
    });
  }

  async _onTypeChange() {
    const type = this.element.querySelector("input[name=type]:checked").value;
    switch (type) {
      case "person":
        this.generatorConfig = this._getDefaultGeneratorConfig();
        break;
      case "soldier":
        this.generatorConfig = this._getSoldierConfig();
        break;
      case "knight":
        this.generatorConfig = this._getKnightConfig();
        break;
    }
    this.render();
  }

  _getDefaultGeneratorConfig() {
    return {
      type: "person",
      virtues: "1d12 + d6",
      guard: "1d6",
      weapons: "1d2 - 1",
      armors: "0",
      tools: "2d2",
      beast: false,
      person: false,
      steed: false,
      squire: false,
      personality: true,
      desire: true,
      conflict: false,
      task: true,
      heraldry: false,
      battlefield: false,
      ailment: false
    };
  }

  _getSoldierConfig() {
    return foundry.utils.mergeObject(this._getDefaultGeneratorConfig(), {
      type: "soldier",
      weapons: "1d2",
      armors: "1d2",
      tools: "2d2 - 1",
      beast: false,
      person: false,
      steed: false,
      squire: false,
      personality: true,
      desire: true,
      conflict: false,
      task: true,
      heraldry: true,
      battlefield: false,
      ailment: false
    });
  }

  _getKnightConfig() {
    return foundry.utils.mergeObject(this._getDefaultGeneratorConfig(), {
      type: "knight",
      weapons: "1d2",
      armors: "1d3",
      tools: "0",
      beast: false,
      person: false,
      steed: true,
      squire: true,
      personality: true,
      desire: true,
      conflict: false,
      task: true,
      heraldry: true,
      battlefield: false,
      ailment: false
    });
  }

  static async _onSubmit() {
    this.element.querySelectorAll("input[type='text']").forEach(input => {
      input.value = input.value ? (Roll.validate(input.value) ? input.value : "0") : "";
    });

    const type = this.element.querySelector("[name=type]:checked").value;
    const virtues = this.element.querySelector("[name=virtues]").value;
    const guard = this.element.querySelector("[name=guard]").value;
    const weapons = this.element.querySelector("[name=weapons]").value;
    const armors = this.element.querySelector("[name=armors]").value;
    const tools = this.element.querySelector("[name=tools]").value;

    const beast = !!this.element.querySelector("[name=beast]").checked;
    const person = !!this.element.querySelector("[name=person]").checked;
    const steed = !!this.element.querySelector("[name=steed]").checked;
    const squire = !!this.element.querySelector("[name=squire]").checked;

    const personality = !!this.element.querySelector("[name=personality]").checked;
    const desire = !!this.element.querySelector("[name=desire]").checked;
    const task = !!this.element.querySelector("[name=task]").checked;
    const conflict = !!this.element.querySelector("[name=conflict]").checked;
    const heraldry = !!this.element.querySelector("[name=heraldry]").checked;
    const battlefield = !!this.element.querySelector("[name=battlefield]").checked;
    const ailment = !!this.element.querySelector("[name=ailment]").checked;

    this.callback({
      type,
      virtues,
      guard,
      weapons,
      armors,
      tools,
      beast,
      person,
      steed,
      squire,
      personality,
      desire,
      conflict,
      task,
      heraldry,
      battlefield,
      ailment
    });

    await this.close();
  }
}

/**
 * @returns {Promise.<{
*   type: String, 
*   virtues: String, 
*   guard: String, 
*   weapons: String, 
*   armors: String 
*   tools: String, 
*   beast: Boolean,
*   person: Boolean,
*   steed: Boolean,
*   squire: Boolean,
*   personality: Boolean,
*   desire: Boolean,
*   conflict: Boolean,
*   task: Boolean,
*   heraldry: Boolean,
*   battlefield: Boolean,
*   ailment: Boolean
* }>}
*/
export const showGenerateNpcDialog = (generatorConfig) =>
  new Promise((resolve) => {
    new GenerateNpcDialog({
      generatorConfig,
      callback: resolve
    }).render(true);
  });
