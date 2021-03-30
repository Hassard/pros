import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ChurchAttrs {
  name: string;
  userId: string;
}

interface ChurchDoc extends mongoose.Document {
  name: string;
  userId: string;
  version: number;
}

interface ChurchModel extends mongoose.Model<ChurchDoc> {
  build(attrs: ChurchAttrs): ChurchDoc;
}

const churchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userId: {
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
  return new Church(attrs);
}

const Church = mongoose.model<ChurchDoc, ChurchModel>('Church', churchSchema);

export { Church };