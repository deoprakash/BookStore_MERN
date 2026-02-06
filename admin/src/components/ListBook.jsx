import React, { useEffect, useState } from 'react'
import { styles } from '../assets/dummyStyles'
import { Filter } from 'lucide-react'
import axios from 'axios'

const API_BASE = 'http://localhost:4000'

const ListBook = () => {

    const [books, setBooks] = useState([]);
    const [filterCategory, setFilterCategory] = useState('All');
    const [sortConfig, setSortConfig] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch book from server side

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            setError(null);
            try {
                const {data} = await axios.get(`${API_BASE}/api/book`);
                setBooks(data);
            }

            catch (err) {
                setError(err.response?.data?.message || "Failed to fetch books.");
            }
        } 
    })


    return (
        <div className={styles.listBooksPage}>
            <div className={styles.listBooksHeader}>
                <h1 className={styles.listBooksTitle}>
                    Manage Books Inventory
                </h1>
                <p className={styles.listBooksSubtitle}>
                    View, Edit and Manage your book collection.
                </p>
            </div>

            {/* Controls */}
            <div className={styles.controlsContainer}>
                <div className={styles.controlsInner}>
                    <div className='flex gap-3'>
                        <div className={styles.filterGroup}>
                            <div className={styles.filterGlow} />

                            <div className={styles.filterContainer}>
                            <Filter className={styles.filterIcon} />  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListBook