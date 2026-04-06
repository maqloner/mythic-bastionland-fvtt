const { HTMLField, BooleanField, NumberField } = foundry.data.fields;

export class PlateData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ required: true, initial: "" }),
      armor: new NumberField({ required: true, initial: 1, min: 0 }),
      equipped: new BooleanField({ initial: false })
    };
  }
}
