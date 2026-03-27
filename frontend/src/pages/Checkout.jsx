import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export function Checkout() {
    const { cart, user, checkout, activePage, setActivePage } = useAppContext();
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
    const [isProcessing, setIsProcessing] = useState(false);

    // Form states
    const [shippingDetails, setShippingDetails] = useState({
        firstName: '', lastName: '', address: '', city: '', postalCode: '', email: user?.email || '', subscribe: false
    });
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '', expiryDate: '', cvv: ''
    });

    const handleExpiryChange = (e) => {
        let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (val.length === 1 && parseInt(val) >= 2 && parseInt(val) <= 9) {
            val = '0' + val;
        }
        if (val.length >= 2) {
            val = val.substring(0, 2) + '/' + val.substring(2, 4);
        }
        setPaymentDetails({ ...paymentDetails, expiryDate: val });
    };

    const handleCardNumberChange = (e) => {
        let val = e.target.value.replace(/\D/g, ''); // Digits only
        if (val.length > 16) val = val.substring(0, 16);
        // Add spaces every 4 digits
        let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
        setPaymentDetails({ ...paymentDetails, cardNumber: formatted });
    };

    const handleCvvChange = (e) => {
        let val = e.target.value.replace(/\D/g, ''); // Digits only
        if (val.length > 4) val = val.substring(0, 4);
        setPaymentDetails({ ...paymentDetails, cvv: val });
    };
    
    // Auto-fill names if user is present
    useEffect(() => {
        if (user) {
            setShippingDetails(prev => ({
                ...prev,
                firstName: prev.firstName || user.firstName || '',
                lastName: prev.lastName || user.lastName || '',
                address: prev.address || user.address || '',
                email: prev.email || user.email || ''
            }));
        }
    }, [user]);

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxes = cartTotal * 0.08; // Example tax
    const finalTotal = cartTotal + taxes;

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        const success = await checkout();
        setIsProcessing(false);
        if (success) {
            setActivePage('profile-orders');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-10 min-h-[60vh]">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">shopping_cart_off</span>
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-slate-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
                <button onClick={() => setActivePage('catalog')} className="bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-primary-hover shadow-lg">
                    Return to Shop
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full max-w-[1200px] mx-auto w-full">
            <div className="flex flex-col lg:flex-row gap-12 w-full">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col gap-10">
                        <header>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#f2f8fc] mb-2">
                                {step === 1 ? 'Checkout' : step === 2 ? 'Payment Method' : 'Review your order'}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400">
                                {step === 1 ? 'Where should we send your order?' : 
                                 step === 2 ? "Choose how you'd like to pay for your Budal order." : 
                                 'Please confirm your details before completing the purchase.'}
                            </p>
                        </header>

                        {/* Step 1: Shipping */}
                        {step === 1 && (
                            <div className="space-y-10">
                                <section>
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="material-symbols-outlined text-primary">mail</span>
                                        <h2 className="text-slate-900 dark:text-[#f2f8fc] text-xl font-bold">Contact Information</h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                                            <input 
                                                className="w-full bg-white dark:bg-[#1c1c1c] border border-slate-200 dark:border-[#334155] rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-[#f2f8fc] transition-all" 
                                                type="email" 
                                                value={shippingDetails.email}
                                                onChange={e => setShippingDetails({...shippingDetails, email: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="material-symbols-outlined text-primary">local_shipping</span>
                                        <h2 className="text-slate-900 dark:text-[#f2f8fc] text-xl font-bold">Shipping Address</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">First Name</label>
                                            <input className="w-full bg-white dark:bg-[#1c1c1c] border border-slate-200 dark:border-[#334155] rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-[#f2f8fc]" type="text" value={shippingDetails.firstName} onChange={e => setShippingDetails({...shippingDetails, firstName: e.target.value})} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Name</label>
                                            <input className="w-full bg-white dark:bg-[#1c1c1c] border border-slate-200 dark:border-[#334155] rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-[#f2f8fc]" type="text" value={shippingDetails.lastName} onChange={e => setShippingDetails({...shippingDetails, lastName: e.target.value})} />
                                        </div>
                                        <div className="md:col-span-2 flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Address</label>
                                            <input className="w-full bg-white dark:bg-[#1c1c1c] border border-slate-200 dark:border-[#334155] rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-[#f2f8fc]" type="text" value={shippingDetails.address} onChange={e => setShippingDetails({...shippingDetails, address: e.target.value})} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">City</label>
                                            <input className="w-full bg-white dark:bg-[#1c1c1c] border border-slate-200 dark:border-[#334155] rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-[#f2f8fc]" type="text" value={shippingDetails.city} onChange={e => setShippingDetails({...shippingDetails, city: e.target.value})} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Postal Code</label>
                                            <input className="w-full bg-white dark:bg-[#1c1c1c] border border-slate-200 dark:border-[#334155] rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-[#f2f8fc]" type="text" value={shippingDetails.postalCode} onChange={e => setShippingDetails({...shippingDetails, postalCode: e.target.value})} />
                                        </div>
                                    </div>
                                </section>
                                <div className="pt-6">
                                    <button onClick={() => setStep(2)} className="w-full md:w-auto px-10 py-4 bg-primary text-white font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer">
                                        Continue to Payment
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div className="space-y-10">
                                <div className="bg-slate-50 dark:bg-[#222222] rounded-xl border-2 border-primary p-6 relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>credit_card</span>
                                            <span className="font-bold text-lg text-slate-900 dark:text-[#f2f8fc]">Credit or Debit Card</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-6 w-10 bg-white dark:bg-[#2c2c2c] rounded flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">VISA</span>
                                            </div>
                                            <div className="h-6 w-10 bg-white dark:bg-[#2c2c2c] rounded flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">MC</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Card Number</label>
                                            <div className="relative">
                                                <input 
                                                    className="w-full bg-white dark:bg-[#2c2c2c] border border-slate-200 dark:border-[#334155] rounded-xl py-3 px-4 text-slate-900 dark:text-[#f2f8fc] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" 
                                                    placeholder="0000 0000 0000 0000" 
                                                    type="text" 
                                                    value={paymentDetails.cardNumber}
                                                    onChange={handleCardNumberChange}
                                                    maxLength={19}
                                                />
                                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Expiry Date</label>
                                            <input 
                                                className="w-full bg-white dark:bg-[#2c2c2c] border border-slate-200 dark:border-[#334155] rounded-xl py-3 px-4 text-slate-900 dark:text-[#f2f8fc] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" 
                                                placeholder="MM / YY" 
                                                type="text" 
                                                value={paymentDetails.expiryDate}
                                                onChange={handleExpiryChange}
                                                maxLength={5}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">CVV</label>
                                            <input 
                                                className="w-full bg-white dark:bg-[#2c2c2c] border border-slate-200 dark:border-[#334155] rounded-xl py-3 px-4 text-slate-900 dark:text-[#f2f8fc] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" 
                                                placeholder="123" 
                                                type="text" 
                                                value={paymentDetails.cvv}
                                                onChange={handleCvvChange}
                                                maxLength={4}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-[#1c1c1c] hover:bg-slate-100 dark:hover:bg-[#222222] transition-colors rounded-xl border border-slate-200 dark:border-[#1e293b] p-6 cursor-pointer group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">account_balance_wallet</span>
                                            <span className="font-bold text-lg text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-[#f2f8fc] transition-colors">PayPal Checkout</span>
                                        </div>
                                        <div className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-[#334155] group-hover:border-primary transition-colors"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-[#1e293b]">
                                    <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-[#f2f8fc] transition-colors font-bold order-2 md:order-1 cursor-pointer">
                                        <span className="material-symbols-outlined">arrow_back</span>
                                        Back to Shipping
                                    </button>
                                    <button onClick={() => setStep(3)} className="w-full md:w-auto px-12 py-4 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all order-1 md:order-2 cursor-pointer">
                                        Continue to Review
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-[#1c1c1c] rounded-xl p-8 border border-slate-200 dark:border-[#1e293b] hover:border-primary/30 transition-colors">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-primary">local_shipping</span>
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-[#f2f8fc]">Shipping Address</h2>
                                            </div>
                                            <button onClick={() => setStep(1)} className="text-sm font-semibold text-primary hover:underline cursor-pointer">Edit</button>
                                        </div>
                                        <div className="space-y-1 text-slate-500 dark:text-slate-400 text-sm">
                                            <p className="font-bold text-slate-900 dark:text-[#f2f8fc] text-base mb-2">{shippingDetails.firstName} {shippingDetails.lastName}</p>
                                            <p>{shippingDetails.address || '123 Main St'}</p>
                                            <p>{shippingDetails.city || 'Metropolis'}, {shippingDetails.postalCode || '12345'}</p>
                                            <p className="mt-4 flex items-center gap-2"><span className="material-symbols-outlined text-sm">mail</span> {shippingDetails.email || 'email@example.com'}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-[#1c1c1c] rounded-xl p-8 border border-slate-200 dark:border-[#1e293b] hover:border-primary/30 transition-colors">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-primary">payments</span>
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-[#f2f8fc]">Payment</h2>
                                            </div>
                                            <button onClick={() => setStep(2)} className="text-sm font-semibold text-primary hover:underline cursor-pointer">Edit</button>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-[#2c2c2c] p-4 rounded-lg mb-4 border border-slate-200 dark:border-[#334155]/50 flex items-center gap-4">
                                            <div className="w-12 h-8 bg-black rounded flex items-center justify-center overflow-hidden">
                                                <div className="flex gap-1">
                                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500 -ml-1"></div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-[#f2f8fc]">Mastercard</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Ending in •••• 8829</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-[#1c1c1c] rounded-xl border border-slate-200 dark:border-[#1e293b] overflow-hidden">
                                    <div className="px-8 py-5 border-b border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#2c2c2c]/50">
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-[#f2f8fc]">Order Items</h2>
                                    </div>
                                    <div className="divide-y divide-slate-100 dark:divide-[#1e293b]">
                                        {cart.map(item => (
                                            <div key={item.id} className="flex flex-col sm:flex-row items-center p-6 gap-6 group hover:bg-slate-50 dark:hover:bg-[#222222]/50 transition-colors">
                                                <div className="w-20 h-20 bg-white dark:bg-[#383838] rounded-lg overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-800">
                                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-grow text-center sm:text-left">
                                                    <h3 className="font-bold text-slate-900 dark:text-[#f2f8fc]">{item.name}</h3>
                                                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-2 uppercase tracking-tight">{item.category}</p>
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-xl font-black text-slate-900 dark:text-[#f2f8fc] block text-right">
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mb-0.5">
                                                        {item.quantity} × ${Number(item.price).toFixed(2)}
                                                    </p>
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 lg:hidden">
                                    <div className="text-center sm:text-left">
                                        <p className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-widest font-bold">Total Amount</p>
                                        <p className="text-3xl font-black text-slate-900 dark:text-[#f2f8fc]">${finalTotal.toFixed(2)}</p>
                                    </div>
                                    <button disabled={isProcessing} onClick={handlePlaceOrder} className="w-full sm:w-auto px-12 py-4 bg-primary hover:bg-primary-hover text-white font-black rounded-xl active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-75 disabled:cursor-not-allowed">
                                        {isProcessing ? 'Processing...' : 'Place Order'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Order Summary */}
                    <aside className="w-full lg:w-[400px]">
                        <div className="sticky top-24 bg-white dark:bg-[#1a1a1a] shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-[#f2f8fc] mb-1">Order Summary</h3>
                            <p className="text-sm text-slate-500 mb-8">Budal Store Checkout</p>
                            
                            <nav className="flex flex-col gap-3 mb-8">
                                <div onClick={() => setStep(1)} className={`flex items-center gap-4 p-3 rounded-lg transition-all cursor-pointer ${step === 1 ? 'text-primary font-bold bg-primary/10 translate-x-1' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                    <span className="material-symbols-outlined" style={step === 1 ? { fontVariationSettings: "'FILL' 1" } : {}}>local_shipping</span>
                                    <span className={step === 1 ? 'font-bold' : 'font-medium'}>Shipping</span>
                                    {step > 1 && <span className="material-symbols-outlined ml-auto text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                                </div>
                                <div onClick={() => step > 1 ? setStep(2) : {}} className={`flex items-center gap-4 p-3 rounded-lg transition-all ${step > 1 ? 'cursor-pointer' : ''} ${step === 2 ? 'text-primary font-bold bg-primary/10 translate-x-1' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                    <span className="material-symbols-outlined" style={step === 2 ? { fontVariationSettings: "'FILL' 1" } : {}}>payments</span>
                                    <span className={step === 2 ? 'font-bold' : 'font-medium'}>Payment</span>
                                    {step > 2 && <span className="material-symbols-outlined ml-auto text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                                </div>
                                <div onClick={() => step > 2 ? setStep(3) : {}} className={`flex items-center gap-4 p-3 rounded-lg transition-all ${step > 2 ? 'cursor-pointer' : ''} ${step === 3 ? 'text-primary font-bold bg-primary/10 translate-x-1' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                    <span className="material-symbols-outlined" style={step === 3 ? { fontVariationSettings: "'FILL' 1" } : {}}>fact_check</span>
                                    <span className={step === 3 ? 'font-bold' : 'font-medium'}>Review</span>
                                </div>
                            </nav>

                            <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="text-slate-900 dark:text-[#f2f8fc] font-semibold">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Shipping</span>
                                    <span className="text-primary font-bold">FREE</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Tax (Estimated)</span>
                                    <span className="text-slate-900 dark:text-[#f2f8fc] font-semibold">${taxes.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-black pt-4 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-[#f2f8fc]">
                                    <span>Total</span>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">USD</p>
                                        <span className="text-2xl">${finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {step === 3 && (
                                <button disabled={isProcessing} onClick={handlePlaceOrder} className="hidden lg:block w-full py-4 mb-4 bg-primary hover:bg-primary-hover text-white font-black rounded-xl active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-75 disabled:cursor-not-allowed">
                                    {isProcessing ? 'Processing...' : 'Place Order'}
                                </button>
                            )}

                            <div className="bg-slate-50 dark:bg-[#1c1c1c] rounded-xl p-4 flex gap-4 border border-slate-100 dark:border-slate-800">
                                <span className="material-symbols-outlined text-primary mt-1">security</span>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-[#f2f8fc] text-sm">Secure Checkout</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your data is securely encrypted.</p>
                                </div>
                            </div>
                        </div>
                    </aside>
            </div>
        </div>
    );
}
