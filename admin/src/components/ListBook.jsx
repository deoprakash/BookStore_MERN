import React, { useEffect, useState } from 'react'
import { styles } from '../assets/dummyStyles'
import { Filter } from 'lucide-react'
import axios from 'axios'
import { useMemo } from 'react'

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
            finally {
                setLoading(false);
            }
        } 
        fetchBooks();
    }, []);

    // FETCH CATEGORY FROM THE BOOKS
    const categories = useMemo(
        () => ["All", ...new Set(books.map((book) => book.category))],
        [books]
    );

    //Compute filtered and sorted list
    const displayedBooks = useMemo(() => {
        let filtered = books;
        if (filterCategory !== "All") {
            filtered = filtered.filter((book) => book.category === filterCategory);
        }

        if (sortConfig === "priceLowToHigh") {
            filtered = [...filtered].sort((a, b) => a.price - b.price);
        }else if (sortConfig === "topRated") {
            filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        }

        return filtered;
    }, [books, filterCategory, sortConfig]);

    const tableHeaders = [
        {key: null, label: "Book"},
        {key:"author", label: "Author"},
        {key:null, label: "Category"},
        {key:"price", label: "Price"},
        {key:"rating", label: "Rating"},
        {key:null, label: "Actions"},
    ];

    //STAR RATING
    const RatingStar = ({ rating }) => (
        <div className={styles.ratingContainer}>
            <div className={styles.starContainer}>
                {[...Array(5)].map((_, i) =>(
                    <span key={i} className={` h-4 w-4  ${
                    i < Math.floor(rating) ?  styles.starfilled : styles.starEmpty}`}>★</span>
                ))}
            </div>
            <span className={styles.ratingText}>{rating.toFixed(2)}</span>
        </div>
    )


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
                            <select value={filterCategory} onChange={(e) =>setFilterCategory(e.target.value)}
                                className={styles.filterSelect}>
                                {categories.map((category) =>(
                                    <option value={category} key={category}>
                                        {(category = "All" ? "All Categories" : category)}
                                    </option>
                                ))} 
                            </select>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FEEDBACK */}
            {loading && <p> Loading books....</p>}
            {error && <p className=' text-red-500'>{error}</p>}

            {/* TABLE */}
            <div className={styles.booksTableContainer}>
                <div className=' overflow-x-auto'>
                    <table className={styles.table}>
                        <thead className={styles.tableHead}>
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header.label}
                                    className={styles.tableHeader}
                                    onClick={() => header.key &&
                                        setSortConfig(
                                            sortConfig === header.key ? '' : header.key)
                                    }>
                                        <div className={styles.tableHeaderContent}>
                                            {header.label}
                                            {header.key && sortConfig === header.key && (
                                                <span className=' ml-1'>↑</span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListBook