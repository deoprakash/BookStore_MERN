import React, { useEffect, useState } from "react";
import { styles } from "../assets/dummyStyles";
import { Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL ? (import.meta.env.VITE_BACKEND_URL.startsWith('http') ? import.meta.env.VITE_BACKEND_URL : `https://${import.meta.env.VITE_BACKEND_URL}`) : 'http://localhost:4000';

const ListAuthors = () => {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await axios.get(`${API_BASE}/api/author`);
        setAuthors(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch authors.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const tableHeaders = [
    { key: "name", label: "Author" },
    { key: "contact", label: "Contact" },
    { key: null, label: "Actions" },
  ];

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this author?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE}/api/author/${id}`);
      setAuthors((prev) => prev.filter((author) => author._id !== id));
    } catch (err) {
      alert("Failed to delete author.");
    }
  };

  return (
    <div className={styles.listBooksPage}>
      <div className={styles.listBooksHeader}>
        <h1 className={styles.listBooksTitle}>Manage Authors</h1>
        <p className={styles.listBooksSubtitle}>
          View and Manage your author directory.
        </p>
      </div>

      {loading && <p>Loading authors...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className={styles.booksTableContainer}>
        <div className="overflow-x-auto">
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                {tableHeaders.map((header) => (
                  <th key={header.label} className={styles.tableHeader}>
                    <div className={styles.tableHeaderContent}>
                      {header.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {authors.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No authors found.
                  </td>
                </tr>
              ) : (
                authors.map((author) => (
                  <tr key={author._id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className="flex items-center">
                        {author.image ? (
                          <img
                            src={(author.image.startsWith('http') ? author.image : `${API_BASE}${ author.image.startsWith('/') ? '' : '/' }${author.image}`)}
                            alt={author.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {author.name.charAt(0)}
                          </div>
                        )}

                        <div className="ml-4">
                          <div className={styles.bookTitle}>{author.name}</div>
                        </div>
                      </div>
                    </td>

                    <td className={styles.tableCell}>{author.contact}</td>

                    <td className={`${styles.tableCell} flex gap-3`}>
                        <button
                          onClick={() => navigate(`/edit-author/${author._id}`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(author._id)}
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

export default ListAuthors;
