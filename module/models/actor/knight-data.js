import { config } from "../../config.js";
import { CommonData } from "./common-data.js";

const { SchemaField, NumberField, StringField } = foundry.data.fields;

export class KnightData extends CommonData {
  static defineSchema() {
    return Object.assign(super.defineSchema(), {
      age: new StringField({ required: true, initial: config.age.young, choices: Object.keys(config.age) }),
      rank: new StringField({ required: true, initial: config.rank.knight_errant, choices: Object.keys(config.rank) }),
      knight: new StringField({ required: true, initial: "" }),
      glory: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
      })
    });
  }
}
