import { config } from "../../config.js";

class GenerateNpcDialog extends Application {
  constructor({ generatorConfig = {}, callback } = {}) {
    super();
    this.callback = callback;
    this.generatorConfig = generatorConfig;
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: `${config.systemPath}/templates/applications/dialog/generate-npc-dialog.hbs`,
      classes: ["mythic-bastionland", "generate-npc-dialog"],
      title: game.i18n.localize("MB.GenerateDialogTitle"),
      width: 600,
      height: "auto"
    });
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find("input[name=type]").on("change", (event) => this.#onTypeChange(event));
    html.find(".cancel-button").on("click", (event) => this.#onCancel(event));
    html.find(".ok-button").on("click", (event) => this.#onSubmit(event));
  }

  /** @override */
  async getData(options) {
    const data = super.getData(options);
    data.config = foundry.utils.mergeObject(this.#getDefaultGeneratorConfig(), this.generatorConfig);
    return data;
  }

  async #onCancel(event) {
    event.preventDefault();
    await this.close();
  }

  async #onTypeChange() {
    const type = $("input[name=type]:checked").val();
    switch (type) {
      case "person":
        this.generatorConfig = this.#getDefaultGeneratorConfig();
        break;
      case "soldier":
        this.generatorConfig = this.#getSoldierConfig();
        break;
      case "knight":
        this.generatorConfig = this.#getKnightConfig();
        break;
    }
    this.render();
  }

  #getDefaultGeneratorConfig() {
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

  #getSoldierConfig() {
    return foundry.utils.mergeObject(this.#getDefaultGeneratorConfig(), {
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

  #getKnightConfig() {
    return foundry.utils.mergeObject(this.#getDefaultGeneratorConfig(), {
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

  async #onSubmit(event) {
    event.preventDefault();

    $(this.element).find("input[type='text']").each((index, input) => {
      $(input).val(Roll.validate($(input).val()) ? $(input).val() : "0");
    });

    const type = this.element.find("[name=type]:checked").val();
    const virtues = this.element.find("[name=virtues]").val();
    const guard = this.element.find("[name=guard]").val();
    const weapons = this.element.find("[name=weapons]").val();
    const armors = this.element.find("[name=armors]").val();
    const tools = this.element.find("[name=tools]").val();

    const beast = !!this.element.find("[name=beast]:checked").val();
    const person = !!this.element.find("[name=person]:checked").val();
    const steed = !!this.element.find("[name=steed]:checked").val();
    const squire = !!this.element.find("[name=squire]:checked").val();

    const personality = !!this.element.find("[name=personality]:checked").val();
    const desire = !!this.element.find("[name=desire]:checked").val();
    const task = !!this.element.find("[name=task]:checked").val();
    const conflict = !!this.element.find("[name=conflict]:checked").val();
    const heraldry = !!this.element.find("[name=heraldry]:checked").val();
    const battlefield = !!this.element.find("[name=battlefield]:checked").val();
    const ailment = !!this.element.find("[name=ailment]:checked").val();

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
