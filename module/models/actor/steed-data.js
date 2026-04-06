import { CommonData } from "./common-data.js";

const { StringField } = foundry.data.fields;

export class SteedData extends CommonData {
  static defineSchema() {
    return Object.assign(super.defineSchema(), {
      trample: new StringField({ required: true, initial: "" })
    });
  }
}
