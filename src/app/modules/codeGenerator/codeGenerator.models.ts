import { Schema, model, Types } from 'mongoose';
import { ICodeGenerator } from './codeGenerator.interface';

const codeGeneratorSchema = new Schema<ICodeGenerator>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    churchId: {
      type: Types.ObjectId,
      ref: 'Church',
      required: true,
    },
    memberId: {
      type: Types.ObjectId,
      ref: 'User',
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const codeGenerator = model<ICodeGenerator>(
  'codeGenerator',
  codeGeneratorSchema,
);

export default codeGenerator;
