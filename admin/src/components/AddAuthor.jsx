import React, { useState } from 'react'
import { styles } from '../assets/dummyStyles'
import axios from 'axios'
import { UserPlus } from 'lucide-react';

const initialFormData = {
  name: "",
  contact: "",
  bio: "",
  image: null,
  preview: ""
};

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const AddAuthor = () => {

  const [formData, setFormData] = useState(initialFormData);
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
      await axios.post(`${API_BASE}/api/author`, payload);
      setMessage({type: 'success', text: 'Author added successfully!'});
      setFormData(initialFormData);
    }
    catch (err) {
      console.error('AddAuthor error response:', err.response?.data, err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to add author.'
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(!file) return;

    setFormData (prev => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file)
    }))  
  }

  const handleReset = () => {
    setFormData(initialFormData);
    setMessage({ type: null, text: null });
  
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className={styles.addBooksPage}>
      <div className={styles.addBooksContainer}>
        <div className={styles.headerContainer}>
          <div>
            <h1 className={styles.headerTitle}>Add new Author</h1>
            <p className={styles.headerSubtitle}>Fill in the details to add a new author to your directory.</p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGrid}>
            <div className={styles.formItem}>
              <label className={styles.formLabel}>Author Name</label>
              <input name="name" value={formData.name} onChange={handleChange} className={styles.formInput}
              placeholder='Enter author name' required />
            </div>

            <div className={styles.formItem}>
              <label className={styles.formLabel}>Contact Information</label>
              <input name="contact" value={formData.contact} onChange={handleChange} className={styles.formInput}
              placeholder='Enter contact email or phone' required />
            </div>

            <div className={`${styles.formItem} md:col-span-2`}>
              <label className={styles.formLabel}>Author Bio</label>
              <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className={styles.formTextarea}
              placeholder='Enter author biography'></textarea>
            </div>

            <div className={`${styles.formItem} md:col-span-2`}>
              <label className={styles.formLabel}>Author Image</label>
              <input type='file'
                name="image"
                accept='image/*'
                onChange={handleImageChange}
                className={styles.formInput} />
            </div>
          </div>

          {formData.preview && (
            <div className={styles.previewContainer}>
              <h3 className={styles.previewTitle}>Image preview</h3>
              <img src={formData.preview} alt="Image"
              className={styles.previewImg} style={{ objectFit: 'cover', borderRadius: '50%', width: '150px', height: '150px' }} />
            </div>
          )}

          {message.text && (
            <p className={`text-${message.type === 'success' ? 'green' : 'red'}-500 mt-4`}>{message.text}</p>
          )} 
          
          <div className={`${styles.submitContainer} flex gap-4 mt-6`}>
            <button
              disabled={loading}
              type="submit"
              className={styles.submitButton}
            >
              <UserPlus className="w-5 h-5" />
              <span>{loading ? "Adding..." : "Add Author"}</span>
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

export default AddAuthor
