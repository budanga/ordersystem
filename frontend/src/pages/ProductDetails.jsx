import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export function ProductDetails() {
    const { selectedProduct, addToCart, setActivePage } = useAppContext();
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(selectedProduct?.imageUrl || "");

    if (!selectedProduct) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-slate-500 mb-4">Product not found</p>
                <button
                    onClick={() => setActivePage('catalog')}
                    className="text-primary font-bold hover:underline"
                >
                    Back to Catalog
                </button>
            </div>
        );
    }

    const isOut = selectedProduct.stock <= 0;
    const isLow = selectedProduct.stock > 0 && selectedProduct.stock <= 5;

    const handleAddToCart = () => {
        if (isOut) return;
        for (let i = 0; i < quantity; i++) {
            addToCart(selectedProduct);
        }
    };

    // Use selectedProduct.imageUrl for initial state if mainImage is empty
    const currentImage = mainImage || selectedProduct.imageUrl || "https://placehold.co/800x800/121212/F27324?text=Product+Image";

    // Mock additional images based on main image if backend doesn't provide a gallery
    const galleryItems = [
        selectedProduct.imageUrl,
        "https://placehold.co/800x800/121212/F27324?text=Detail+1",
        "https://placehold.co/800x800/121212/F27324?text=Detail+2",
        "https://placehold.co/800x800/121212/F27324?text=Detail+3"
    ].filter(Boolean);

    return (
        <div className="max-w-7xl mx-auto w-full px-6 py-8 md:px-10 animate-dropdown">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 mb-8 text-sm font-medium">
                <button
                    onClick={() => setActivePage('catalog')}
                    className="text-slate-500 dark:text-slate-400 hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Catalog
                </button>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    {selectedProduct.category || 'Audio Essentials'}
                </span>
            </nav>

            {/* Main Product Section: Grid structured to align Gallery and Info components */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-4 mb-24">
                
                {/* 1. Large Image & Core Info */}
                <div className="aspect-square w-full rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 self-start transition-all duration-500">
                    <img
                        className="w-full h-full object-cover animate-fade-in"
                        key={currentImage}
                        src={currentImage}
                        alt={selectedProduct.name}
                    />
                </div>

                <div className="flex flex-col justify-start">
                    <div className="flex items-center gap-3 mb-6">
                        {isOut ? (
                            <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full">Sold Out</span>
                        ) : isLow ? (
                            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-full">Low Stock</span>
                        ) : (
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full">In Stock</span>
                        )}
                        <span className="text-slate-500 dark:text-slate-400 text-xs font-bold font-mono tracking-tighter uppercase">ID: {selectedProduct.id}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-none">
                        {selectedProduct.name}
                    </h1>

                    <div className="flex items-center gap-6 mb-10">
                        <span className="text-4xl font-black text-primary">${Number(selectedProduct.price).toFixed(2)}</span>
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full">
                            {[1, 2, 3, 4, 5].map(s => (
                                <span key={s} className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            ))}
                            <span className="ml-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">4.8 (128 Reviews)</span>
                        </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-15 font-medium">
                        {selectedProduct.description || "Experience perfection in every detail. This premium item combines cutting-edge technology with timeless design. Perfect for those who seek the highest quality and absolute performance in their daily lives."}
                    </p>

                    <div className="mt-auto pt-6">
                        {!isOut && (
                            <div className="flex flex-col sm:flex-row gap-5">
                                <div className="flex items-center justify-between border border-slate-200 dark:border-slate-800 rounded-2xl p-1 bg-slate-100 dark:bg-slate-900/50 min-w-[160px]">
                                    <button
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        className="size-12 flex items-center justify-center text-slate-500 hover:text-primary transition-colors cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined">remove</span>
                                    </button>
                                    <span className="text-xl font-black text-slate-900 dark:text-white w-8 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(prev => prev + 1)}
                                        className="size-12 flex items-center justify-center text-slate-500 hover:text-primary transition-colors cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-primary hover:bg-[#D9631B] text-white font-black h-14 rounded-2xl transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-98 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined">shopping_cart</span>
                                    Add to Cart
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Gap/Line Row: Aligns separator with gallery gap */}
                <div className="hidden lg:block h-px"></div>
                <div className="hidden lg:block border-t border-slate-200 dark:border-slate-800"></div>

                {/* 3. Thumbnails & Shipping Info */}
                <div className="grid grid-cols-4 gap-4">
                    {galleryItems.map((img, i) => (
                        <div 
                            key={i} 
                            onClick={() => setMainImage(img)}
                            className={`aspect-square rounded-2xl border-2 transition-all duration-300 overflow-hidden cursor-pointer ${currentImage === img ? 'border-primary ring-4 ring-primary/10' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}
                        >
                            <img
                                src={img}
                                className={`w-full h-full object-cover transition-opacity duration-300 ${currentImage === img ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                                alt={`Thumbnail ${i + 1}`}
                            />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4">
                    <div className="flex items-center gap-4 group">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <span className="material-symbols-outlined">local_shipping</span>
                        </div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <span className="material-symbols-outlined">verified_user</span>
                        </div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">2-Year Warranty</span>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            <section className="mt-32 pt-20 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <span className="text-[10px] text-primary font-bold uppercase tracking-[0.3em] mb-1 block">Collection</span>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">You May Also Like</h3>
                    </div>
                    <button
                        onClick={() => setActivePage('catalog')}
                        className="text-primary font-black text-sm hover:underline tracking-widest uppercase flex items-center gap-2 cursor-pointer"
                    >
                        View all
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 opacity-40">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="aspect-[3/4] bg-slate-100 dark:bg-slate-900 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            </section>

            {/* Product Description & Specifications Section */}
            <section className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-16 pt-20 border-t border-slate-200 dark:border-slate-800">
                <div className="lg:col-span-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Product Description</h3>
                    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 space-y-6 text-lg leading-relaxed">
                        <p>
                            {selectedProduct.description || "This product represents our commitment to excellence. Engineered with precision and designed for the discerning individual, it offers a harmonious blend of form and factor."}
                        </p>
                        <p>
                            Every component has been meticulously selected to ensure durability and performance. From the premium materials used in its construction to the advanced technology integrated within, every aspect of this product has been optimized to provide an unparalleled user experience.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-8 border border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">Specifications</h3>
                    <ul className="space-y-4">
                        <li className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800/50">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Model</span>
                            <span className="text-sm font-black text-slate-900 dark:text-white">LUX-{selectedProduct.id}</span>
                        </li>
                        <li className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800/50">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Category</span>
                            <span className="text-sm font-black text-slate-900 dark:text-white">{selectedProduct.category || 'Premium'}</span>
                        </li>
                        <li className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800/50">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Dimensions</span>
                            <span className="text-sm font-black text-slate-900 dark:text-white">18.5 x 21 x 8 cm</span>
                        </li>
                        <li className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800/50">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Weight</span>
                            <span className="text-sm font-black text-slate-900 dark:text-white">285g</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Warranty</span>
                            <span className="text-sm font-black text-slate-900 dark:text-white">2 Years</span>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}
