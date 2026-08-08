import mongoose from "mongoose";


const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    rating: {
        type: Number,
        default: 0,
        min: 1,
        max: 5
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stockStatus: {
        type: String,
        enum: ['In Stock', 'Out of Stock', 'Coming Soon'],
        default: 'In Stock'
    }
}, {
    timestamps: true
});

const Book = mongoose.model('Book', bookSchema);
export default Book;