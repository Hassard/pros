import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface CorporateAttrs {
  title: string;
  content: string;
  userId: string;
}

interface CorporateDoc extends mongoose.Document {
  title: string;
  content: string;
  userId: string;
  version: number;
}

interface CorporateModel extends mongoose.Model<CorporateDoc> {
  build(attrs: CorporateAttrs): CorporateDoc;
}

const corporateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
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
corporateSchema.set('versionKey', 'version');
corporateSchema.plugin(updateIfCurrentPlugin);

corporateSchema.statics.build = (attrs: CorporateAttrs) => {
  return new Corporate(attrs);
}

const Corporate = mongoose.model<CorporateDoc, CorporateModel>('Corporate', corporateSchema);

export { Corporate };