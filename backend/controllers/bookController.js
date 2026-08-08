import Book from '../models/bookModel.js';
import path from 'path'
import fs from 'fs'



// CREATE BOOK FUNCTION

export const createBook = async (req, res, next) => {
    try {
        const imagePath = req.file?.path || null;
        const { title, author, price, rating, category, description, stockStatus} = req.body;

        const book = new Book({
            title, 
            author, 
            price,
            rating,
            category,
            description,
            stockStatus: stockStatus || 'In Stock',
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

//get book by id

export const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        res.status(200).json(book);

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

//UPDATE BOOKS

export const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        book.title = req.body.title;
        book.author = req.body.author;
        book.price = req.body.price;
        book.rating = req.body.rating;
        book.category = req.body.category;
        book.description = req.body.description;
        if (req.body.stockStatus) {
            book.stockStatus = req.body.stockStatus;
        }

        // Update image only if a new one is uploaded
        if (req.file) {
            book.image = req.file.path;
        }

        await book.save();

        res.status(200).json(book);

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};


// DELETING BOOKS

export const deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found.' });
        }
        // Local image deletion is bypassed since Cloudinary handles it
        // To delete from Cloudinary, we'd need to extract public_id and use cloudinary.uploader.destroy()
        res.json({ message: 'Book deleted successfully.' })

    } catch (err) {
        next(err)
    }
}