import { config } from "../config.js";

export const configureHandlebar = () => {

  Handlebars.registerHelper("concat", (...args) => [...args].slice(0, -1).join(""));

  Handlebars.registerHelper("printIf", (cond, v1) => (cond ? v1 : ""));

  Handlebars.registerHelper("printIfElse", (cond, v1, v2) => (cond ? v1 : v2));

  Handlebars.registerHelper("eq", (v1, v2) => v1 === v2);

  Handlebars.registerHelper("gt", (v1, v2) => v1 > v2);

  Handlebars.registerHelper("gte", (v1, v2) => v1 >= v2);

  Handlebars.registerHelper("lt", (v1, v2) => v1 < v2);

  Handlebars.registerHelper("lte", (v1, v2) => v1 <= v2);

  Handlebars.registerHelper("or", (...args) => [...args].slice(0, -1).some(arg => !!arg));

  Handlebars.registerHelper("isArray", (v1) => {
    return Array.isArray(v1);
  });

  Handlebars.registerHelper("each-chunk", function (size, source, options) {
    let chunk = [];
    let out = "";
    if (source && source.length > 0) {
      for (let index = 0; index < source.length; index++) {
        if (index > 0 && index % size === 0) {
          out += options.fn(chunk);
          chunk = [];
        }
        chunk.push(source[index]);
      }
      out += options.fn(chunk);
    }
    return out;
  });

  loadTemplates({
    "item-list": `${config.systemPath}/templates/applications/sheet/actor/common/item-list.hbs`,
    "actor-list": `${config.systemPath}/templates/applications/sheet/actor/common/actor-list.hbs`,
    "virtues": `${config.systemPath}/templates/applications/sheet/actor/common/virtues.hbs`,
    "actions": `${config.systemPath}/templates/applications/sheet/actor/common/actions.hbs`
  });
};
