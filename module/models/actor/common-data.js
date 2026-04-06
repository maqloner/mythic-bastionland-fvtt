const { HTMLField, SchemaField, NumberField, StringField, ArrayField, BooleanField } = foundry.data.fields;

export class CommonData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      biography: new HTMLField({ required: true, initial: "" }),
      virtues: new SchemaField({
        vigour: new SchemaField({
          value: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
          max: new NumberField({ required: true, integer: true, min: 0, initial: 10 })
        }),
        clarity: new SchemaField({
          value: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
          max: new NumberField({ required: true, integer: true, min: 0, initial: 10 })
        }),
        spirit: new SchemaField({
          value: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
          max: new NumberField({ required: true, integer: true, min: 0, initial: 10 })
        })
      }),
      guard: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
      }),
      fatigue: new BooleanField({ initial: false }),
      actors: new ArrayField(new StringField())
    };
  }
}
