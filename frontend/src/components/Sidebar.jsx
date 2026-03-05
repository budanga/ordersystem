import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

export function Sidebar() {
    const {
        selectedCategory, setSelectedCategory,
        priceRange, setPriceRange,
        inStockOnly, setInStockOnly,
        resetFilters,
        categories
    } = useAppContext();

    const [isDraggingMin, setIsDraggingMin] = useState(false);
    const [isDraggingMax, setIsDraggingMax] = useState(false);

    const sliderRefMin = useRef(null);
    const sliderRefMax = useRef(null);

    const handleMouseMove = (e) => {
        if (!isDraggingMin && !isDraggingMax) return;

        const slider = isDraggingMin ? sliderRefMin.current : sliderRefMax.current;
        if (!slider) return;

        const rect = slider.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        let percentage = Math.max(0, Math.min(1, x / width));

        const newValue = Math.round((percentage * 5000) / 50) * 50;

        if (isDraggingMin) {
            // Min cannot exceed Max
            if (newValue < priceRange[1]) {
                setPriceRange([newValue, priceRange[1]]);
            } else {
                // Pin at Max - 50 to prevent overlap if desired or just Pin at Max
                setPriceRange([priceRange[1], priceRange[1]]);
            }
        } else if (isDraggingMax) {
            // Max cannot be below Min
            if (newValue > priceRange[0]) {
                setPriceRange([priceRange[0], newValue]);
            } else {
                setPriceRange([priceRange[0], priceRange[0]]);
            }
        }
    };

    const handleMouseUp = () => {
        setIsDraggingMin(false);
        setIsDraggingMax(false);
    };

    useEffect(() => {
        if (isDraggingMin || isDraggingMax) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingMin, isDraggingMax, priceRange]);

    return (
        <aside className="w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 p-6 hidden lg:block overflow-y-auto">
            <div className="space-y-8 text-slate-900 dark:text-white">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Categories</h3>
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                checked={selectedCategory === ''}
                                onChange={() => setSelectedCategory('')}
                                className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-transparent"
                                type="radio"
                                name="category"
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">All Collections</span>
                        </label>
                        {categories.map(cat => (
                            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    checked={selectedCategory === cat}
                                    onChange={() => setSelectedCategory(cat)}
                                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-transparent"
                                    type="radio"
                                    name="category"
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Min Price Slider */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Min Price</h3>
                            <span className="text-xs font-mono text-primary">${priceRange[0]}</span>
                        </div>
                        <div
                            ref={sliderRefMin}
                            className="relative h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full cursor-pointer"
                            onClick={(e) => {
                                if (e.target.closest('.slider-thumb')) return;
                                const rect = sliderRefMin.current.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const percentage = Math.max(0, Math.min(1, x / rect.width));
                                const newValue = Math.round((percentage * 5000) / 50) * 50;
                                if (newValue <= priceRange[1]) setPriceRange([newValue, priceRange[1]]);
                            }}
                        >
                            <div
                                className="slider-thumb absolute top-1/2 h-5 w-5 bg-primary border-2 border-white dark:border-slate-900 rounded-full shadow-lg cursor-grab active:cursor-grabbing z-10"
                                style={{
                                    left: `${(priceRange[0] / 5000) * 100}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                                onMouseDown={(e) => { e.preventDefault(); setIsDraggingMin(true); }}
                            ></div>
                        </div>
                    </div>

                    {/* Max Price Slider */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Max Price</h3>
                            <span className="text-xs font-mono text-primary">${priceRange[1]}</span>
                        </div>
                        <div
                            ref={sliderRefMax}
                            className="relative h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full cursor-pointer"
                            onClick={(e) => {
                                if (e.target.closest('.slider-thumb')) return;
                                const rect = sliderRefMax.current.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const percentage = Math.max(0, Math.min(1, x / rect.width));
                                const newValue = Math.round((percentage * 5000) / 50) * 50;
                                if (newValue >= priceRange[0]) setPriceRange([priceRange[0], newValue]);
                            }}
                        >
                            <div
                                className="slider-thumb absolute top-1/2 h-5 w-5 bg-primary border-2 border-white dark:border-slate-900 rounded-full shadow-lg cursor-grab active:cursor-grabbing z-10"
                                style={{
                                    left: `${(priceRange[1] / 5000) * 100}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                                onMouseDown={(e) => { e.preventDefault(); setIsDraggingMax(true); }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Status</h3>
                    <div className="space-y-3">
                        <label className="flex items-center justify-between cursor-pointer group">
                            <span className="text-sm text-slate-600 dark:text-slate-300">In Stock Only</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                    className="sr-only peer"
                                    type="checkbox"
                                />
                                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            </div>
                        </label>
                    </div>
                </div>

                <button
                    onClick={resetFilters}
                    className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold rounded-xl hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                    Reset All Filters
                </button>
            </div>
        </aside>
    );
}
