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
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const data = await api.get('/notifications');
            setNotifications(data);
        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const clearDropdownNotifications = async () => {
        try {
            await api.patch('/notifications/clear-all');
            setNotifications(prev => prev.map(n => ({ ...n, cleared: true })));
        } catch (err) {
            console.error("Error clearing notifications:", err);
        }
    };

    const markAllNotificationsAsRead = async () => {
        const unread = notifications.some(n => !n.read);
        if (!unread) return;

        try {
            await api.patch('/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error("Error marking as read:", err);
        }
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

    const checkout = async () => {
        if (cart.length === 0) return;

        const orderData = {
            customerName: "Alex Rivera", // Hardcoded for now
            totalAmount: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
            orderItems: cart.map(item => ({
                productName: item.name,
                quantity: item.quantity
            }))
        };

        try {
            await api.post('/orders', orderData);
            setCart([]);
            fetchNotifications(); // Update notifications to show success message
            return true;
        } catch (err) {
            console.error("Checkout failed:", err);
            return false;
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setPriceRange([0, 5000]);
        setInStockOnly(false);
        setSortBy('name,asc');
        setCurrentPage(0);
    };
    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInMs = now - past;
        const diffInSec = Math.floor(diffInMs / 1000);
        const diffInMin = Math.floor(diffInSec / 60);
        const diffInHour = Math.floor(diffInMin / 60);
        const diffInDay = Math.floor(diffInHour / 24);

        if (diffInSec < 60) return 'Just now';
        if (diffInMin < 60) return `${diffInMin}m ago`;
        if (diffInHour < 24) return `${diffInHour}h ago`;
        if (diffInDay < 7) return `${diffInDay}d ago`;
        return past.toLocaleDateString();
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
            notifications, setNotifications, clearDropdownNotifications, markAllNotificationsAsRead, formatTimeAgo,
            checkout
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
