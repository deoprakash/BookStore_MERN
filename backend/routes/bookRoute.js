import express from 'express'
import multer from 'multer'
import { createBook } from '../controllers/bookController';


const bookRouter = express.Router()
// Multer setup
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, 'uploads/'),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const uplaod = multer({ storage });

bookRouter.post('/', uplaod.single('image'), createBook);
bookRouter.get('/', getBooks);
bookRouter.delete('/:id', deleteBook);

export default bookRouter;
