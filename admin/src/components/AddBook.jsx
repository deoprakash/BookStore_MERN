import React, {useState} from 'react'
import { styles } from '../assets/dummyStyles'
import axios from 'axios'
import { Star } from 'lucide-react';


const initialFormData = {
  title:"",
  author: "",
  price: "",
  image: null,
  rating: 4,
  category: "Fiction",
  description: "",
  preview: "",
};


const categories = [
  "Fiction", "Non Fiction", "Mystery", "Sci-Fi", 
  "Biography", "Self-Help", "Thriller"
];


  const API_BASE = 'http://localhost:4000'

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
    image: File,
    preview: URL.createObjectURL(file)
    }))  
  }

  //STARS RATING HANDLER
  const handleStarClick = (rating) => {
    setFormData(prev => ({...prev, rating}))
  }


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

            <div>
              
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBook