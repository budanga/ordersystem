import { useAppContext } from '../context/AppContext';

export function Profile({ initialTab = 'profile-orders' }) {
    const { notifications, setNotifications, setActivePage } = useAppContext();
    const currentTab = initialTab;

    const notificationConfigs = {
        order_success: { icon: 'check_circle', color: 'text-green-500', bg: 'bg-green-500/10', label: 'Order Confirmed' },
        order_cancelled: { icon: 'cancel', color: 'text-red-500', bg: 'bg-red-500/10', label: 'Order Cancelled' },
        order_completed: { icon: 'verified', color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Order Completed' },
        abandoned_cart: { icon: 'shopping_cart_off', color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Abandoned Cart' },
        low_stock: { icon: 'warning', color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Low Stock Alert' },
        new_products: { icon: 'new_releases', color: 'text-indigo-500', bg: 'bg-indigo-500/10', label: 'New Arrival' },
        special_offer: { icon: 'local_offer', color: 'text-pink-500', bg: 'bg-pink-500/10', label: 'Special Offer' }
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-center gap-6 mb-12">
                <div className="h-24 w-24 rounded-full bg-primary/20 border-4 border-primary/30 overflow-hidden shadow-xl">
                    <img className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnX1mcWPKB3cgFDOqVOboQPr08Kw0YMm8Jo8LX-JzRADSkOQoilqGWirQm4dE_XH7QLHW65hp3dWY3MbaQz8_yU8z1w2hUABCy32gU7mEDmUtdZsszs2ZDhDJZmvzh4OsHSSAJ_xHT-oBy7s7G9x8lkiuPPGfJPScLUNc3IVKQoyVTTks-f3ffM9duUVZWY_4rswPpHMTJRV8eqTcA2XMhHsVneKJihSlVtBo0Ll35cnYkCDfBbmcBSG5tAkqjQvP1bIF47EcJnUoJ" alt="Profile" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-[#F2F8FC]">Alex Rivera</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Customer since March 2026</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                    {['My Orders', 'Account Settings', 'Notifications'].map((tab) => {
                        const tabId = 'profile-' + tab.toLowerCase().replace(' ', '-');
                        const isActive = currentTab === tabId;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActivePage(tabId)}
                                className={`px-6 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${isActive ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200'}`}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {tab === 'My Orders' ? 'shopping_bag' : tab === 'Account Settings' ? 'settings' : 'notifications'}
                                </span>
                                {tab}
                                {tab === 'Notifications' && notifications.filter(n => !n.read).length > 0 && (
                                    <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                        {notifications.filter(n => !n.read).length}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="p-8">
                    {currentTab === 'profile-notifications' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-[#F2F8FC]">Recent Notifications</h2>
                            </div>

                            {notifications.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="h-16 w-16 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-slate-400 text-3xl">notifications_off</span>
                                    </div>
                                    <p className="text-slate-500">You don't have any notifications yet.</p>
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {notifications.map(notif => {
                                        const config = notificationConfigs[notif.type] || { icon: 'info', color: 'text-slate-500', bg: 'bg-slate-500/10', label: 'System' };
                                        return (
                                            <div 
                                                key={notif.id} 
                                                onClick={() => markAsRead(notif.id)}
                                                className={`p-4 rounded-xl border transition-all flex items-center gap-4 cursor-pointer ${notif.read ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-75' : 'bg-primary/5 dark:bg-primary/10 border-primary/20 shadow-sm'}`}
                                            >
                                                <div className={`h-12 w-12 shrink-0 flex items-center justify-center rounded-xl ${config.bg} ${config.color}`}>
                                                    <span className="material-symbols-outlined text-[24px]">{config.icon}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <span className={`text-[10px] uppercase font-black tracking-wider ${config.color}`}>
                                                            {config.label}
                                                        </span>
                                                        <span className="text-[11px] text-slate-400 font-medium">
                                                            {notif.date}
                                                        </span>
                                                    </div>
                                                    <p className={`text-sm mt-0.5 text-slate-800 dark:text-slate-200 ${!notif.read ? 'font-bold' : 'font-medium'}`}>
                                                        {notif.text}
                                                    </p>
                                                </div>
                                                {!notif.read && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 animate-pulse"></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {currentTab !== 'profile-notifications' && (
                        <div className="text-center py-20 text-slate-500 font-medium italic">
                            Esta sección ({currentTab}) está en desarrollo. Selecciona la pestaña de <span className="text-primary not-italic font-bold">Notificaciones</span>.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
