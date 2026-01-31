import React, { useEffect, useState } from 'react'
import { styles } from '../assets/dummyStyles.js';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/vp_logo.png'
import { BookPlus, BookOpen, ShoppingCart, ChevronRight, ChevronLeft } from 'lucide-react';

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
                            <h1 className={styles.sidebar.title}> Vedic Publication</h1>
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
                {!isCollapsed && (
                    <p className={styles.sidebar.footerText}>
                        &copy; 2026 Vedic Publication
                    </p>
                )}

            </div>
        </div>
    )}

export default SideBar;
