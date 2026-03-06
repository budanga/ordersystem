import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

export function Navbar() {
    const { activePage, setActivePage, searchQuery, setSearchQuery, cart, removeFromCart, updateCartQuantity } = useAppContext();

    // Search History State
    const [searchHistory, setSearchHistory] = useState(() => {
        const saved = localStorage.getItem('searchHistory');
        return saved ? JSON.parse(saved) : [];
    });
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Save history to localStorage
    useEffect(() => {
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }, [searchHistory]);

    // Clear search query is handled by specific interaction clicks instead of broadly listening to activePage

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim() && !searchHistory.includes(searchQuery.trim())) {
            setSearchHistory(prev => [searchQuery.trim(), ...prev].slice(0, 5)); // Keep last 5
        }
        if (searchQuery.trim()) {
            setIsSearchFocused(false);
            e.target.blur();
            if (activePage !== 'catalog') {
                setActivePage('catalog');
            }
        }
    };

    // UI states 
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Refs for click-outside detection
    const cartRef = useRef(null);
    const notifRef = useRef(null);
    const profileRef = useRef(null);

    // Render states for exit animation
    const [shouldRenderCart, setShouldRenderCart] = useState(false);
    const [shouldRenderNotif, setShouldRenderNotif] = useState(false);
    const [shouldRenderProfile, setShouldRenderProfile] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isCartOpen && cartRef.current && !cartRef.current.contains(event.target)) {
                setIsCartOpen(false);
            }
            if (isNotifOpen && notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
            if (isProfileOpen && profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isCartOpen, isNotifOpen, isProfileOpen]);

    useEffect(() => {
        if (isCartOpen) {
            setShouldRenderCart(true);
            setIsNotifOpen(false);
            setIsProfileOpen(false);
        } else {
            const timer = setTimeout(() => setShouldRenderCart(false), 120);
            return () => clearTimeout(timer);
        }
    }, [isCartOpen]);

    useEffect(() => {
        if (isNotifOpen) {
            setShouldRenderNotif(true);
            setIsCartOpen(false);
            setIsProfileOpen(false);
        } else {
            const timer = setTimeout(() => setShouldRenderNotif(false), 120);
            return () => clearTimeout(timer);
        }
    }, [isNotifOpen]);

    useEffect(() => {
        if (isProfileOpen) {
            setShouldRenderProfile(true);
            setIsCartOpen(false);
            setIsNotifOpen(false);
        } else {
            const timer = setTimeout(() => setShouldRenderProfile(false), 120);
            return () => clearTimeout(timer);
        }
    }, [isProfileOpen]);

    // Calculate total numbers of items in the cart
    const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
                <div
                    onClick={() => { setActivePage('home'); setSearchQuery(''); }}
                    className="flex items-center gap-2 shrink-0 cursor-pointer group active:scale-98 transition-all duration-300 hover:-translate-y-0.5"
                >
                    <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/30">
                        <span className="material-symbols-outlined text-white text-[20px] block">diamond</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-[#F2F8FC] select-none">Budal</h1>
                </div>

                <div className="flex-1 max-w-2xl relative">
                    <form onSubmit={handleSearchSubmit} className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            className="w-full bg-slate-100 dark:bg-slate-800/50 border-none focus:outline-none focus:ring-2 focus:ring-primary/80 rounded-xl pl-10 pr-4 py-2 text-sm transition-all duration-200 ease-out placeholder:text-slate-500 text-slate-900 dark:text-[#F2F8FC] focus:bg-white dark:focus:bg-slate-800"
                            placeholder="Search products"
                            type="text"
                        />
                        {isSearchFocused && searchHistory.length > 0 && !searchQuery && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 animate-dropdown">
                                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Searches</span>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => { e.preventDefault(); setSearchHistory([]); }}
                                        className="text-[13px] text-slate-400 hover:text-red-500 cursor-pointer"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <ul>
                                    {searchHistory.map((item, index) => (
                                        <li key={index}>
                                            <button
                                                type="button"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    setSearchQuery(item);
                                                    if (activePage !== 'catalog') setActivePage('catalog');
                                                    setIsSearchFocused(false);
                                                }}
                                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[16px] text-slate-400">history</span>
                                                {item}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </form>
                </div>

                <div className="flex items-center gap-4 shrink-0 relative">
                    {/* Cart Dropdown */}
                    <div className="relative" ref={cartRef}>
                        <button
                            onClick={() => setIsCartOpen(!isCartOpen)}
                            className={`relative h-10 w-10 flex items-center justify-center rounded-lg transition-all active:scale-98 cursor-pointer ${isCartOpen ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <span className="material-symbols-outlined">shopping_cart</span>
                            {cartItemsCount > 0 && (
                                <span className={`absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold leading-none ${isCartOpen ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                                    {cartItemsCount}
                                </span>
                            )}
                        </button>

                        {shouldRenderCart && (
                            <div className={`absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col max-h-[80vh] origin-top-right ${isCartOpen ? 'animate-dropdown' : 'animate-dropdown-out'}`}>
                                <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                                    <h3 className="font-bold text-slate-900 dark:text-[#F2F8FC]">Your Cart ({cartItemsCount})</h3>
                                </div>
                                <div className="overflow-y-auto flex-1 p-4 space-y-4">
                                    {cart.length === 0 ? (
                                        <p className="text-sm text-slate-500 text-center py-4">Your cart is empty.</p>
                                    ) : (
                                        cart.map(item => (
                                            <div key={item.id} className="flex gap-3">
                                                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-slate-100 dark:bg-slate-900" />
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-[#F2F8FC] line-clamp-1">{item.name}</h4>
                                                    <p className="text-primary font-bold mt-1">${Number(item.price).toFixed(2)}</p>

                                                    <div className="flex items-center gap-2 mt-2">
                                                        <button
                                                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                                            className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary transition-colors cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">remove</span>
                                                        </button>
                                                        <span className="text-sm font-medium dark:text-slate-300 w-4 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                                            className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary transition-colors cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">add</span>
                                                        </button>

                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="ml-auto text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {cart.length > 0 && (
                                    <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-medium text-slate-500">Total</span>
                                            <span className="text-lg font-black text-slate-900 dark:text-[#F2F8FC]">${cartTotal.toFixed(2)}</span>
                                        </div>
                                        <button className="w-full py-3 bg-primary text-white font-bold rounded-xl cursor-pointer shadow-lg shadow-primary/20">
                                            Checkout Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Notifications Dropdown */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className={`h-10 w-10 flex items-center justify-center rounded-lg transition-all active:scale-98 cursor-pointer ${isNotifOpen ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        {shouldRenderNotif && (
                            <div className={`absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 p-4 text-center text-sm text-slate-500 origin-top-right ${isNotifOpen ? 'animate-dropdown' : 'animate-dropdown-out'}`}>
                                No new notifications
                            </div>
                        )}
                    </div>

                    <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <div className="flex items-center gap-3 pl-2 cursor-pointer transition-all" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-medium text-slate-900 dark:text-[#F2F8FC] leading-none select-none">Alex Rivera</p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-primary/20 border-2 border-primary/30 overflow-hidden cursor-pointer select-none">
                                <img className="h-full w-full object-cover select-none" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnX1mcWPKB3cgFDOqVOboQPr08Kw0YMm8Jo8LX-JzRADSkOQoilqGWirQm4dE_XH7QLHW65hp3dWY3MbaQz8_yU8z1w2hUABCy32gU7mEDmUtdZsszs2ZDhDJZmvzh4OsHSSAJ_xHT-oBy7s7G9x8lkiuPPGfJPScLUNc3IVKQoyVTTks-f3ffM9duUVZWY_4rswPpHMTJRV8eqTcA2XMhHsVneKJihSlVtBo0Ll35cnYkCDfBbmcBSG5tAkqjQvP1bIF47EcJnUoJ" alt="Profile avatar" draggable="false" />
                            </div>
                        </div>

                        {shouldRenderProfile && (
                            <div className={`absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 py-2 origin-top-right ${isProfileOpen ? 'animate-dropdown' : 'animate-dropdown-out'}`}>
                                <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                                    My Orders
                                </button>
                                <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                                    Account Settings
                                </button>
                                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                                <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-sm font-medium text-red-500 cursor-pointer">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
