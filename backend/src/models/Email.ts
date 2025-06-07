import mongoose, { Schema, Document } from 'mongoose';

export interface IEmail extends Document {
  account: string;
  folder: string;
  from: string;
  to: string;
  subject: string;
  date: Date;
  body: string;
  html: string;
  category: string;
}

const EmailSchema: Schema = new Schema({
  account: { type: String, required: true },
  folder: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  body: { type: String, required: true },
  html: { type: String },
  category: { type: String, default: 'Uncategorized' }
});

export const EmailModel = mongoose.model<IEmail>('Email', EmailSchema);
