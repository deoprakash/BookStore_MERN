import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../assets/dummyStyles";
import { Filter, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const ListBook = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortConfig, setSortConfig] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Books
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await axios.get(`${API_BASE}/api/book`);
        setBooks(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Categories
  const categories = useMemo(
    () => ["All", ...new Set(books.map((book) => book.category))],
    [books],
  );

  // Filter + Sort
  const displayedBooks = useMemo(() => {
    let filtered = [...books];

    if (filterCategory !== "All") {
      filtered = filtered.filter((book) => book.category === filterCategory);
    }

    switch (sortConfig) {
      case "price":
        filtered.sort((a, b) => a.price - b.price);
        break;

      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;

      default:
        break;
    }

    return filtered;
  }, [books, filterCategory, sortConfig]);

  const tableHeaders = [
    { key: null, label: "Book" },
    { key: "author", label: "Author" },
    { key: null, label: "Category" },
    { key: "price", label: "Price" },
    { key: "rating", label: "Rating" },
    { key: null, label: "Actions" },
  ];

  // Rating Stars
  const RatingStar = ({ rating }) => (
    <div className={styles.ratingContainer}>
      <div className={styles.starContainer}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={
              i < Math.floor(rating) ? styles.starfilled : styles.starEmpty
            }
          >
            ★
          </span>
        ))}
      </div>

      <span className={styles.ratingText}>{rating.toFixed(1)}</span>
    </div>
  );

  // Delete Book
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE}/api/book/${id}`);

      setBooks((prev) => prev.filter((book) => book._id !== id));
    } catch (err) {
      alert("Failed to delete book.", err);
    }
  };

  return (
    <div className={styles.listBooksPage}>
      {/* Header */}
      <div className={styles.listBooksHeader}>
        <h1 className={styles.listBooksTitle}>Manage Books Inventory</h1>

        <p className={styles.listBooksSubtitle}>
          View, Edit and Manage your book collection.
        </p>
      </div>

      {/* Controls */}
      <div className={styles.controlsContainer}>
        <div className={styles.controlsInner}>
          <div className={styles.filterGroup}>
            <div className={styles.filterGlow}></div>

            <div className={styles.filterContainer}>
              <Filter className={styles.filterIcon} />

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={styles.filterSelect}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "All" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {loading && <p>Loading books...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className={styles.booksTableContainer}>
        <div className="overflow-x-auto">
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header.label}
                    className={styles.tableHeader}
                    onClick={() =>
                      header.key &&
                      setSortConfig(sortConfig === header.key ? "" : header.key)
                    }
                  >
                    <div className={styles.tableHeaderContent}>
                      {header.label}

                      {header.key && sortConfig === header.key && (
                        <span className="ml-1">↑</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {displayedBooks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No books found.
                  </td>
                </tr>
              ) : (
                displayedBooks.map((book) => (
                  <tr key={book._id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className="flex items-center">
                        {book.image && (
                          <img
                            src={(book.image.startsWith('http') ? book.image : `${API_BASE}${ book.image.startsWith('/') ? '' : '/' }${book.image}`)}
                            alt={book.title}
                            className="h-12 w-10 rounded object-cover"
                          />
                        )}

                        <div className="ml-4">
                          <div className={styles.bookTitle}>{book.title}</div>
                        </div>
                      </div>
                    </td>

                    <td className={styles.tableCell}>{book.author}</td>

                    <td className={styles.tableCell}>
                      <span className={styles.categoryBadge}>
                        {book.category}
                      </span>
                    </td>

                    <td className={styles.tableCell}>₹{book.price}</td>

                    <td className={styles.tableCell}>
                      <RatingStar rating={book.rating} />
                    </td>

                    <td className={`${styles.tableCell} flex gap-3`}>
                    <button
                        onClick={() => navigate(`/edit-book/${book._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <Pencil size={18} />
                    </button>

                        <button
                          onClick={() => handleDelete(book._id)}
                          className={styles.deleteButton}
                        >
                          <Trash2 size={18} />
                        </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListBook;
