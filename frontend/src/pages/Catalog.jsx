import { useState, useEffect, useRef } from 'react';
import { ProductCard } from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';
import api from '../api';

export function Catalog() {
    const {
        viewMode, setViewMode,
        searchQuery,
        selectedCategory,
        priceRange,
        inStockOnly,
        sortBy, setSortBy,
        currentPage, setCurrentPage,
        totalPages, setTotalPages
    } = useAppContext();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sort Dropdown UI State
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [shouldRenderSort, setShouldRenderSort] = useState(false);
    const sortRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSortOpen && sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSortOpen]);

    useEffect(() => {
        if (isSortOpen) {
            setShouldRenderSort(true);
        } else {
            const timer = setTimeout(() => setShouldRenderSort(false), 120);
            return () => clearTimeout(timer);
        }
    }, [isSortOpen]);

    const sortOptions = {
        'name,asc': 'Name (A-Z)',
        'name,desc': 'Name (Z-A)',
        'price,asc': 'Price: Low to High',
        'price,desc': 'Price: High to Low'
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const params = {
                    page: currentPage,
                    size: 12,
                    sort: sortBy
                };

                if (searchQuery) params.name = searchQuery;
                if (selectedCategory) params.category = selectedCategory;
                if (priceRange[0] !== null) params.minPrice = priceRange[0];
                if (priceRange[1] !== null) params.maxPrice = priceRange[1];
                if (inStockOnly) params.inStock = true;

                const data = await api.get('/products/search', { params });
                const productList = data.content || [];
                setProducts(productList);

                if (data.totalPages !== undefined) {
                    setTotalPages(data.totalPages);
                }

                setError(null);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load catalog. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedCategory, priceRange, inStockOnly, sortBy, currentPage, setTotalPages]);

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded inline-block mb-1">Store</span>
                    <h2 className="text-5xl font-extrabold text-slate-900 dark:text-[#F2F8FC] leading-none">Product Catalog</h2>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button
                            className={`h-9 w-9 flex items-center justify-center rounded shadow-sm transition-all active:scale-90 cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <span className="material-symbols-outlined text-[20px] block">grid_view</span>
                        </button>
                        <button
                            className={`h-9 w-9 flex items-center justify-center rounded transition-all active:scale-90 cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                            onClick={() => setViewMode('list')}
                        >
                            <span className="material-symbols-outlined text-[20px] block">view_list</span>
                        </button>
                    </div>

                    {/* Custom Sort Dropdown */}
                    <div className="relative min-w-[200px]" ref={sortRef}>
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="w-full flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium py-2 px-4 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer active:scale-98"
                        >
                            <span>{sortOptions[sortBy]}</span>
                            <span className={`material-symbols-outlined transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>

                        {shouldRenderSort && (
                            <div className={`absolute right-0 top-full mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-20 py-2 origin-top ${isSortOpen ? 'animate-dropdown' : 'animate-dropdown-out'}`}>
                                {Object.entries(sortOptions).map(([value, label]) => (
                                    <button
                                        key={value}
                                        onClick={() => {
                                            setSortBy(value);
                                            setIsSortOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${sortBy === value ? 'text-primary bg-primary/5' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20 text-slate-500">
                    <span className="material-symbols-outlined animate-spin mr-2">refresh</span>
                    Loading collection...
                </div>
            ) : error ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 text-center">
                    {error}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                    No products found matching your criteria.
                </div>
            ) : (
                <div
                    key={viewMode}
                    className={`${viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8" : "flex flex-col gap-6"} animate-dropdown origin-top`}
                >
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} viewMode={viewMode} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                        className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={`h-10 w-10 flex items-center justify-center rounded-lg border font-medium transition-all cursor-pointer ${currentPage === i
                                ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20 border-transparent'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-800 hover:text-primary'
                                }`}
                            onClick={() => setCurrentPage(i)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage === totalPages - 1}
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            )}
        </div>
    );
}
