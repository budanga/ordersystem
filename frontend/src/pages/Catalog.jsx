import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import api from '../api';

export function Catalog() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Assuming your backend returns a list of ProductDTO at /api/products
                const data = await api.get('/products'); // Destructure data from the response
                // Handle if spring boot returns an array directly, or an object containing it
                const productList = Array.isArray(data) ? data : data.content || [];
                setProducts(productList);
                setError(null);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load catalog. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
                        <button className="p-1.5 bg-white dark:bg-slate-700 rounded shadow-sm text-primary">
                            <span className="material-symbols-outlined block">grid_view</span>
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <span className="material-symbols-outlined block">view_list</span>
                        </button>
                    </div>
                    <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm font-medium py-2 pl-4 pr-10 focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
                        <option>Sort by: Popularity</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Newest Arrivals</option>
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
                    No products found in this category.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            <div className="mt-12 flex items-center justify-center gap-2">
                <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-all">
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20">1</button>
                <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-800 transition-all font-medium hover:text-primary">2</button>
                <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-800 transition-all font-medium hover:text-primary">3</button>
                <span className="text-slate-400 mx-1">...</span>
                <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-800 transition-all font-medium hover:text-primary">12</button>
                <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-all">
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
        </>
    );
}
