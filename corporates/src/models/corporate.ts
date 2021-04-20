import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface CorporateAttrs {
  title: string;
  content: string;
  category: string;
  active: boolean;
  userId: string;
  churchId: string;
}

interface CorporateDoc extends mongoose.Document {
  title: string;
  content: string;
  category: string;
  active: boolean;
  userId: string;
  churchId: string;
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
  category: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  },
  userId: {
    type: String,
    required: true
  },
  churchId: {
    type: String,
    required: false
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