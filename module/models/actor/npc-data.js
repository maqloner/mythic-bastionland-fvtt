import { config } from "../../config.js";
import { CommonData } from "./common-data.js";

const { StringField } = foundry.data.fields;

export class NpcData extends CommonData {
  static defineSchema() {
    return Object.assign(super.defineSchema(), {
      age: new StringField({ required: true, initial: config.age.young, choices: Object.keys(config.age) })
    });
  }
}
