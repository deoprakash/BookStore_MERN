import React, { useEffect, useState } from 'react'
import { styles } from '../assets/dummyStyles.js';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/BookLogo.png'
import { BookPlus, BookOpen, ShoppingCart, Users, ChevronRight, ChevronLeft, UserPlus, UserCircle, LogOut } from 'lucide-react';

const SideBar = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();

    //UseEffect Hook for Screen Size
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768); 
        }
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize)
    }, []);


    const navItems = [
        {path: '/', icon: BookPlus, label: 'Add Books' },
        {path:'/list-books',  icon: BookOpen, label: 'List Books'},
        {path: '/orders', icon: ShoppingCart, label: 'Orders'},
        {path: '/team', icon: Users, label: 'Team'},
        {path: '/add-author', icon: UserPlus, label: 'Add Author'},
        {path: '/list-authors', icon: UserCircle, label: 'List Authors'},
    ];

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed)
    }

    //Mobile View Navigation
    if(isMobile) {
        return (
            <div className={styles.mobileNav.container}>
                <nav className={styles.mobileNav.nav}>
                    {navItems.map(({path, icon: Icon, label}) => {
                        const isActive = location.pathname === path;

                        return (
                            <Link key={path} to={path} className= {styles.mobileNav.item}>
                                <div className={styles.mobileNav.iconContainer(isActive)}>
                                    <Icon className= ' h-5 w-5 mx-auto'/>
                                </div>
                                <span className={styles.mobileNav.label(isActive)}>{label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        )
    }

    //DESKTOP NAVIGATION

    return (
        <div className={styles.sidebar.container(isCollapsed)}>
            <div className={styles.sidebar.header}>
                {!isCollapsed && (
                    <div className={styles.sidebar.logoContainer}>
                        <div className={styles.sidebar.logoImageContainer}>
                            <img src={logo} alt="Logo" className={styles.sidebar.logoImage}/>
                        </div>
                        <div>
                            <h1 className={styles.sidebar.title}>BookHub</h1>
                        </div>
                    </div>  
                )}

                <button onClick={toggleCollapse} className={styles.sidebar.collapseButton}>
                    {isCollapsed ? (
                        <ChevronRight className=' h-5 w-5' />
                    ): (
                        <ChevronLeft className=' h-5 w-5' />
                    )}
                </button>
            </div>

            <nav className={styles.sidebar.nav}>
                {navItems.map(({ path, icon: Icon, label }) => {
                    const isActive = location.pathname === path;

                    return (
                        <Link key={path} to={path} className={styles.sidebar.navItem(isCollapsed, isActive)}>
                            <div className={styles.sidebar.navItemInner}>
                                <div className={styles.sidebar.iconContainer(isActive)}>
                                    <Icon className= " h-5 w-5"/>
                                </div>
                                {!isCollapsed && (
                                    <span className={styles.sidebar.navLabel(isActive)}>
                                        {label}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.sidebar.divider} />
            
            <div className={styles.sidebar.footer(isCollapsed)}>
                <button 
                    onClick={() => { localStorage.removeItem('adminToken'); window.location.reload(); }}
                    className={`flex items-center w-full gap-3 p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <LogOut className="w-5 h-5" />
                    {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
                </button>
                {!isCollapsed && (
                    <p className={`${styles.sidebar.footerText} mt-4`}>
                        &copy; 2026 BookHub
                    </p>
                )}

            </div>
        </div>
    )}

export default SideBar;
