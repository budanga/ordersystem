import { useAppContext } from '../context/AppContext';

export function Home() {
    const { setSelectedCategory, setActivePage, setSearchQuery } = useAppContext();

    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName);
        setSearchQuery(''); // clear potential left over search text that user typed but not submitted
        setActivePage('catalog');
    };

    const categories = [
        {
            name: 'Tech',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBo7-XzSbJic07dcA5lAXTn-ZkjXKZ7xsfvjPM5ODBt7sz4ZcC4HegNsojTlnVvXlXKlafThGYdqub9_jvp8gOB5KlZN0sI4dLO7SshopFB5eNWmruif_1yy9L4J5iyOu7aIfOQxFypc8Jm2-hgHYqMbbs-TmKx7lCJZT948aa54wyTgG4ptVhrTMsCtQdtDR1eM3TlFxJa2PYPhlMKhNipbIJXKYMJKicx2FW18NaZVX8D5MwI0lJsdMIdg0KaLd1Q_ovZa5xY8k24"
        },
        {
            name: 'Lifestyle',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_Gv8SDRsdk--9AcDlMTEU6sFaWf8WXg396OzyxvvJSnrJKJuC4qHyeZ5GxJUGKnnRjYg3UVWYQKb-R917EkQsp7J9Oj4cEFPv8ELYaJ_sic9uOqYwG0hO0FqOnGhlVCoix6SmP4wbuJQcBqpF_uu21iZySHnQYBPM90T8Gj5lHYMP2T5bceg18XJr-2K1GHpL8TjzPHw2XlDWDm0jd8a_i3i_TZRV8JAjeHKHvVyPp9XwoBma0oiHqXyVLeOQWpIrfj8_2-8SXmK5"
        },
        {
            name: 'Home',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRnEgXGLhnHhLtuXr-wqcjcNbSUTfUmpJieqInsDgLN669r04zg9WPLuSQmbkUWRgyctCeoU2Ot1Y7z4JAd09Cd06RgVA85D5q0ogCmx26VJ1qkWXg6eE6cKPXnaWUjYq65l5o3Z2NjGnoM2eubUaEBQ-RrWRwZBy38TnGzUkaQYXNIZIZiPd47j3I-PNZFoazc8l9FQiNl1UiZ7KWL240nJM57h3fwa6j_6HebPkBMI4eM3lOGs9YQbGQTKbZaClhJjuKaukBXTLl"
        },
        {
            name: 'Accessories',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1Jz2Trem0Ka-JqRyKGEg2YTzxxwj16cRuUXrxDcPt8AoGsKnCGpV3BXetiE_EONMq32Dq-5h7QqjcLHbYz13NoMKaw13wLNDyvkOGKEkupTLRvvo0kDZsy4Os2TOg4WVpO8Nrrra2TgUnIGo9co284ANdJoskHIrGRTvUL6UVfcuYp0_yHleb-BdEze-QE4dwcMO--b9ij85EGjX2CoWJvIG34WdCyVHSfyEiUVcXGSM_Guvo0bFkHjKQbs2yKWJI6PLNZoofTsIn"
        },
        {
            name: 'Fashion',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQP2XRzMXdGoEgdwz4jK4pDkBWm4JZ6uwdMq-BJDHMhPVQZj67N5yhIQ0scAzyAFzLkzS-oSb_erlIHaZpwGd6hEtpQle30FqbBg-RLqTEkvTepNtOF5Xtqqnlrsxdona4cf4-H7c8cnrHqpBNjM7kQNkPr49vFGwAtDpD4q5ywsEpcGS5FQ2IayvNWa6JDSBcp8jy-9T-zc5f8dZAGMz9Z9ZNQe5FJG1lBLDXh_54AGwD0QoIN_p29aVKanOMegRBCsOtKlg3cIen"
        },
        {
            name: 'Wellness',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWhUJcf5w38OHAJpmm_CnFqi0yfX8tyv1TF6h0sBA6Sbwn-mvouEgWFXrmO1XSKc92EFD9vfd5aOblweKijSP7sch5c3MsHBrta5qN0i5vcMY6UT9G_kC-fL_9R5Hu0pnhEbGen8dNovhZqku0E3nCZd4fgCo2rubB_pwhOS8AO-lBCytbVYtGo4K7T5GaldgwoAYV3h2z_WkztoFmHxNk-9dXEUT2H5J3ZWBOXak4Fu2yq8j_rcoZZtnSWhMaBVGvAa_Huse_S7Zf"
        }
    ];

    return (
        <div className="w-full max-w-[1280px] mx-auto py-12 lg:py-16">
            <div className="text-center mb-16 animate-dropdown">
                <h1 className="text-6xl lg:text-8xl font-extrabold text-primary mb-4 tracking-tighter">Budal</h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg lg:text-xl font-light tracking-[0.2em] uppercase">Elegance in every choice</p>

                <div className="mt-8 flex justify-center px-4">
                    <div className="w-full max-w-4xl h-0.5 bg-primary/20 rounded-full relative">
                        <div className="absolute inset-0 w-1/3 h-full bg-primary rounded-full animate-pulse mx-auto"></div>
                    </div>
                </div>
            </div>

            {/* Full width All category banner */}
            <div className="mb-8 px-4 md:px-0">
                <div
                    onClick={() => handleCategoryClick('')}
                    className="w-full group relative h-[300px] md:h-[450px] rounded-3xl overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 animate-dropdown"
                    style={{ animationDelay: '0ms', animationFillMode: 'both' }}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                        style={{
                            backgroundImage: `linear-gradient(to top, rgba(18, 18, 18, 0.8), rgba(18, 18, 18, 0.2)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070")`
                        }}
                    />

                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                        <span className="text-white text-xs font-bold tracking-[0.4em] uppercase mb-3 text-center">Shop the complete collection</span>
                        <div className="w-12 h-1 bg-primary rounded-full shadow-[0_0_15px_rgba(242,115,36,0.5)]"></div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <h3 className="text-white text-5xl lg:text-8xl font-extralight tracking-[0.3em] uppercase mb-2 drop-shadow-2xl">
                                All
                            </h3>
                            <div className="h-px w-0 group-hover:w-full bg-white/30 transition-all duration-700 mx-auto"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-4 md:px-0">
                {(() => {
                    let cols = 1;
                    if (typeof window !== 'undefined') {
                        if (window.innerWidth >= 768) cols = 2;
                    }
                    const getSortValue = (c, r) => {
                        const L = Math.max(c, r);
                        const d = (c === L) ? r : c;
                        const isTopRightBranch = (c === L);
                        return L * 1000 + d * 2 + (isTopRightBranch ? 0 : 1);
                    };
                    const indexToRank = {};
                    if (cols > 1) {
                        const ranks = categories.map((_, i) => ({
                            index: i,
                            val: getSortValue(i % cols, Math.floor(i / cols))
                        }));
                        ranks.sort((a, b) => a.val - b.val);
                        ranks.forEach((r, rank) => {
                            indexToRank[r.index] = rank;
                        });
                    }

                    return categories.map((category, index) => {
                        const isEvenRow = Math.floor(index / 2) % 2 === 0;
                        const isFirstInRow = index % 2 === 0;

                        let colSpan = "md:col-span-6"; // Default
                        if (isEvenRow) {
                            colSpan = isFirstInRow ? "md:col-span-7" : "md:col-span-5";
                        } else {
                            colSpan = isFirstInRow ? "md:col-span-5" : "md:col-span-7";
                        }

                        const delayIndex = cols > 1 ? indexToRank[index] : index;

                        return (
                            <div
                                key={category.name}
                                onClick={() => handleCategoryClick(category.name)}
                                className={`group relative ${isFirstInRow ^ isEvenRow ? 'aspect-[4/3]' : 'aspect-square'} md:aspect-auto md:h-[500px] rounded-3xl overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 animate-dropdown ${colSpan}`}
                                style={{ animationDelay: `${(delayIndex + 1) * 100}ms`, animationFillMode: 'both' }}
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                    style={{
                                        backgroundImage: `linear-gradient(to top, rgba(18, 18, 18, 0.9), rgba(18, 18, 18, 0.1)), url("${category.image}")`
                                    }}
                                />

                                <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                    <span className="text-white text-xs font-bold tracking-[0.4em] uppercase mb-3">Explore Collection</span>
                                    <div className="w-12 h-1 bg-primary rounded-full shadow-[0_0_15px_rgba(242,115,36,0.5)]"></div>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <h3 className="text-white text-4xl font-extralight tracking-[0.3em] uppercase mb-2 drop-shadow-2xl">
                                            {category.name}
                                        </h3>
                                        <div className="h-px w-0 group-hover:w-full bg-white/30 transition-all duration-700 mx-auto"></div>
                                    </div>
                                </div>
                            </div>
                        );
                    });
                })()}
            </div>

            <footer className="mt-24 pt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500">
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[20px] block">diamond</span>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-400">Budal</span>
                </div>

                <div className="flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em]">
                    <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms</a>
                    <a href="#" className="hover:text-primary transition-colors">Support</a>
                </div>

                <p className="text-xs font-medium">© 2026 Budal. All rights reserved.</p>
            </footer>
        </div>
    );
}
