const { HTMLField, StringField } = foundry.data.fields;

export class KnightItemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ required: true, initial: "" }),
      name: new StringField({ required: true, initial: "" }),
      flavor: new StringField({ required: true, initial: "" }),
      flavorLabel1: new StringField({ required: true, initial: "" }),
      flavorLabel2: new StringField({ required: true, initial: "" })
    };
  }
}
