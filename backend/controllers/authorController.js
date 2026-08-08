import Author from '../models/AuthorModel.js';
import path from 'path';
import fs from 'fs';

// CREATE AUTHOR
export const createAuthor = async (req, res, next) => {
    try {
        const imagePath = req.file?.path || null;
        const { name, contact, bio } = req.body;

        const author = new Author({
            name,
            contact,
            bio,
            image: imagePath
        });
        const saved = await author.save();
        res.status(201).json({ saved });
    }
    catch (err) {
        next(err);
    }
}

import Book from '../models/bookModel.js';

// GET AUTHORS
export const getAuthors = async (req, res, next) => {
    try {
        const authors = await Author.find().sort({ createdAt: -1 });
        const books = await Book.find();

        const authorsWithBooks = authors.map(author => {
            const authorBooks = books.filter(b => b.author.toLowerCase() === author.name.toLowerCase());
            return {
                ...author.toObject(),
                bookList: authorBooks
            };
        });

        res.json(authorsWithBooks);
    }
    catch (err){
        next(err);
    }
}

// GET AUTHOR BY ID
export const getAuthorById = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);

        if (!author) {
            return res.status(404).json({
                message: "Author not found",
            });
        }

        const books = await Book.find();
        const authorBooks = books.filter(b => b.author.toLowerCase() === author.name.toLowerCase());

        res.status(200).json({
            ...author.toObject(),
            bookList: authorBooks
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// UPDATE AUTHOR
export const updateAuthor = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);

        if (!author) {
            return res.status(404).json({
                message: "Author not found",
            });
        }

        author.name = req.body.name || author.name;
        author.contact = req.body.contact !== undefined ? req.body.contact : author.contact;
        author.bio = req.body.bio !== undefined ? req.body.bio : author.bio;

        if (req.file) {
            author.image = req.file.path;
        }

        await author.save();

        res.status(200).json(author);

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// DELETE AUTHOR
export const deleteAuthor = async (req, res, next) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found.' });
        }
        
        // Local image deletion bypassed for Cloudinary
        res.json({ message: 'Author deleted successfully.' });

    } catch (err) {
        next(err);
    }
}
