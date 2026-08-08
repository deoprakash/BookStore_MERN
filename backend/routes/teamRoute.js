import express from "express";
import multer from "multer";
import {
    createTeamMember,
    getTeamMembers,
    getTeamMemberById,
    updateTeamMember,
    deleteTeamMember,
    updateTeamOrder,
} from "../controllers/teamController.js";
import adminAuth from "../middleware/adminAuth.js";
import { storage } from "../config/cloudinary.js";

const teamRouter = express.Router();

const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Only image files are allowed."), false);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

teamRouter.post("/", adminAuth, upload.single("photo"), createTeamMember);
teamRouter.get("/", getTeamMembers);
teamRouter.put("/reorder", adminAuth, express.json(), updateTeamOrder);
teamRouter.get("/:id", getTeamMemberById);
teamRouter.put("/:id", adminAuth, upload.single("photo"), updateTeamMember);
teamRouter.delete("/:id", adminAuth, deleteTeamMember);

export default teamRouter;
