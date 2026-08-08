import React, { useEffect, useState } from 'react'
import { homeBooksStyles as styles, getStockBadgeStyle } from '../assets/dummystyles'
import { useCart } from '../CartContext/CartContext'
import { ArrowRight, Star, ShoppingCart, Minus, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_BACKEND_URL ? (import.meta.env.VITE_BACKEND_URL.startsWith('http') ? import.meta.env.VITE_BACKEND_URL : `https://${import.meta.env.VITE_BACKEND_URL}`) : 'http://localhost:4000';

const Homebooks = () => {
  const { cart, dispatch } = useCart()
  const [books, setBooks] = useState([])

  useEffect(() => {
    fetch(`${API_BASE}/api/book`)
      .then(res => res.json())
      .then(data => {
        const mapped = data.slice(0, 4).map(book => ({
          ...book,
          id: book._id,
          image: book.image ? (book.image.startsWith('http') ? book.image : `${API_BASE}${ book.image.startsWith('/') ? '' : '/' }${book.image}`) : null,
        }))
        setBooks(mapped)
      })
      .catch(err => console.error('Failed to fetch books', err))
  }, [])

  const inCart = (id) => cart?.items?.find(item => item.id === id)
  const handleAdd = (book) => dispatch({ type: "ADD_ITEM", payload: { ...book, quantity: 1 } })
  const handleInc = (id) => dispatch({ type: "INCREMENT", payload: { id } })
  const handleDec = (id) => dispatch({ type: "DECREMENT", payload: { id } })

  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className='text-center md-12'>
            <h2 className={styles.heading}>Bookseller Favourites</h2>
            <div className={styles.headingLine} />
          </div>

          <div className={styles.grid}>
            {books.map((book) => {
              const item = inCart(book.id)
              return (
                <div key={book.id} className={styles.bookCard}>
                  <div className={styles.imageWrapper}>
                    {book.stockStatus && (
                      <div className={getStockBadgeStyle(book.stockStatus)}>
                        {book.stockStatus}
                      </div>
                    )}
                    {book.image && (
                      <img src={book.image} alt={book.title} className={styles.image} />
                    )}
                    <div className={styles.rating}>
                      {[...Array(5)].map((_, i) => (
                        <Star className={`h-4 w-4 ${i < (book.rating || 0) ? 'text-[#43C6AC] fill-[#43C6AC]' : 'text-gray-300'}`} key={i} />
                      ))}
                    </div>
                  </div>

                  <h3 className={styles.title}>{book.title}</h3>
                  <p className={styles.author}>{book.author}</p>
                  <span className={styles.actualPrice}>₹{book.price}</span>

                  {(book.stockStatus === 'Out of Stock' || book.stockStatus === 'Coming Soon') ? (
                    <button disabled className={`${styles.addBtn} opacity-50 cursor-not-allowed bg-gray-300`}>
                      <span>{book.stockStatus}</span>
                    </button>
                  ) : item ? (
                    <div className={styles.qtyBox}>
                      <button onClick={() => handleDec(book.id)} className={styles.qtyBtn}>
                        <Minus className='h-5 w-5' />
                      </button>
                      <span className='text-gray-700'>{item.quantity}</span>
                      <button onClick={() => handleInc(book.id)} className={styles.qtyBtn}>
                        <Plus className='h-5 w-5' />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => handleAdd(book)} className={styles.addBtn}>
                      <ShoppingCart className='h-5 w-5' />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          <div className={styles.viewBtnWrapper}>
            <Link to='/books' className={styles.viewBtn}>
              <span>View All Books</span>
              <ArrowRight className={styles.viewIcon} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Homebooks
