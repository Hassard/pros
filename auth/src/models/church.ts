import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ChurchAttrs {
  id: string;
  name: string;
}

export interface ChurchDoc extends mongoose.Document {
  name: string;
  version: number;
}

interface ChurchModel extends mongoose.Model<ChurchDoc> {
  build(attrs: ChurchAttrs): ChurchDoc;
  findByEvent(event: { id: string, version: number }): Promise<ChurchDoc | null>;
}

const churchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});
churchSchema.set('versionKey', 'version');
churchSchema.plugin(updateIfCurrentPlugin);

churchSchema.statics.build = (attrs: ChurchAttrs) => {
  return new Church({
    _id: attrs.id,
    name: attrs.name
  });
}
churchSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Church.findOne({
    _id: event.id,
    version: event.version -1
  });
}

const Church = mongoose.model<ChurchDoc, ChurchModel>('Church', churchSchema);

export { Church };