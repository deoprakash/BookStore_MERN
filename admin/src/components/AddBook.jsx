import React, {useState} from 'react'
import { styles } from '../assets/dummyStyles'
import axios from 'axios'
import { BookPlus, Star } from 'lucide-react';


const initialFormData = {
  title:"",
  author: "",
  price: "",
  image: null,
  rating: 4,
  category: "Fiction",
  description: "",
  preview: "",
  stockStatus: "In Stock"
};


const categories = [
  "Fiction", "Non Fiction", "Mystery", "Sci-Fi", 
  "Biography", "Self-Help", "Thriller"
];

const stockStatuses = ["In Stock", "Out of Stock", "Coming Soon"];


  const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const AddBook = () => {

  const [formData, setFormData] =  useState(initialFormData);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({type: null, text: null});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({type: null, text: null});

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'preview' && value !== null) payload.append(key, value);
    });

    try {
      await axios.post(`${API_BASE}/api/book`, payload);
      setMessage({type: 'success', text: 'Book added successfully!'});
      setFormData(initialFormData);
    }
    catch (err) {
      console.error('AddBooks error response:', err.response?.data, err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to add book.'
      });
    }
    finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  }

  //Image handling

  const handleImageChange = (e) => {

    const file = e.target.files[0];
    if(!file) return;

    setFormData (prev => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file)
    }))  
  }

  //STARS RATING HANDLER
  const handleStarClick = (rating) => {
    setFormData(prev => ({...prev, rating}))
  }

  const handleReset = () => {
    setFormData(initialFormData);
    setHoverRating(0);
    setMessage({ type: null, text: null });
  
    // Clear the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };


  return (
    <div className={styles.addBooksPage}>
      <div className={styles.addBooksContainer}>
        <div className={styles.headerContainer}>
          <div>
            <h1 className={styles.headerTitle}>Add new Book</h1>
            <p className={styles.headerSubtitle}> Fill in the details to add a new book to your store.</p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGrid}>
            <div className={styles.formItem}>
              <label className={styles.formLabel}>Book Title</label>
              <input name="title" value={formData.title} onChange={handleChange} className={styles.formInput}
              placeholder='Enter book title' required />
            </div>

            <div className={styles.formItem}>
              <label className={styles.formLabel}>Author</label>
              <input name="author" value={formData.author} onChange={handleChange} className={styles.formInput}
              placeholder='Enter author title' required />
            </div>

            <div className={styles.formItem}>
              <label className={styles.formLabel}>Price (₹)</label>
              <input name="price" value={formData.price} onChange={handleChange} className={styles.formInput}
              placeholder='Enter price' required />
            </div>

            <div className={styles.formItem}>
              <label className={styles.formLabel}>Rating</label>
              <div className={styles.ratingContainer}>
                <div className={styles.starContainer}>
                  {[1, 2, 3, 4, 5].map(starValue => (
                    <button key={starValue} type='button'
                    onClick={() => handleStarClick(starValue)} 
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                      aria-label={`Rate ${starValue} star${starValue !== 1 ? 's': ''}`}>
                      <Star className={` w-5 h-5 ${
                      (hoverRating || formData.rating) >= starValue
                      ? styles.starFilled
                    : styles.starEmpty}`} />
                    </button>
                  ))}
                </div>
                <p className={styles.ratingText}>
                  {formData.rating} Star{formData.rating !== 1 ? 's' : ""}
                </p>
              </div>
            </div>

            <div className={styles.formItem}>
                <label className={styles.formLabel}>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className={styles.formInput}>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
            </div>

            <div className={styles.formItem}>
                <label className={styles.formLabel}>Stock Status</label>
                <select name="stockStatus" value={formData.stockStatus} onChange={handleChange} className={styles.formInput}>
                  {stockStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
            </div>

            <div className={styles.formItem}>
              <label className={styles.formLabel}>Cover Image</label>
              <input type='file'
                name="image"
                accept='image/*'
                onChange={handleImageChange}
                className={styles.formInput} />
            </div>

            <div className={`${styles.formItem} md:col-span-2`}>
              <label className={styles.formLabel}>Description</label>
              <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={styles.formTextarea}
              placeholder='Enter Book Description'></textarea>
            </div>
          </div>

          {formData.preview && (
            <div className={styles.previewContainer}>
              <h3 className={styles.previewTitle}>Cover preview</h3>
              <img src={formData.preview} alt="Image"
              className={styles.previewImg} />
            </div>
          )}

          {message.text && (
            <p className={`text-${message.type === 'success' ? 'green' : 'red'}-500`}>{message.text}</p>
          )} 
          
          <div className={`${styles.submitContainer} flex gap-4`}>
            <button
              disabled={loading}
              type="submit"
              className={styles.submitButton}
            >
              <BookPlus className="w-5 h-5" />
              <span>{loading ? "Adding..." : "Add Book to Collection"}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBook