import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AppContext = createContext();

export function AppProvider({ children }) {
    // UI State
    const [activePage, setActivePage] = useState('home'); // 'home', 'catalog', 'product-details', 'login', 'register', etc.
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Auth State
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = async (username, password) => {
        try {
            const data = await api.post('/auth/login', { username, password });
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            const userData = { 
                username: data.username, 
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                address: data.address
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            setActivePage('home');
            fetchNotifications();
            return { success: true };
        } catch (err) {
            console.error("Login failed:", err);
            return { success: false, error: err.response?.status === 401 ? 'Invalid credentials' : 'Login failed' };
        }
    };

    const register = async (userDataPayload) => {
        try {
            const data = await api.post('/auth/register', userDataPayload);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            const userData = { 
                username: data.username, 
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                address: data.address
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            setActivePage('home');
            fetchNotifications();
            return { success: true };
        } catch (err) {
            console.error("Registration failed:", err);
            if (err.response?.status === 409) {
                return { success: false, error: err.response.data || 'Username or Email already exists' };
            }
            return { success: false, error: 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        setNotifications([]);
        setActivePage('home');
    };

    // Filter State
    const [searchHistory, setSearchHistory] = useState(() => {
        const saved = localStorage.getItem('searchHistory');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }, [searchHistory]);

    const addToSearchHistory = (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        setSearchHistory(prev => {
            const filtered = prev.filter(h => h !== trimmed);
            return [trimmed, ...filtered].slice(0, 5);
        });
    };

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
        if (!localStorage.getItem('accessToken')) return;
        try {
            const data = await api.get('/notifications');
            setNotifications(data);
        } catch (err) {
            console.error("Error fetching notifications:", err);
            if (err.response?.status === 401) {
                // Token might be expired, logout for now
                // logout();
            }
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
        if (!user) {
            setActivePage('login');
            return false;
        }

        const orderData = {
            customerName: user.username,
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

    const viewProductDetails = (product) => {
        if (searchQuery.trim()) {
            addToSearchHistory(searchQuery);
        }
        setSelectedProduct(product);
        setActivePage('product-details');
        window.scrollTo(0, 0);
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
            checkout,
            selectedProduct, setSelectedProduct, viewProductDetails,
            searchHistory, setSearchHistory, addToSearchHistory,
            user, login, register, logout
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
