import React, { useState } from 'react';

export default function PaymentPage() {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [focused, setFocused] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

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

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      alert('Payment token created (mock). Submit this token to your backend to process payment.');
      setName(''); setNumber(''); setExpiry(''); setCvc(''); setFocused('');
    }, 900);
  };

  const brand = detectBrand(number);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-100 to-purple-200 p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.8),_transparent_50%)] opacity-70"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(147,197,253,0.6),_transparent_60%)] opacity-60 animate-pulse"></div>
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between transform transition-transform hover:scale-[1.02] duration-300">
          <div>
            <h2 className="text-2xl font-semibold">Pay securely</h2>
            <p className="mt-2 text-indigo-100 text-sm">Enter your card details below. This preview updates as you type.</p>
          </div>

          <div className="mt-6">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">{brand}</div>
                <div className="text-xs">•••• {number.replace(/\s/g,'').slice(-4) || '0000'}</div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-indigo-100 truncate">{name || 'CARDHOLDER NAME'}</div>
                <div className="mt-2 text-lg tracking-wider font-semibold">{number || '#### #### #### ####'}</div>
                <div className="mt-3 flex items-center justify-between text-xs text-indigo-100">
                  <div>{expiry || 'MM/YY'}</div>
                  <div>{cvc ? '*'.repeat(cvc.length) : 'CVC'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-indigo-50/90">
            <p>We never store full card numbers on this page. Replace the mock tokenization with a PCI-compliant provider when you go live.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-indigo-100">
          <div className="space-y-4">
            <label className="block">
              <div className="text-sm font-medium text-gray-700">Cardholder name</div>
              <input
                value={name}
                onChange={(e)=>setName(e.target.value)}
                onFocus={()=>setFocused('name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 tracking-wider"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  placeholder="CVC"
                />
              </label>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <button
              type="submit"
              disabled={processing}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-purple-600 hover:to-indigo-600 transition-colors duration-300 disabled:opacity-60"
            >
              {processing ? 'Processing...' : 'Pay now'}
            </button>

            <div className="text-xs text-gray-500 pt-2">
              By clicking pay you agree to testing charges. This is a UI demo.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
