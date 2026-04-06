const { HTMLField } = foundry.data.fields;

export class ScarData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ required: true, initial: "" })
    };
  }
}
