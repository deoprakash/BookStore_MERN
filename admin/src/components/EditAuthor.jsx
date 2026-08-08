import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
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

const EditAuthor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({type: null, text: null});

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/author/${id}`);
        setFormData({
          name: data.name || "",
          contact: data.contact || "",
          bio: data.bio || "",
          image: null,
          preview: data.image ? (data.image.startsWith('http') ? data.image : `${API_BASE}${ data.image.startsWith('/') ? '' : '/' }${data.image}`) : "",
        });
      } catch (err) {
        console.log(err);
        setMessage({ type: "error", text: "Failed to load author." });
      }
    };
    fetchAuthor();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({type: null, text: null});

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'preview' && value !== null) payload.append(key, value);
    });

    try {
      await axios.put(`${API_BASE}/api/author/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({type: 'success', text: 'Author updated successfully!'});
      setTimeout(() => navigate("/list-authors"), 1000);
    }
    catch (err) {
      console.error('EditAuthor error response:', err.response?.data, err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update author.'
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

  return (
    <div className={styles.addBooksPage}>
      <div className={styles.addBooksContainer}>
        <div className={styles.headerContainer}>
          <div>
            <h1 className={styles.headerTitle}>Edit Author</h1>
            <p className={styles.headerSubtitle}>Update the details for this author.</p>
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
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditAuthor
