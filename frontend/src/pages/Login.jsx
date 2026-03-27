import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export function Login() {
    const { login, setActivePage } = useAppContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(username, password);
        setLoading(false);
        if (!result.success) {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-6xl lg:min-h-[850px] grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 animate-fade-in">

                {/* Form Side */}
                <div className="p-8 md:p-12 flex flex-col justify-center order-2 lg:order-1">
                    <div className="max-w-xl mx-auto w-full">
                        <div className="mb-10 text-center lg:text-left">
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Welcome Back!</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-bold">Please enter your details to sign in.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-shake">
                                <span className="material-symbols-outlined text-red-500">error</span>
                                <p className="text-sm font-black text-red-500">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">person</span>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onFocus={(e) => {
                                            const val = e.target.value;
                                            e.target.value = '';
                                            e.target.value = val;
                                        }}
                                        placeholder="Enter your username"
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Password</label>
                                    <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Forgot password?</button>
                                </div>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={(e) => {
                                            const val = e.target.value;
                                            e.target.value = '';
                                            e.target.value = val;
                                        }}
                                        placeholder="••••••••"
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 py-2">
                                <input id="remember" type="checkbox" className="size-4 accent-primary rounded cursor-pointer" />
                                <label htmlFor="remember" className="text-sm font-bold text-slate-500 dark:text-slate-400 cursor-pointer select-none">Remember me for 30 days</label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-primary hover:bg-[#D9631B] text-white font-black rounded-2xl shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70"
                            >
                                {loading ? (
                                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 flex items-center gap-4">
                            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">or continue with</span>
                            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
                        </div>

                        <div className="mt-8">
                            <button className="w-full h-14 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="size-5" alt="Google" />
                                <span className="text-sm font-black text-slate-700 dark:text-slate-300">Continue with Google</span>
                            </button>
                        </div>

                        <p className="mt-10 text-center text-sm font-bold text-slate-500 dark:text-slate-400">
                            Don't have an account?{' '}
                            <button onClick={() => setActivePage('register')} className="text-primary hover:underline font-black cursor-pointer">Create Account</button>
                        </p>
                    </div>
                </div>

                {/* Visual Side */}
                <div className="hidden lg:block relative overflow-hidden bg-slate-950 p-12 flex flex-col justify-between order-1 lg:order-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-primary/20 opacity-60"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-10 cursor-pointer group" onClick={() => setActivePage('home')}>
                            <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/30">
                                <span className="material-symbols-outlined text-white text-[20px] block">diamond</span>
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight select-none">Budal</h2>
                        </div>
                        <h3 className="text-5xl font-black text-white leading-tight mb-6 tracking-tighter">
                            Elevate your <br />shopping <br />experience.
                        </h3>
                    </div>

                    <div className="relative z-10 flex items-center gap-12 mt-12 pb-4">
                        <div>
                            <p className="text-3xl font-black text-white/90">50k+</p>
                            <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Active Users</p>
                        </div>
                        <div className="w-px h-10 bg-white/10"></div>
                        <div>
                            <p className="text-3xl font-black text-white/90">4.9/5</p>
                            <p className="text-xs font-bold text-white/30 uppercase tracking-widest">App Rating</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
