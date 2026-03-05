import { useState, useEffect } from 'react';
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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                // Construct parameters for search
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

                // Handle Page<ProductDTO>
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

        // Debounce fetching if needed, for simplicity we just fetch on dependency change
        const timeoutId = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedCategory, priceRange, inStockOnly, sortBy, currentPage, setTotalPages]);

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <span>Store</span>
                        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                        <span className="text-primary font-medium">Premium Catalog</span>
                    </nav>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Product Catalog</h2>
                    <p className="text-slate-500 mt-1">Discover our high-end curated selection of essentials.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button
                            className={`p-1.5 rounded shadow-sm ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <span className="material-symbols-outlined block">grid_view</span>
                        </button>
                        <button
                            className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                            onClick={() => setViewMode('list')}
                        >
                            <span className="material-symbols-outlined block">view_list</span>
                        </button>
                    </div>
                    <select
                        className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm font-medium py-2 pl-4 pr-10 focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="name,asc">Sort by: Name (A-Z)</option>
                        <option value="name,desc">Name (Z-A)</option>
                        <option value="price,asc">Price: Low to High</option>
                        <option value="price,desc">Price: High to Low</option>
                    </select>
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
                <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} viewMode={viewMode} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                        className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={`h-10 w-10 flex items-center justify-center rounded-lg border font-medium transition-all ${currentPage === i
                                    ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20 border-transparent'
                                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-800 hover:text-primary'
                                }`}
                            onClick={() => setCurrentPage(i)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage === totalPages - 1}
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            )}
        </>
    );
}
