import mongoose, { Document } from "mongoose";
const { Schema, model } = mongoose;

export interface ILogAction extends Document {
  admin: mongoose.Types.ObjectId;
  action: string;
  module: string;
  donnees?: any;
}

const LogActionSchema = new Schema<ILogAction>({
  admin: { type: Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  action: { type: String, required: true },
  module: { type: String, required: true },
  donnees: { type: Schema.Types.Mixed },
}, { timestamps: true });

const LogAction = mongoose.models.LogAction || model<ILogAction>("LogAction", LogActionSchema);
export default LogAction;
