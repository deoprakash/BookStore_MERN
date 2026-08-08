import React, { useRef, useEffect, useState } from 'react'
import { ourBestSellersStyles as styles, getStockBadgeStyle } from '../assets/dummystyles'
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Star } from 'lucide-react'
import { bgColors } from '../assets/dummydata'
import { useCart } from '../CartContext/CartContext'

const API_BASE = import.meta.env.VITE_BACKEND_URL ? (import.meta.env.VITE_BACKEND_URL.startsWith('http') ? import.meta.env.VITE_BACKEND_URL : `https://${import.meta.env.VITE_BACKEND_URL}`) : 'http://localhost:4000';

const BestSeller = () => {
  const scrollRef = useRef(null)
  const { cart, dispatch } = useCart()
  const [books, setBooks] = useState([])
  const [isDown, setIsDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftPos, setScrollLeftPos] = useState(0)

  useEffect(() => {
    fetch(`${API_BASE}/api/book`)
      .then(res => res.json())
      .then(data => {
        const topRated = [...data]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 6)
          .map(book => ({
            ...book,
            id: book._id,
            image: book.image ? (book.image.startsWith('http') ? book.image : `${API_BASE}${ book.image.startsWith('/') ? '' : '/' }${book.image}`) : null,
          }))
        setBooks(topRated)
      })
      .catch(err => console.error('Failed to fetch bestsellers', err))
  }, [])

  const inCart = (id) => cart?.items?.some(item => item.id === id)
  const getQty = (id) => cart?.items?.find(item => item.id === id)?.quantity || 0

  const handleAdd = (book) => dispatch({ type: "ADD_ITEM", payload: { ...book, quantity: 1 } })
  const handleInc = (id) => dispatch({ type: "INCREMENT", payload: { id } })
  const handleDec = (id) => dispatch({ type: "DECREMENT", payload: { id } })

  const handleMouseDown = (e) => {
    setIsDown(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeftPos(scrollRef.current.scrollLeft)
  }
  const handleMouseLeave = () => setIsDown(false)
  const handleMouseUp = () => setIsDown(false)
  const handleMouseMove = (e) => {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeftPos - walk
  }

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" })
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" })

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>
              <span className={styles.gradientText}>Curated Excellence</span>
            </h1>
            <p className={styles.subtitle}>Top Rated by Our Readers</p>
          </div>
        </div>

        <div className="relative group">
          <button 
            onClick={scrollLeft}
            className="absolute -left-2 md:-left-6 top-[calc(50%-1rem)] -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:scale-110 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center text-[#1A237E]"
          >
            <ChevronLeft size={24} />
          </button>

          <div 
            className={`${styles.scrollContainer} ${isDown ? 'cursor-grabbing select-none' : 'cursor-grab'}`} 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {books.map((book, index) => (
              <div className={styles.card(bgColors[index % bgColors.length])} key={book.id}>
                <div className={styles.cardInner}>
                  <div className='space-y-3 md:space-y-4'>
                    <div className={styles.stars}>
                      {[...Array(Math.floor(book.rating || 0))].map((_, i) => (
                        <Star className='h-4 w-4 md:h-5 md:w-5 text-amber-400 fill-amber-400' key={i} />
                      ))}
                    </div>

                    <div className={styles.bookInfo}>
                      <h2 className={styles.bookTitle}>{book.title}</h2>
                      <p className={styles.bookAuthor}>{book.author}</p>
                    </div>

                    <p className={styles.bookDesc}>
                      {book.description?.slice(0, 100)}{book.description?.length > 100 ? '...' : ''}
                    </p>
                  </div>

                  <div className={styles.cartControls}>
                    <div className={styles.priceQtyWrapper}>
                      <span className={styles.price}>₹{book.price.toFixed(2)}</span>

                      {book.stockStatus === 'Out of Stock' || book.stockStatus === 'Coming Soon' ? (
                        <button disabled className={`${styles.addButton} opacity-50 cursor-not-allowed bg-gray-300 text-gray-600 border-gray-300`}>
                          <span>{book.stockStatus === 'Out of Stock' ? 'Out of Stock' : 'Coming Soon'}</span>
                        </button>
                      ) : inCart(book.id) ? (
                        <div className={styles.qtyWrapper}>
                          <button onClick={() => handleDec(book.id)} className={styles.qtyBtn}>
                            <Minus size={18} />
                          </button>
                          <span className={styles.qtyText}>{getQty(book.id)}</span>
                          <button onClick={() => handleInc(book.id)} className={styles.qtyBtn}>
                            <Plus size={18} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleAdd(book)} className={styles.addButton}>
                          <ShoppingCart className='h-4 w-4 md:h-5 md:w-5' />
                          <span>Add to Collection</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {book.image && (
                  <div className="relative">
                    {book.stockStatus && (
                      <div className={getStockBadgeStyle(book.stockStatus)}>
                        {book.stockStatus}
                      </div>
                    )}
                    <img src={book.image} alt={book.title} className={styles.bookImage} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button 
            onClick={scrollRight}
            className="absolute -right-2 md:-right-6 top-[calc(50%-1rem)] -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:scale-110 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center text-[#1A237E]"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default BestSeller
