export const configureHandlebar = () => {

  Handlebars.registerHelper('concat', (...args) => [...args].slice(0, -1).join(''));

  Handlebars.registerHelper("printIf", (cond, v1) => (cond ? v1 : ""));

  Handlebars.registerHelper("printIfElse", (cond, v1, v2) => (cond ? v1 : v2));

  Handlebars.registerHelper("eq", (v1, v2) => v1 === v2);

  Handlebars.registerHelper("gt", (v1, v2) => v1 > v2);

  Handlebars.registerHelper("gte", (v1, v2) => v1 >= v2);

  Handlebars.registerHelper("lt", (v1, v2) => v1 < v2);

  Handlebars.registerHelper("lte", (v1, v2) => v1 <= v2);

  Handlebars.registerHelper("or", (...args) => [...args].slice(0, -1).some(arg => !!arg));

  Handlebars.registerHelper("isArray", (v1) => {
    return Array.isArray(v1)
  });

  Handlebars.registerHelper("wysiwig", function (options) {
    const content = options.hash.content;
    delete options.hash.content;

    const documents = options.hash.documents !== false;
    const owner = Boolean(options.hash.owner);
    const rollData = options.hash.rollData;

    const enrichedContent = TextEditor.enrichHTML(content, { secrets: owner, documents, rollData, async: false });
    return HandlebarsHelpers.editor(enrichedContent, options);
  });

  loadTemplates({
    "item-list": "systems/mythicbastionland/templates/actor/common/item-list.hbs",
    "actor-list": "systems/mythicbastionland/templates/actor/common/actor-list.hbs",
    "virtues": "systems/mythicbastionland/templates/actor/common/virtues.hbs",
    "actions": "systems/mythicbastionland/templates/actor/common/actions.hbs"
  });
};
