const { HTMLField, BooleanField, StringField } = foundry.data.fields;

export class WeaponData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ required: true, initial: "" }),
      damage: new StringField({ required: true, initial: "d4" }),
      hefty: new BooleanField({ initial: false }),
      long: new BooleanField({ initial: false }),
      slow: new BooleanField({ initial: false }),
      equipped: new BooleanField({ initial: false })
    };
  }
}
