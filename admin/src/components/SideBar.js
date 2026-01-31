import React from 'react'
import { styles } from '../assets/dummyStyles';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';


const SideBar = () => {

    const [isCollapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();

    const navItems = [
        {path: '/', icon: BookPlus, label: 'Add Books' },
        {path:'/list-books',  icon: BookOpen, label: 'List Books'},
        {path: '/orders', icon: ShoppingCart, label: 'Orders'},
    ];

    //Mobile View Navigation
    if(isMobile) {
        return (
            <div className={styles.mobileNav.container}>
                <nav className={styles.mobileNav.nav}>
                    {navItems.map(({path, icon: Icon, label}) => {
                        const isActive = location.pathname === path;

                        
                    })}
                </nav>
            </div>
        )
    }

    return (
        <div className={styles.sidebar.container(isCollapsed)}></div>;
    )
}

export default SideBar