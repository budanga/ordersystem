import { useRef, useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../api';

const TABS = [
    { id: 'profile-details', label: 'Profile Details', icon: 'person' },
    { id: 'profile-orders', label: 'Order History', icon: 'history' },
    { id: 'profile-settings', label: 'Settings', icon: 'settings' },
];

function ToggleSwitch({ enabled, onToggle }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={`relative h-6 w-11 rounded-full transition-colors duration-300 cursor-pointer ${enabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
        >
            <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all duration-300 ${enabled ? 'right-1' : 'left-1'}`} />
        </button>
    );
}

// ─── Profile Details Tab ─────────────────────────────────────────────────────
function ProfileDetailsTab({ user, updateProfile }) {
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (updateError) setUpdateError('');
        if (updateSuccess) setUpdateSuccess('');
    };

    const handleSave = async (section) => {
        setUpdateError('');
        setUpdateSuccess('');
        const res = await updateProfile(formData);
        if (res.success) {
            setUpdateSuccess('Profile updated successfully!');
            if (section === 'personal') setIsEditingPersonal(false);
            if (section === 'address') setIsEditingAddress(false);
        } else {
            setUpdateError(res.error);
        }
    };

    const handleCancel = (section) => {
        setFormData({
            username: user.username || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            address: user.address || ''
        });
        if (section === 'personal') setIsEditingPersonal(false);
        if (section === 'address') setIsEditingAddress(false);
        setUpdateError('');
    };

    const personalFields = [
        { label: 'Username', name: 'username', icon: 'badge', type: 'text' },
        { label: 'Email Address', name: 'email', icon: 'mail', type: 'email' },
        { label: 'First Name', name: 'firstName', icon: 'person', type: 'text' },
        { label: 'Last Name', name: 'lastName', icon: 'person', type: 'text' },
        { label: 'Phone Number', name: 'phoneNumber', icon: 'call', type: 'tel' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Section Header */}
            <div>
                <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-1 block">Your Profile</span>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Profile Details</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Manage your personal information, contact details, and shipping preferences.</p>
            </div>

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

            {/* Personal Information */}
            <div className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Personal Information</h3>
                    <button
                        onClick={() => isEditingPersonal ? handleCancel('personal') : setIsEditingPersonal(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer text-slate-500 dark:text-slate-400 hover:text-primary"
                        title={isEditingPersonal ? 'Cancel' : 'Edit'}
                    >
                        <span className="material-symbols-outlined text-[20px]">{isEditingPersonal ? 'close' : 'edit'}</span>
                    </button>
                </div>
                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {personalFields.map(f => (
                            <div key={f.name} className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">{f.label}</label>
                                {isEditingPersonal ? (
                                    <input
                                        type={f.type}
                                        name={f.name}
                                        value={formData[f.name]}
                                        onChange={handleChange}
                                        className="w-full h-12 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/30 rounded-xl px-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 h-12 px-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
                                        <span className="material-symbols-outlined text-[18px] text-slate-400">{f.icon}</span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{formData[f.name] || '—'}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {isEditingPersonal && (
                    <div className="px-6 md:px-8 pb-6 md:pb-8 flex justify-end gap-3 animate-fade-in">
                        <button onClick={() => handleCancel('personal')} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer">Cancel</button>
                        <button onClick={() => handleSave('personal')} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer active:scale-95">Save Changes</button>
                    </div>
                )}
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Shipping Address</h3>
                </div>
                <div className="p-6 md:p-8">
                    {formData.address ? (
                        <div className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-900/30 rounded-2xl">
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-[20px]">location_on</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Primary Address</span>
                                </div>
                                {isEditingAddress ? (
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full min-h-[80px] py-3 bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 rounded-xl px-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all resize-none mt-2"
                                    />
                                ) : (
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{formData.address}</p>
                                )}
                            </div>
                            {!isEditingAddress && (
                                <button
                                    onClick={() => setIsEditingAddress(true)}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-slate-400 hover:text-primary"
                                >
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700 mb-2">add_location</span>
                            <p className="text-sm text-slate-500 mb-4">No address added yet.</p>
                            <button onClick={() => setIsEditingAddress(true)} className="px-5 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer">
                                Add Address
                            </button>
                        </div>
                    )}
                </div>
                {isEditingAddress && (
                    <div className="px-6 md:px-8 pb-6 md:pb-8 flex justify-end gap-3 animate-fade-in border-t border-slate-100 dark:border-slate-800 pt-6">
                        <button onClick={() => handleCancel('address')} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer">Cancel</button>
                        <button onClick={() => handleSave('address')} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer active:scale-95">Save Address</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Order History Tab ───────────────────────────────────────────────────────
function OrderHistoryTab({ user, setActivePage }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        (async () => {
            setLoading(true);
            try {
                const data = await api.get(`/orders/customer?customerName=${user.username}`);
                setOrders(data);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [user]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-1 block">Your History</span>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Order History</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Review and manage your recent transactions and shipments.</p>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="size-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800/30 p-12 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                        <span className="material-symbols-outlined text-5xl text-slate-200 dark:text-slate-700 mb-4 block">shopping_bag</span>
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
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
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
        </div>
    );
}

// ─── Settings Tab ────────────────────────────────────────────────────────────
function SettingsTab() {
    // Password change
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState('');
    const [pwLoading, setPwLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPwError('');
        setPwSuccess('');

        if (newPassword.length < 6) { setPwError('New password must be at least 6 characters.'); return; }
        if (newPassword !== confirmPassword) { setPwError('Passwords do not match.'); return; }

        setPwLoading(true);
        try {
            await api.put('/auth/change-password', { currentPassword, newPassword });
            setPwSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setPwError(err.response?.data || 'Failed to change password.');
        } finally {
            setPwLoading(false);
        }
    };

    // Theme
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

    const toggleTheme = () => {
        const root = document.querySelector('.flex.flex-col.min-h-screen');
        if (!root) return;
        if (isDark) {
            root.classList.remove('dark');
        } else {
            root.classList.add('dark');
        }
        setIsDark(!isDark);
    };

    // Email notification preferences (local state, UI-only)
    const [emailPrefs, setEmailPrefs] = useState({
        newProducts: true,
        orderStatus: true,
    });

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-1 block">Preferences</span>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Account Settings</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Manage your account preferences and security configuration.</p>
            </div>

            {/* Change Password */}
            <div className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[22px]">lock</span>
                        Change Password
                    </h3>
                </div>
                <form onSubmit={handleChangePassword} className="p-6 md:p-8 space-y-6">
                    {pwError && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-bold animate-fade-in flex items-center gap-3">
                            <span className="material-symbols-outlined">error</span>
                            {pwError}
                        </div>
                    )}
                    {pwSuccess && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-2xl text-sm font-bold animate-fade-in flex items-center gap-3">
                            <span className="material-symbols-outlined">check_circle</span>
                            {pwSuccess}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full h-12 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/30 rounded-xl px-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full h-12 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/30 rounded-xl px-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full h-12 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-primary/30 rounded-xl px-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all" required />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={pwLoading} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50">
                            {pwLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Theme Settings */}
            <div className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[22px]">palette</span>
                        Theme Settings
                    </h3>
                </div>
                <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/30 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px] text-slate-600 dark:text-slate-300">{isDark ? 'dark_mode' : 'light_mode'}</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode</p>
                                <p className="text-xs text-slate-500">Switch between light and dark appearance.</p>
                            </div>
                        </div>
                        <ToggleSwitch enabled={isDark} onToggle={toggleTheme} />
                    </div>
                </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[22px]">notifications</span>
                        Notification Preferences
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Get updates directly in your inbox.</p>
                </div>
                <div className="p-6 md:p-8 space-y-4">
                    <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/30 rounded-2xl">
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">New Product Announcements</p>
                            <p className="text-xs text-slate-500">Be the first to know about exciting new arrivals.</p>
                        </div>
                        <ToggleSwitch enabled={emailPrefs.newProducts} onToggle={() => setEmailPrefs(p => ({ ...p, newProducts: !p.newProducts }))} />
                    </div>
                    <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/30 rounded-2xl">
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Order Status Updates</p>
                            <p className="text-xs text-slate-500">Receive notifications when your order status changes.</p>
                        </div>
                        <ToggleSwitch enabled={emailPrefs.orderStatus} onToggle={() => setEmailPrefs(p => ({ ...p, orderStatus: !p.orderStatus }))} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Profile Component ──────────────────────────────────────────────────
export function Profile({ initialTab = 'profile-details' }) {
    const { setActivePage, user, updateProfile } = useAppContext();
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    useEffect(() => {
        if (!user) setActivePage('login');
    }, [user, setActivePage]);

    if (!user) return null;

    return (
        <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12 p-8 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 dark:hover:shadow-primary/20 hover:border-primary/20">
                <div className="relative group">
                    <div className="h-28 w-28 rounded-full bg-primary/20 border-4 border-primary/30 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[52px]">person</span>
                    </div>
                </div>
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                        {user.firstName ? `${user.firstName} ${user.lastName}` : user.username}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">{user.email}</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="sticky top-20 z-40 bg-slate-50/80 dark:bg-background-dark/80 backdrop-blur-md mb-12 py-4 -mx-4 px-4">
                <div className="flex gap-2 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl w-fit">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setActivePage(tab.id); }}
                            className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-primary dark:hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'profile-details' && <ProfileDetailsTab user={user} updateProfile={updateProfile} />}
            {activeTab === 'profile-orders' && <OrderHistoryTab user={user} setActivePage={setActivePage} />}
            {activeTab === 'profile-settings' && <SettingsTab />}

            <div className="h-24" />
        </div>
    );
}
