import express from "express";
import multer from "multer";
import {
    createAuthor,
    getAuthors,
    deleteAuthor,
    getAuthorById,
    updateAuthor,
} from "../controllers/authorController.js";
import adminAuth from "../middleware/adminAuth.js";
import { storage } from "../config/cloudinary.js";

const authorRouter = express.Router();

const upload = multer({ storage });

authorRouter.post("/", adminAuth, upload.single("image"), createAuthor);
authorRouter.get("/", getAuthors);
authorRouter.get("/:id", getAuthorById);
authorRouter.put("/:id", adminAuth, upload.single("image"), updateAuthor);
authorRouter.delete("/:id", adminAuth, deleteAuthor);

export default authorRouter;
