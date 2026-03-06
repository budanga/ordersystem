import { useRef, useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../api';

export function Profile({ initialTab = 'profile-orders' }) {
    const { notifications, setNotifications, formatTimeAgo, setActivePage, user, updateProfile } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const [formData, setFormData] = useState({
        username: user?.username || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        address: user?.address || ''
    });

    const [updateError, setUpdateError] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (updateError) setUpdateError('');
        if (updateSuccess) setUpdateSuccess('');
    };

    const handleUpdateProfile = async (e) => {
        e?.preventDefault();
        setUpdateError('');
        setUpdateSuccess('');
        
        const res = await updateProfile(formData);
        if (res.success) {
            setUpdateSuccess('Profile updated successfully!');
        } else {
            setUpdateError(res.error);
        }
    };

    const fetchOrders = async () => {
        if (!user) return;
        setLoadingOrders(true);
        try {
            const data = await api.get(`/orders/customer?customerName=${user.username}`);
            // The backend returns a list of OrderDTO
            setOrders(data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoadingOrders(false);
        }
    };

    useEffect(() => {
        if (!user) {
            setActivePage('login');
        } else {
            fetchOrders();
        }
    }, [user, setActivePage]);

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

    if (!user) return null;

    return (
        <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-16 p-8 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 dark:hover:shadow-primary/20 hover:border-primary/20">
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
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{user.firstName ? `${user.firstName} ${user.lastName}` : user.username}</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-bold mb-4">{user.email} <span className="mx-2 opacity-30">•</span> {user.address || 'No address provided'}</p>
                    <div className="flex items-center justify-center md:justify-start gap-8">
                        <div>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{orders.length}</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Orders</p>
                        </div>
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                        <div>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">
                                ${orders.reduce((acc, o) => acc + o.totalAmount, 0).toFixed(0)}
                            </p>
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
                            <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full ring-4 ring-slate-100 dark:ring-slate-900"></span>
                        )}
                    </button>
                    <button onClick={() => { scrollToSection(settingsRef); setActivePage('profile-settings'); }} className="px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white flex items-center gap-2 cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                        Settings
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
                        {loadingOrders ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="size-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800/30 p-12 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                                <span className="material-symbols-outlined text-5xl text-slate-200 dark:text-slate-700 mb-4">shopping_bag</span>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No orders yet</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-8">Start your first purchase today!</p>
                                <button onClick={() => setActivePage('catalog')} className="px-8 py-3 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">Explore Catalog</button>
                            </div>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 transition-all hover:border-primary/50 group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-[28px]">package_2</span>
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-slate-900 dark:text-white">#{order.id}</p>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-8">
                                            <div>
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.completed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                    {order.completed ? 'Delivered' : 'Processing'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Items</p>
                                                <p className="text-sm font-black dark:text-slate-200">{order.orderItems?.length || 0} Products</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                                                <p className="text-xl font-black text-primary">${Number(order.totalAmount).toFixed(2)}</p>
                                            </div>
                                            <button className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer shadow-sm">
                                                <span className="material-symbols-outlined">chevron_right</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Notifications Section */}
                <section ref={notificationsRef} className="scroll-mt-32">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-1 block">Activity</span>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Recent Notifications</h2>
                        </div>
                        <button className="text-slate-400 hover:text-primary transition-colors cursor-pointer flex items-center gap-1 text-sm font-bold uppercase tracking-widest">
                            Mark All Read
                        </button>
                    </div>

                    <div className="space-y-4">
                        {notifications.length === 0 ? (
                            <p className="text-center py-10 text-slate-500">You're all caught up!</p>
                        ) : (
                            notifications.map(notif => {
                                const config = notificationConfigs[notif.type] || { icon: 'info', color: 'text-slate-500', bg: 'bg-slate-500/10', label: 'System' };
                                return (
                                    <div
                                        key={notif.id}
                                        onClick={() => markAsRead(notif.id)}
                                        className={`p-5 rounded-2xl border transition-all flex items-center gap-5 cursor-pointer ${notif.read ? 'bg-white dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 opacity-60' : 'bg-primary/5 dark:bg-primary/10 border-primary/20 shadow-lg shadow-primary/5'}`}
                                    >
                                        <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center ${config.bg} ${config.color}`}>
                                            <span className="material-symbols-outlined">{config.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className={`text-[10px] uppercase font-black tracking-widest ${config.color}`}>{config.label}</p>
                                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">{formatTimeAgo(notif.createdAt)}</p>
                                            </div>
                                            <p className={`text-sm ${notif.read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white font-bold'}`}>{notif.text}</p>
                                        </div>
                                        <div className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* Account Settings Section */}
                <section ref={settingsRef} className="scroll-mt-32">
                    <div className="mb-8">
                        <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-1 block">Preferences</span>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Account Settings</h2>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                        <div className="p-8 md:p-12 space-y-12">
                            {updateError && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-bold animate-fade-in flex items-center gap-3">
                                    <span className="material-symbols-outlined">error</span>
                                    {updateError}
                                </div>
                            )}
                            {updateSuccess && (
                                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-2xl text-sm font-bold animate-fade-in flex items-center gap-3">
                                    <span className="material-symbols-outlined">check_circle</span>
                                    {updateSuccess}
                                </div>
                            )}

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
                                    <input type="text" name="username" value={formData.username} onChange={handleFormChange} className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/30 rounded-2xl px-6 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400/70 dark:placeholder:text-slate-600 placeholder:font-medium" placeholder="e.g. johndoe" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleFormChange} className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/30 rounded-2xl px-6 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400/70 dark:placeholder:text-slate-600 placeholder:font-medium" placeholder="e.g. your@email.com" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/30 rounded-2xl px-6 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400/70 dark:placeholder:text-slate-600 placeholder:font-medium" placeholder="e.g. John" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/30 rounded-2xl px-6 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400/70 dark:placeholder:text-slate-600 placeholder:font-medium" placeholder="e.g. Doe" />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/30 rounded-2xl px-6 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400/70 dark:placeholder:text-slate-600 placeholder:font-medium" placeholder="e.g. +1 (555) 000-0000" />
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Address</label>
                                <textarea name="address" value={formData.address} onChange={handleFormChange} className="w-full min-h-[100px] py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/30 rounded-2xl px-6 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400/70 dark:placeholder:text-slate-600 placeholder:font-medium resize-none" placeholder="e.g. 123 Street Code, City, Country" />
                            </div>

                            {/* Switches Section */}
                            <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Communication Preferences</h3>
                                <div className="grid gap-4">
                                    <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/30 rounded-2xl">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">Email Notifications</p>
                                            <p className="text-xs text-slate-500">Receive updates on your order status and shipping.</p>
                                        </div>
                                        <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                                            <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/30 rounded-2xl">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">Marketing Offers</p>
                                            <p className="text-xs text-slate-500">Personalized discounts and new arrival alerts.</p>
                                        </div>
                                        <div className="h-6 w-11 bg-slate-200 dark:bg-slate-800 rounded-full relative cursor-pointer">
                                            <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center mt-4">
                            <button type="button" className="px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-red-600 hover:bg-red-600/20 transition-all active:scale-95 cursor-pointer">Delete Account</button>
                            <button type="submit" className="bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 cursor-pointer active:scale-95 transition-all">Save Changes</button>
                        </div>
                    </form>
                </section>
            </div>

            {/* Bottom space */}
            <div className="h-24"></div>
        </div>
    );
}
