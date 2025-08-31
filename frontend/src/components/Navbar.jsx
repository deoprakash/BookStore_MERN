import React, { useEffect, useState } from 'react'
import {navbarStyles} from '../assets/dummystyles'
import { Link, useLocation } from 'react-router-dom'
import logo from "../assets/vp_logo.png"
import {navItems} from '../assets/dummydata'
import { FaOpencart } from 'react-icons/fa'
import { Menu, User, X } from 'lucide-react'
import { useCart } from '../CartContext/CartContext'

const Navbar = () => {

    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation()

    const { cart } = useCart()

    const totalQuantity = cart.items.reduce((total, item) => total+ item.quanitity, 0)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.screenY > 10)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

  return (
    <nav className={navbarStyles.nav(scrolled)}>
        <div className={navbarStyles.container}>
            <div className='flex items-center justify-between'>
                {/* Logo */}

                <Link to="/" className={navbarStyles.logoContainer}>
                    <div className="relative group">

                        <div className="ml-4">
                            <div className="relative flex items-center">
                                <img src={logo} alt="Logo" className={navbarStyles.logoImage} />

                                {/* Wrap text + underline in a separate container with margin-left */}
                                <div className="relative ml-3"> 
                                <h1 className={navbarStyles.logoText}>VEDIC PUBLICATION</h1>
                                <div className={navbarStyles.logoUnderline} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
                {/* Desktop navigation */}
                <div className={navbarStyles.desktopNavWrapper}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link key={item.name} to={item.path} className={navbarStyles.navLink}>
                                <div className='relative z-10 flex items-center'>
                                    <div className='relative'>
                                        <div className={navbarStyles.navIconWrapper(item.color)} />
                                        <item.icon className={navbarStyles.navIcon(isActive)} />
                                    </div>
                                    
                                    <span className={navbarStyles.navText(isActive, item.color)}>
                                        {item.name}
                                    </span>
                                    {isActive && <span className={navbarStyles.navUnderline(item.color)} />}
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {/* Right Icons */}
                <div className='mr-7'>
                    <div className={navbarStyles.rightIconsWrapper}>
                        <Link to='/cart' className={navbarStyles.cartWrapper}>
                        <div className={navbarStyles.cartGradient} />
                        <div className='relative'>
                            <FaOpencart className={navbarStyles.cartIcon} />
                            {totalQuantity > 0 && (
                                <span className={navbarStyles.cartBadge}>
                                    {totalQuantity}
                                </span>
                            )}
                        </div>
                        </Link>
                        <Link to='/login' className={navbarStyles.loginWrapper}>
                                <div className={navbarStyles.logoGradient} />
                                <div className='relative'>
                                    <User className={navbarStyles.loginIcon} />
                                </div>
                        </Link>
                    </div>

                    {/* MOBILE MENU */}
                    <div className='md:hidden flex items-center'>
                        <button onClick={() => setIsOpen(!isOpen)}className={navbarStyles.menuBtn}>
                            <div className={navbarStyles.menuGradient} />
                            <div className='relative'>
                                {isOpen ? <X className={navbarStyles.menuIcon}/> : <Menu className={navbarStyles.menuIcon }/>}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
       </div>

       {/* MENU MOBILE NAVIGATION */}
       {isOpen && (
        <div className={navbarStyles.mobileMenu}>
            <div className={navbarStyles.mobileContainer}>
                <div className= 'flex flex-col space-y-1'>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link key={item.name} to = {item.path}
                            onClick={()=> setIsOpen(False)}
                            className={navbarStyles.mobileNavItem(isActive, item.color)}>
                                <item.icon className={navbarStyles.mobileNavIcon(isActive, item.color)} />
                                <span className={navbarStyles.mobileNavText(isActive, item.color)}>
                                    {item.name}
                                </span>
                            </Link>
                        ) 
                    })}

                    <div className={navbarStyles.mobileIconRow}>
                        <Link to='/cart' className='relative group p-2'
                        onClick={() => setIsOpen(fasle)}>
                            <FaOpencart className=' h-5 w-5 text-gray-600 group-hover:text-amber-600' />
                            {totalQuantity > 0 && (
                                <span className={navbarStyles.mobileCartBadge}>
                                    {totalQuantity}
                                </span>
                            )}
                        </Link>

                        <Link to='login' className=' p-2 group' onClick={()=>setIsOpen(false)}>

                        <User className='  h-5 w-5 text-gray-600 group-hover:text-amber-600' />
                            
                        </Link>
                    </div>

                </div>
            </div>
        </div>
       )}

    </nav>
  )
}

export default Navbar