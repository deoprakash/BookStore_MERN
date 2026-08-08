import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    contact: {
        type: String
    },
    bio: {
        type: String
    }
}, {
    timestamps: true
});

const Author = mongoose.model('Author', authorSchema);
export default Author;
