import express from "express";
import multer from "multer";
import {
    createBook,
    getBooks,
    deleteBook,
    getBookById,
    updateBook,
} from "../controllers/bookController.js";
import adminAuth from "../middleware/adminAuth.js";
import { storage } from "../config/cloudinary.js";

const bookRouter = express.Router();

const upload = multer({ storage });

bookRouter.post("/", adminAuth, upload.single("image"), createBook);

bookRouter.get("/", getBooks);

bookRouter.get("/:id", getBookById);

bookRouter.put("/:id", adminAuth, upload.single("image"), updateBook);

bookRouter.delete("/:id", adminAuth, deleteBook);

export default bookRouter;