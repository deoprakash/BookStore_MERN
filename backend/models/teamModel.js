import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    department: {
        type: String,
        required: true,
        enum: ["Editorial", "Design", "Marketing", "Operations", "Technology", "Management", "Finance", "Sales"],
    },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    bio: { type: String, trim: true },
    photo: { type: String },      // stored filename like uploads/team-xxx.jpg
    linkedin: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    joinedAt: { type: Date, default: Date.now },
    displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);
export default Team;
