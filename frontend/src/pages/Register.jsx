import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export function Register() {
    const { register, setActivePage } = useAppContext();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const result = await register(formData);
        setLoading(false);
        if (!result.success) {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 animate-fade-in">
                
                {/* Form Side */}
                <div className="p-8 md:p-12 flex flex-col justify-center order-2 lg:order-1">
                    <div className="max-w-xl mx-auto w-full">
                        <div className="mb-8 text-center lg:text-left">
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Create Account</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-bold">Join the Budal ecosystem today.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-shake">
                                <span className="material-symbols-outlined text-red-500">error</span>
                                <p className="text-sm font-black text-red-500">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">person</span>
                                        <input
                                            name="username"
                                            type="text"
                                            required
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Pick a username"
                                            className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">mail</span>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your@email.com"
                                            className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">badge</span>
                                        <input
                                            name="firstName"
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="John"
                                            className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">badge</span>
                                        <input
                                            name="lastName"
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">call</span>
                                    <input
                                        name="phoneNumber"
                                        type="tel"
                                        required
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Address</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-10 text-slate-400 group-focus-within:text-primary transition-colors">location_on</span>
                                    <textarea
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="123 Street Name, City, Country"
                                        className="w-full min-h-[80px] py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">verified_user</span>
                                        <input
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 py-1">
                                <input id="terms" type="checkbox" required className="size-4 accent-primary rounded cursor-pointer" />
                                <label htmlFor="terms" className="text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer select-none">I agree to the <span className="text-primary hover:underline">Terms of Service</span></label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-primary hover:bg-[#D9631B] text-white font-black rounded-2xl shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70"
                            >
                                {loading ? (
                                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm font-bold text-slate-500 dark:text-slate-400">
                            Already have an account?{' '}
                            <button onClick={() => setActivePage('login')} className="text-primary hover:underline font-black cursor-pointer">Sign In</button>
                        </p>
                    </div>
                </div>

                {/* Visual Side */}
                <div className="hidden lg:block relative overflow-hidden bg-slate-900 p-12 flex flex-col justify-between order-1 lg:order-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-primary opacity-40"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
                    
                    <div className="relative z-10 text-right">
                        <div className="flex items-center justify-end gap-2 mb-10 cursor-pointer group" onClick={() => setActivePage('home')}>
                            <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/30">
                                <span className="material-symbols-outlined text-white text-[20px] block">diamond</span>
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight select-none">Budal</h2>
                        </div>
                        <h3 className="text-5xl font-black text-white leading-tight mb-6 tracking-tighter">
                            A world of <br />possibilities <br />awaits.
                        </h3>
                        <p className="text-white/60 text-lg font-medium ml-auto max-w-md">
                            Register now to unlock exclusive features, tailored recommendations, and seamless checkout.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center justify-end gap-12">
                        <div className="text-right">
                            <p className="text-3xl font-black text-white">24/7</p>
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Support Team</p>
                        </div>
                        <div className="w-px h-10 bg-white/10"></div>
                        <div className="text-right">
                            <p className="text-3xl font-black text-white">100%</p>
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Satisfaction</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
