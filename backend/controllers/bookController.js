import Book from '../models/bookModel.js';



// CREATE BOOK FUNCTION

export const createBook = async (req, res, next) => {
    try {
        const filename = req.file?.filename ?? null;
        const imagePath = filename ? `/uploads/${filename}` : null
        const { title, author, price, rating, category, description} = req.body;

        const book = new Book({
            title, 
            author, 
            price,
            rating,
            category,
            description,
            image: imagePath
        });
        const saved = await book.save();
        res.status(201).json({saved})
    }
    catch (err) {
        next(err);
    }
}

// GET BOOKS

export const getBooks = async (req, res, next) => {
    try {
        const books = await Book.find().sort({ createdAt: -1})
        res.json(books);
    }
    catch (err){
        next(err)
    }
}

// DELETING BOOKS

export const deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.param.id);
        if (!book) 
        {
            return res.status(404).json
            ({
                message: 'Book not found.'
            })
        }
        // Image handling
        if (book.image) {
            const filePath = path.join(process.cwd(), book.image);
            fs.unlink(filePath, (err) => {
                if (err) console.warn('Failed to delete image file:', err)
            })
        }
        res.join({ message: 'Book deleted successfully.'})

    }
    catch (err) {
        nexr(err)
    }
}