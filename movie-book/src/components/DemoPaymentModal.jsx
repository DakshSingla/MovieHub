import React, { useState } from 'react';

const DemoPaymentModal = ({ open, onClose, onSuccess, amount }) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [focused, setFocused] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const formatNumber = (v) => v.replace(/\D/g, '').slice(0,16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v) => v.replace(/\D/g, '').slice(0,4).replace(/(\d{2})(\d{0,2})/, (m,p1,p2)=> p2 ? p1 + '/' + p2 : p1);
  const formatCvc = (v) => v.replace(/\D/g, '').slice(0,4);

  const detectBrand = (num) => {
    const n = num.replace(/\s/g,'');
    if (/^4/.test(n)) return 'Visa';
    if (/^5[1-5]/.test(n)) return 'Mastercard';
    if (/^3[47]/.test(n)) return 'Amex';
    if (/^6/.test(n)) return 'Discover';
    return 'Card';
  };

  const luhnCheck = (num) => {
    const s = num.replace(/\D/g,'');
    let sum = 0; let alt = false;
    for (let i = s.length - 1; i >= 0; i--) {
      let n = parseInt(s.charAt(i), 10);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n; alt = !alt;
    }
    return s.length >= 12 && sum % 10 === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const plainNumber = number.replace(/\s/g,'');
    if (!name.trim()) { setError('Cardholder name required'); return; }
    if (!luhnCheck(plainNumber)) { setError('Invalid card number'); return; }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) { setError('Expiry must be MM/YY'); return; }
    if (parseInt(expiry.slice(0,2),10) < 1 || parseInt(expiry.slice(0,2),10) > 12) { setError('Expiry month invalid'); return; }
    if (cvc.length < 3) { setError('CVC too short'); return; }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // mock token created — invoke parent handlers
      if (typeof onSuccess === 'function') onSuccess({ token: 'demo_token' });
      if (typeof onClose === 'function') onClose();
      // reset fields
      setName(''); setNumber(''); setExpiry(''); setCvc(''); setFocused(''); setError('');
    }, 900);
  };

  const brand = detectBrand(number);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-purple-200">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl relative border border-gray-200">
        <button className="absolute top-3 right-3 text-gray-400 text-2xl hover:text-primary" onClick={onClose}>&times;</button>
        <div className="flex gap-6">
          <div className="flex-1 hidden md:block">
              <div className="flex flex-col items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-700 mb-1">Payment</h2>
                <p className="text-gray-500 text-sm">Enter your card details to complete payment</p>
              </div>

            <div className="mb-4 flex justify-center">
              <div className="w-72 h-40 bg-gradient-to-tr from-blue-600 to-purple-500 rounded-xl shadow-lg flex flex-col justify-between p-4 text-white relative">
                <div className="flex justify-between items-center">
                  <span className="font-bold tracking-widest text-lg">{number || '**** **** **** 4242'}</span>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs">{brand}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs">{expiry || '12/28'}</span>
                  <span className="text-xs">CVV: {cvc ? '*'.repeat(cvc.length) : '***'}</span>
                </div>
                <div className="absolute bottom-2 right-4 text-xs opacity-70">Card</div>
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 italic">This is a secure payment simulation. No real transaction will occur.</div>
          </div>

          {/* Right-hand form copied from PaymentPage */}
          <form onSubmit={handleSubmit} className="w-full md:w-1/2 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-indigo-100">
            <div className="space-y-4">
              <label className="block">
                <div className="text-sm font-medium text-gray-700">Cardholder name</div>
                <input
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  onFocus={()=>setFocused('name')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-black"
                  placeholder="Full name"
                />
              </label>

              <label className="block">
                <div className="text-sm font-medium text-gray-700 flex justify-between items-center">
                  <span>Card number</span>
                  <span className="text-xs text-gray-500">{brand}</span>
                </div>
                <input
                  value={number}
                  onChange={(e)=>setNumber(formatNumber(e.target.value))}
                  onFocus={()=>setFocused('number')}
                  inputMode="numeric"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 tracking-wider text-black"
                  placeholder="#### #### #### ####"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label>
                  <div className="text-sm font-medium text-gray-700">Expiry</div>
                  <input
                    value={expiry}
                    onChange={(e)=>setExpiry(formatExpiry(e.target.value))}
                    onFocus={()=>setFocused('expiry')}
                    inputMode="numeric"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-black"
                    placeholder="MM/YY"
                  />
                </label>

                <label>
                  <div className="text-sm font-medium text-gray-700">CVC</div>
                  <input
                    value={cvc}
                    onChange={(e)=>setCvc(formatCvc(e.target.value))}
                    onFocus={()=>setFocused('cvc')}
                    inputMode="numeric"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-black"
                    placeholder="CVC"
                  />
                </label>
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-purple-600 hover:to-indigo-600 transition-colors duration-300 disabled:opacity-60"
              >
                {loading ? 'Processing...' : `Pay ${amount ? `₹${amount}` : ''}`}
              </button>

              <div className="text-xs text-gray-500 pt-2">By clicking pay you agree to testing charges. This is a UI demo.</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DemoPaymentModal;
