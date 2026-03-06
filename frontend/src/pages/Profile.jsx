import { useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../api';

export function Profile({ initialTab = 'profile-orders' }) {
    const { notifications, setNotifications, formatTimeAgo, setActivePage } = useAppContext();

    const ordersRef = useRef(null);
    const notificationsRef = useRef(null);
    const settingsRef = useRef(null);

    const scrollToSection = (ref) => {
        if (ref.current) {
            const offset = 100; // Account for sticky header/tabs
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = ref.current.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        // Initial scroll based on initialTab prop
        const timer = setTimeout(() => {
            if (initialTab === 'profile-notifications') scrollToSection(notificationsRef);
            else if (initialTab === 'profile-settings') scrollToSection(settingsRef);
            else if (initialTab === 'profile-orders') scrollToSection(ordersRef);
        }, 100);
        return () => clearTimeout(timer);
    }, [initialTab]);

    const notificationConfigs = {
        ORDER_SUCCESS: { icon: 'check_circle', color: 'text-green-500', bg: 'bg-green-500/10', label: 'Order Confirmed' },
        ORDER_CANCELLED: { icon: 'cancel', color: 'text-red-500', bg: 'bg-red-500/10', label: 'Order Cancelled' },
        ORDER_COMPLETED: { icon: 'verified', color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Order Completed' },
        ABANDONED_CART: { icon: 'shopping_cart_off', color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Abandoned Cart' },
        LOW_STOCK: { icon: 'warning', color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Low Stock Alert' },
        NEW_PRODUCTS: { icon: 'new_releases', color: 'text-indigo-500', bg: 'bg-indigo-500/10', label: 'New Arrival' },
        SPECIAL_OFFER: { icon: 'local_offer', color: 'text-pink-500', bg: 'bg-pink-500/10', label: 'Special Offer' }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    };

    const mockOrders = [
        { id: 'ORD-9928', date: '2026-03-05', total: 549.99, status: 'Processing', items: 3 },
        { id: 'ORD-9841', date: '2026-02-28', total: 129.50, status: 'Shipped', items: 1 },
        { id: 'ORD-9712', date: '2026-02-15', total: 899.00, status: 'Delivered', items: 2 },
    ];

    return (
        <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-16 p-8 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:shadow-2xl">
                <div className="relative group">
                    <div className="h-32 w-32 rounded-full bg-primary/20 border-4 border-primary/30 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
                        <img className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnX1mcWPKB3cgFDOqVOboQPr08Kw0YMm8Jo8LX-JzRADSkOQoilqGWirQm4dE_XH7QLHW65hp3dWY3MbaQz8_yU8z1w2hUABCy32gU7mEDmUtdZsszs2ZDhDJZmvzh4OsHSSAJ_xHT-oBy7s7G9x8lkiuPPGfJPScLUNc3IVKQoyVTTks-f3ffM9duUVZWY_4rswPpHMTJRV8eqTcA2XMhHsVneKJihSlVtBo0Ll35cnYkCDfBbmcBSG5tAkqjQvP1bIF47EcJnUoJ" alt="Profile" />
                    </div>
                    <button className="absolute bottom-0 right-0 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                    </button>
                </div>
                <div className="text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Alex Rivera</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-bold mb-4">alex.rivera@example.com <span className="mx-2 opacity-30">•</span> New York, USA</p>
                    <div className="flex items-center justify-center md:justify-start gap-8">
                        <div>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">12</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Orders</p>
                        </div>
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                        <div>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">2.4k</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Spent</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Tabs Navigation */}
            <div className="sticky top-20 z-40 bg-slate-50/80 dark:bg-background-dark/80 backdrop-blur-md mb-12 py-4 -mx-4 px-4 border-y border-transparent transition-all duration-300">
                <div className="flex justify-center md:justify-start gap-2 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl w-fit">
                    <button onClick={() => { scrollToSection(ordersRef); setActivePage('profile-orders'); }} className="px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white flex items-center gap-2 cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]">history</span>
                        Orders
                    </button>
                    <button onClick={() => { scrollToSection(notificationsRef); setActivePage('profile-notifications'); }} className="px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white flex items-center gap-2 cursor-pointer relative">
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                        Notifications
                        {notifications.filter(n => !n.read).length > 0 && (
                            <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        )}
                    </button>
                    <button onClick={() => { scrollToSection(settingsRef); setActivePage('profile-settings'); }} className="px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white flex items-center gap-2 cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                        Account
                    </button>
                </div>
            </div>

            <div className="space-y-32">
                {/* My Orders Section */}
                <section ref={ordersRef} className="scroll-mt-32">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-1 block">Your History</span>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Orders</h2>
                        </div>
                        <button className="text-slate-400 hover:text-primary transition-colors cursor-pointer flex items-center gap-1 text-sm font-bold uppercase tracking-widest">
                            View All <span className="material-symbols-outlined text-[18px]">keyboard_arrow_right</span>
                        </button>
                    </div>

                    <div className="grid gap-6">
                        {mockOrders.map(order => (
                            <div key={order.id} className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 transition-all hover:border-primary/50 group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-[28px]">package_2</span>
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-slate-900 dark:text-white">{order.id}</p>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-8">
                                        <div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' :
                                                order.status === 'Processing' ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Items</p>
                                            <p className="font-black text-slate-900 dark:text-white">{order.items} Products</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                                            <p className="font-black text-primary text-lg">${order.total.toFixed(2)}</p>
                                        </div>
                                        <button className="h-10 w-10 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Notifications Section */}
                <section ref={notificationsRef} className="scroll-mt-32">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-1 block">Stay Updated</span>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Notifications</h2>
                        </div>
                    </div>

                    {notifications.length === 0 ? (
                        <div className="bg-slate-50 dark:bg-slate-900/30 rounded-3xl p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-700 mb-4 block">notifications_off</span>
                            <p className="text-slate-500 font-bold">You're all caught up!</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {notifications.map(notif => {
                                const config = notificationConfigs[notif.type] || { icon: 'info', color: 'text-slate-500', bg: 'bg-slate-500/10', label: 'System' };
                                return (
                                    <div
                                        key={notif.id}
                                        onClick={() => markAsRead(notif.id)}
                                        className={`p-5 rounded-2xl border transition-all flex items-center gap-5 cursor-pointer ${notif.read ? 'bg-white dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 opacity-60' : 'bg-primary/5 dark:bg-primary/10 border-primary/20 shadow-lg shadow-primary/5'}`}
                                    >
                                        <div className={`h-14 w-14 shrink-0 flex items-center justify-center rounded-2xl ${config.bg} ${config.color}`}>
                                            <span className="material-symbols-outlined text-[28px]">{config.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`text-[10px] uppercase font-black tracking-widest ${config.color}`}>
                                                    {config.label}
                                                </span>
                                                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
                                                    {formatTimeAgo(notif.createdAt)}
                                                </span>
                                            </div>
                                            <p className={`text-sm md:text-base ${!notif.read ? 'text-slate-900 dark:text-white font-black' : 'text-slate-600 dark:text-slate-400 font-bold'}`}>
                                                {notif.text}
                                            </p>
                                        </div>
                                        {!notif.read && (
                                            <div className="h-3 w-3 rounded-full bg-primary shrink-0 shadow-lg shadow-primary/50"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Account Settings Section */}
                <section ref={settingsRef} className="scroll-mt-32">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-1 block">Account Preferences</span>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Settings</h2>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                    <input type="text" readOnly value="Alex Rivera" className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-white" />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                                    <input type="email" readOnly value="alex.rivera@example.com" className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">Security & Preferences</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]">security</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Two-Factor Authentication</p>
                                        <p className="text-xs font-bold text-slate-500">Add an extra layer of security to your account.</p>
                                    </div>
                                </div>
                                <div className="h-6 w-11 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer">
                                    <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Order Updates Email</p>
                                        <p className="text-xs font-bold text-slate-500">Receive real-time tracking for your orders.</p>
                                    </div>
                                </div>
                                <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center mt-4">
                            <button className="px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-red-600 hover:bg-red-600/20 transition-all active:scale-95 cursor-pointer">Delete Account</button>
                            <button className="bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 cursor-pointer active:scale-95 transition-all">Save Changes</button>
                        </div>
                    </div>
                </section>
            </div>

            {/* Scroll to Top Button (Hidden by default, can be added later if needed) */}
            <div className="h-24"></div>
        </div>
    );
}
