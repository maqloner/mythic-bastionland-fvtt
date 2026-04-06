const { HTMLField, NumberField, SchemaField } = foundry.data.fields;

export class MiscData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ required: true, initial: "" }),
      quantity: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        max: new NumberField({ required: false, nullable: true, integer: true, min: 0 })
      })
    };
  }
}
