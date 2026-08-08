import React, { useEffect, useState, useRef } from 'react'
import { ShoppingBag, Plus, Minus, Star, Search, ChevronDown, Check } from "lucide-react"
import { useLocation } from "react-router-dom"
import { booksPageStyles as styles, getStockBadgeStyle } from '../assets/dummystyles'
import { useCart } from '../CartContext/CartContext'

const API_BASE = import.meta.env.VITE_BACKEND_URL ? (import.meta.env.VITE_BACKEND_URL.startsWith('http') ? import.meta.env.VITE_BACKEND_URL : `https://${import.meta.env.VITE_BACKEND_URL}`) : 'http://localhost:4000';

const CustomSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="relative w-full md:w-56 z-20" ref={selectRef}>
      <div 
        className="flex items-center justify-between w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-md cursor-pointer text-gray-700 hover:bg-white transition-all focus:ring-2 focus:ring-[#43C6AC]/30 text-sm md:text-base"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate pr-4">{selectedOption?.label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-gray-200">
            {options.map((option) => (
              <div
                key={option.value}
                className={`flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm md:text-base transition-colors ${value === option.value ? 'bg-[#43C6AC]/10 text-[#43C6AC] font-medium' : 'text-gray-700 hover:bg-gray-50 hover:text-[#43C6AC]'}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span className="truncate">{option.label}</span>
                {value === option.value && <Check className="w-4 h-4 text-[#43C6AC]" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Books = () => {
  const { cart, dispatch } = useCart()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const searchFromURL = queryParams.get("search") || ""

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchFromURL)
  const [sortBy, setSortBy] = useState('title')
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/book`)
        const data = await res.json()
        const mapped = data.map(book => ({
          ...book,
          id: book._id,
          image: book.image ? (book.image.startsWith('http') ? book.image : `${API_BASE}${ book.image.startsWith('/') ? '' : '/' }${book.image}`) : null,
        }))
        setBooks(mapped)
      } catch (err) {
        console.error('Failed to fetch books', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  const isInCart = (id) => cart?.items?.some(item => item.id === id && item.source === "booksPage")
  const getCartQuantity = (id) => cart?.items?.find(item => item.id === id && item.source === "booksPage")?.quantity || 0

  const handleAddToCart = (book) =>
    dispatch({ type: "ADD_ITEM", payload: { ...book, quantity: 1, source: "booksPage" } })
  const handleIncrement = (id) => dispatch({ type: "INCREMENT", payload: { id, source: "booksPage" } })
  const handleDecrement = (id) => dispatch({ type: "DECREMENT", payload: { id, source: "booksPage" } })

  const filteredBooks = books.filter(book => {
    const matchCategory = filterCategory === 'all' || book.category === filterCategory
    const lowerSearch = searchTerm.toLowerCase()
    const matchSearch = !searchTerm ||
      book.title.toLowerCase().includes(lowerSearch) ||
      book.author.toLowerCase().includes(lowerSearch)
    return matchCategory && matchSearch
  })

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price
      case "price-high": return b.price - a.price
      case "rating": return (b.rating || 0) - (a.rating || 0)
      default: return a.title.localeCompare(b.title, undefined, { sensitivity: 'base', numeric: true })
    }
  })

  const categories = ["all", ...new Set(books.map(book => book.category).filter(Boolean))]

  if (loading) {
    return (
      <div className={styles.container}>
        <p className="text-center text-gray-500 py-20">Loading books...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.headerWrapper}>
          <h1 className={styles.headerTitle}>Literary Universe</h1>
          <p className={styles.headerSubtitle}>Explore our curated collection spanning genres and perspectives.</p>
        </div>

        <div className={styles.searchWrapper}>
          <div className={styles.searchInputWrapper}>
            <div className={styles.searchIconWrapper}>
              <Search className='h-5 w-5 md:h-6 md:w-6 text-gray-400 group-focus-within:text-[#43C6Ac]' />
            </div>
            <input type="text" placeholder='Search titles, authors...'
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput} />
          </div>

          <div className={styles.filterRow}>
            <div className={styles.selectGroup}>
              <CustomSelect 
                value={filterCategory} 
                onChange={setFilterCategory}
                options={categories.map(cat => ({ value: cat, label: cat === "all" ? "All Genres" : cat }))}
              />
              <CustomSelect 
                value={sortBy} 
                onChange={setSortBy}
                options={[
                  { value: "title", label: "Sort by Title" },
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" },
                  { value: "rating", label: "Top Rated" }
                ]}
              />
            </div>
            <div className={styles.resultText}>
              Showing {sortedBooks.length} results
            </div>
          </div>
        </div>

        {sortedBooks.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No books found. Check back soon for new releases!</p>
        ) : (
          <div className={styles.booksGrid}>
            {sortedBooks.map(book => {
              const inCart = isInCart(book.id)
              const qty = getCartQuantity(book.id)

              return (
                <div key={book.id} className={styles.bookCard}>
                  <div className={styles.imageWrapper}>
                    {book.stockStatus && (
                      <div className={getStockBadgeStyle(book.stockStatus)}>
                        {book.stockStatus}
                      </div>
                    )}
                    {book.image ? (
                      <img src={book.image} alt={book.title} className={styles.imageStyle} />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">No cover</div>
                    )}
                  </div>

                  <h3 className={styles.title}>{book.title}</h3>
                  <p className={styles.author}>By {book.author}</p>

                  <div className={styles.ratingWrapper}>
                    {[...Array(Number.isFinite(book.rating) ? Math.floor(book.rating) : 0)].map((_, index) => (
                      <Star className='w-4 h-4 fill-yellow-400 stroke-yellow-400' key={index} />
                    ))}
                    <span>({Number.isFinite(book.rating) ? book.rating.toFixed(1) : 'N/A'})</span>
                  </div>

                  <p className={styles.description}>{book.description}</p>

                  <div className={styles.priceCartWrapper}>
                    <span className={styles.price}>₹{book.price.toFixed(2)}</span>
                    <div className={styles.cartButtons}>
                      {book.stockStatus === 'Out of Stock' || book.stockStatus === 'Coming Soon' ? (
                        <button disabled className={`${styles.addButton} opacity-50 cursor-not-allowed px-4 py-2 bg-gray-300 text-gray-600 rounded-lg flex items-center gap-2`}>
                          <span>{book.stockStatus === 'Out of Stock' ? 'Out of Stock' : 'Coming Soon'}</span>
                        </button>
                      ) : !inCart ? (
                        <button onClick={() => handleAddToCart(book)}>
                          <ShoppingBag className='w-5 h-5 text-white' />
                        </button>
                      ) : (
                        <div className='flex items-center gap-1'>
                          <button onClick={() => handleDecrement(book.id)}>
                            <Minus className='w-4 h-4 text-white' />
                          </button>
                          <span>{qty}</span>
                          <button onClick={() => handleIncrement(book.id)}>
                            <Plus className='w-4 h-4 text-white' />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Books
