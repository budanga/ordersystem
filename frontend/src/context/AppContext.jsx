import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AppContext = createContext();

export function AppProvider({ children }) {
    // UI State
    const [activePage, setActivePage] = useState('home'); // 'home' or 'catalog'
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [inStockOnly, setInStockOnly] = useState(false);

    const [sortBy, setSortBy] = useState('name,asc');

    // Pagination
    const [currentPage, setCurrentPage] = useState(0); // backend is 0-indexed
    const [totalPages, setTotalPages] = useState(1);

    // Cart State
    const [cart, setCart] = useState([]);

    // Notifications State
    const [notifications, setNotifications] = useState([
        {
            id: 5,
            type: 'order_success',
            text: 'Your order #12345 has been confirmed! We are now preparing your package for shipment.',
            date: '2 min ago',
            read: false,
            cleared: false
        },
        {
            id: 4,
            type: 'order_cancelled',
            text: 'Order #12340 cancelled: Out of stock.',
            date: '1 hour ago',
            read: false,
            cleared: false
        },
        {
            id: 3,
            type: 'low_stock',
            text: 'Limited stock! Items in your cart might sell out soon.',
            date: '3 hours ago',
            read: false,
            cleared: false
        },
        {
            id: 2,
            type: 'special_offer',
            text: 'Flash Sale: 30% off on all winter categories!',
            date: '5 hours ago',
            read: true,
            cleared: false
        },
        {
            id: 1,
            type: 'new_products',
            text: 'Check out the new Premium Collection.',
            date: '1 day ago',
            read: true,
            cleared: false
        }
    ]);

    const clearDropdownNotifications = () => {
        setNotifications(prev => prev.map(n => ({ ...n, cleared: true })));
    };

    const markAllNotificationsAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    // Categories from Backend
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        api.get('/products/categories')
            .then(data => setCategories(data))
            .catch(err => console.error("Error fetching categories:", err));
    }, []);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateCartQuantity = (productId, quantity) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                return { ...item, quantity: Math.max(1, quantity) };
            }
            return item;
        }));
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setPriceRange([0, 5000]);
        setInStockOnly(false);
        setSortBy('name,asc');
        setCurrentPage(0);
    };

    return (
        <AppContext.Provider value={{
            activePage, setActivePage,
            viewMode, setViewMode,
            searchQuery, setSearchQuery,
            selectedCategory, setSelectedCategory,
            priceRange, setPriceRange,
            inStockOnly, setInStockOnly,
            sortBy, setSortBy,
            currentPage, setCurrentPage,
            totalPages, setTotalPages,
            cart, addToCart, removeFromCart, updateCartQuantity,
            resetFilters,
            categories,
            notifications, setNotifications, clearDropdownNotifications, markAllNotificationsAsRead,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
