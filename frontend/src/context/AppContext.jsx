import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AppContext = createContext();

export function AppProvider({ children }) {
    // UI State
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
            categories
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
