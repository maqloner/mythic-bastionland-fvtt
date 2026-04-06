const { HTMLField, BooleanField, NumberField, StringField } = foundry.data.fields;

export class ShieldData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ required: true, initial: "" }),
      armor: new NumberField({ required: true, initial: 1, min: 0 }),
      damage: new StringField({ required: true, initial: "d4" }),
      equipped: new BooleanField({ initial: false })
    };
  }
}
