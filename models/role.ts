import mongoose, { Document } from "mongoose";
const { Schema, model } = mongoose;

export interface IRole extends Document {
  nom: string;
  permissions: string[]; // ✅ tableau dynamique de permissions
}

const RoleSchema = new Schema<IRole>({
  nom: { type: String, required: true, unique: true },
  permissions: { type: [String], default: [] } // permissions dynamiques
}, { timestamps: true });

const Role = mongoose.models.Role || model<IRole>("Role", RoleSchema);
export default Role;
