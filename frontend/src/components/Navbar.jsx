import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '../context/AppContext';

export function Navbar() {
    const { 
        activePage, setActivePage, 
        searchQuery, setSearchQuery, 
        cart, removeFromCart, updateCartQuantity, 
        notifications, clearDropdownNotifications, markAllNotificationsAsRead, formatTimeAgo, 
        checkout,
        searchHistory, setSearchHistory, addToSearchHistory,
        user, logout
    } = useAppContext();

    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            addToSearchHistory(searchQuery);
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
    const isFirstRender = useRef(true);

    // Render states for exit animation
    const [shouldRenderCart, setShouldRenderCart] = useState(false);
    const [shouldRenderNotif, setShouldRenderNotif] = useState(false);
    const [shouldRenderProfile, setShouldRenderProfile] = useState(false);
    const [isCartVisible, setIsCartVisible] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isNotifOpen && notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
            if (isProfileOpen && profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isNotifOpen, isProfileOpen]);

    useEffect(() => {
        if (isCartOpen) {
            setShouldRenderCart(true);
            setIsNotifOpen(false);
            setIsProfileOpen(false);
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setIsCartVisible(true));
            });
        } else {
            setIsCartVisible(false);
            document.body.style.overflow = '';
            const timer = setTimeout(() => setShouldRenderCart(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isCartOpen]);

    useEffect(() => {
        if (isNotifOpen) {
            setShouldRenderNotif(true);
            setIsCartOpen(false);
            setIsProfileOpen(false);
            isFirstRender.current = false;
        } else {
            if (!isFirstRender.current) {
                markAllNotificationsAsRead();
            }
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
                            onChange={(e) => {
                                const val = e.target.value;
                                setSearchQuery(val);
                                if (activePage !== 'catalog' && val.trim() !== '') {
                                    setActivePage('catalog');
                                }
                            }}
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

                        {shouldRenderCart && createPortal(
                            <>
                                <div 
                                    className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isCartVisible ? 'opacity-100' : 'opacity-0'}`} 
                                    onClick={(e) => { e.stopPropagation(); setIsCartOpen(false); }}
                                ></div>
                                <aside 
                                    className={`fixed right-0 top-0 bottom-0 w-full sm:w-[480px] z-[101] bg-white dark:bg-[#101622]/90 backdrop-blur-xl border-l border-slate-200 dark:border-white/5 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isCartVisible ? 'translate-x-0' : 'translate-x-full'}`}
                                >
                                    <div className="p-8 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-slate-400">shopping_bag</span>
                                            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-[#F2F8FC]">Your Cart</h2>
                                            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase">{cartItemsCount} Items</span>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setIsCartOpen(false); }} 
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer text-slate-500 dark:text-slate-400"
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                        {cart.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                                                <span className="material-symbols-outlined text-6xl opacity-20">production_quantity_limits</span>
                                                <p className="text-lg">Your cart is empty.</p>
                                            </div>
                                        ) : (
                                            cart.map(item => (
                                                <div key={item.id} className="bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 rounded-xl p-4 flex gap-4 group transition-all hover:bg-slate-100 dark:hover:bg-white/[0.05]">
                                                    <div className="h-24 w-24 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-white/5 bg-white dark:bg-transparent">
                                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex flex-col flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{item.name}</h3>
                                                                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{item.category || 'Product'}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => removeFromCart(item.id)}
                                                                className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                                            >
                                                                <span className="material-symbols-outlined text-xl">delete</span>
                                                            </button>
                                                        </div>
                                                        <div className="mt-auto flex justify-between items-end">
                                                            <div className="flex items-center gap-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent rounded-lg px-2 py-1">
                                                                <button
                                                                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                                                    className="w-6 h-6 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white cursor-pointer"
                                                                >
                                                                    <span className="material-symbols-outlined text-[16px]">remove</span>
                                                                </button>
                                                                <span className="text-sm font-bold w-4 text-center text-slate-900 dark:text-[#F2F8FC]">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                                                    className="w-6 h-6 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white cursor-pointer"
                                                                >
                                                                    <span className="material-symbols-outlined text-[16px]">add</span>
                                                                </button>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight mb-0.5">
                                                                    {item.quantity} × ${Number(item.price).toFixed(2)}
                                                                </p>
                                                                <p className="text-primary font-black text-lg leading-none">
                                                                    ${(item.price * item.quantity).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/20">
                                        <div className="space-y-3 mb-8">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Subtotal</span>
                                                <span className="font-bold text-slate-900 dark:text-slate-100">${cartTotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Shipping</span>
                                                <span className="font-bold text-slate-900 dark:text-slate-100 italic">Free</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-white/5">
                                                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">Total</span>
                                                <span className="text-2xl font-black text-primary">${cartTotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                if (cart.length === 0) return;
                                                if (!user) {
                                                    setActivePage('login');
                                                } else {
                                                    setActivePage('checkout');
                                                }
                                                setIsCartOpen(false);
                                            }}
                                            disabled={cart.length === 0}
                                            className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer"
                                        >
                                            <span>PROCEED TO CHECKOUT</span>
                                            <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                        </button>
                                        <div className="mt-6 flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-xs text-slate-500">lock</span>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Secure Encrypted Checkout</p>
                                        </div>
                                    </div>
                                </aside>
                            </>,
                            document.body
                        )}
                    </div>

                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className={`relative h-10 w-10 flex items-center justify-center rounded-lg transition-all active:scale-98 cursor-pointer ${isNotifOpen ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <span className="material-symbols-outlined">notifications</span>
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 border-2 border-white dark:border-slate-800"></span>
                            )}
                        </button>
                        {shouldRenderNotif && (
                            <div className={`absolute right-0 top-full mt-2 w-[420px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col origin-top-right ${isNotifOpen ? 'animate-dropdown' : 'animate-dropdown-out'}`}>
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900 dark:text-[#F2F8FC]">Notifications</h3>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); clearDropdownNotifications(); }}
                                        className="text-xs text-slate-400 hover:text-red-500 hover:underline font-medium cursor-pointer"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.filter(n => !n.cleared).length === 0 ? (
                                        <div className="p-8 text-center text-sm text-slate-500">
                                            No new notifications
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
                                            {[...notifications].filter(n => !n.cleared).sort((a, b) => b.id - a.id).slice(0, 5).map(notif => {
                                                const config = {
                                                    ORDER_SUCCESS: { icon: 'check_circle', color: 'text-green-500', bg: 'bg-green-500/10' },
                                                    ORDER_CANCELLED: { icon: 'cancel', color: 'text-red-500', bg: 'bg-red-500/10' },
                                                    ORDER_COMPLETED: { icon: 'verified', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                                    ABANDONED_CART: { icon: 'shopping_cart_off', color: 'text-orange-500', bg: 'bg-orange-500/10' },
                                                    LOW_STOCK: { icon: 'warning', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                                    NEW_PRODUCTS: { icon: 'new_releases', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                                                    SPECIAL_OFFER: { icon: 'local_offer', color: 'text-pink-500', bg: 'bg-pink-500/10' }
                                                }[notif.type] || { icon: 'info', color: 'text-slate-500', bg: 'bg-slate-500/10' };

                                                return (
                                                    <div key={notif.id} className={`p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer relative ${!notif.read ? 'bg-primary/10 dark:bg-primary/20' : ''}`}>
                                                        <div className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-full ${config.bg} ${config.color}`}>
                                                            <span className="material-symbols-outlined text-[20px]">{config.icon}</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0 pr-14">
                                                            <p className={`text-[13px] leading-tight line-clamp-2 ${!notif.read ? 'font-black text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                                {notif.text}
                                                            </p>
                                                        </div>
                                                        <span className="absolute top-3 right-4 text-[10px] text-slate-400 uppercase font-black tracking-tight" title={new Date(notif.createdAt).toLocaleString()}>
                                                            {formatTimeAgo(notif.createdAt)}
                                                        </span>
                                                        {!notif.read && (
                                                            <div className="absolute right-2 bottom-3">
                                                                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/50"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                                    <button
                                        onClick={() => {
                                            if (!user) setActivePage('login');
                                            else setActivePage('profile-notifications');
                                            setIsNotifOpen(false);
                                        }}
                                        className="w-full py-2 flex items-center justify-center gap-2 text-primary font-bold text-sm hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                                    >
                                        See all notifications
                                        <span className="material-symbols-outlined text-[18px]">keyboard_double_arrow_right</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

                    <div className="relative" ref={profileRef}>
                        {user ? (
                            <div className="flex items-center gap-3 pl-2 cursor-pointer transition-all" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-black text-slate-900 dark:text-[#F2F8FC] leading-none select-none">{user.username}</p>
                                </div>
                                <div className="h-9 w-9 rounded-full bg-primary/20 border-2 border-primary/30 overflow-hidden cursor-pointer select-none">
                                    <img className="h-full w-full object-cover select-none" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnX1mcWPKB3cgFDOqVOboQPr08Kw0YMm8Jo8LX-JzRADSkOQoilqGWirQm4dE_XH7QLHW65hp3dWY3MbaQz8_yU8z1w2hUABCy32gU7mEDmUtdZsszs2ZDhDJZmvzh4OsHSSAJ_xHT-oBy7s7G9x8lkiuPPGfJPScLUNc3IVKQoyVTTks-f3ffM9duUVZWY_4rswPpHMTJRV8eqTcA2XMhHsVneKJihSlVtBo0Ll35cnYkCDfBbmcBSG5tAkqjQvP1bIF47EcJnUoJ" alt="Profile avatar" draggable="false" />
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setActivePage('login')}
                                className="px-5 py-2 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                            >
                                Sign In
                            </button>
                        )}

                        {shouldRenderProfile && user && (
                            <div className={`absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 py-2 origin-top-right ${isProfileOpen ? 'animate-dropdown' : 'animate-dropdown-out'}`}>
                                <button
                                    onClick={() => { setActivePage('profile-orders'); setIsProfileOpen(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                                >
                                    My Orders
                                </button>
                                <button
                                    onClick={() => { setActivePage('profile-settings'); setIsProfileOpen(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                                >
                                    Account Settings
                                </button>
                                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                                <button 
                                    onClick={() => { logout(); setIsProfileOpen(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-sm font-bold text-red-500 cursor-pointer"
                                >
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
