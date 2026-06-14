import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Truck, Info, CheckCircle, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, provinces } from '../data/mockData';
import QuantityPicker from '../components/ui/QuantityPicker';
import { apiFetch, getAuthToken, readJson } from '../lib/api';

// Toast component nhỏ gọn
const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl text-white font-medium text-sm max-w-sm animate-slideUp ${
      toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`}>
      {toast.type === 'success'
        ? <CheckCircle size={20} className="shrink-0 mt-0.5" />
        : <AlertCircle size={20} className="shrink-0 mt-0.5" />
      }
      <span className="flex-1">{toast.message}</span>
      <button onClick={onClose} className="opacity-80 hover:opacity-100 shrink-0">
        <XCircle size={16} />
      </button>
    </div>
  );
};

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const { logout, openLogin } = useAuth();
  const [selectedProvince, setSelectedProvince] = useState('');
  const [shippingFee, setShippingFee] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const freeShippingThreshold = 500000;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const calculateShipping = () => {
    if (!selectedProvince) return;
    if (subtotal >= freeShippingThreshold) {
      setShippingFee(0);
    } else {
      setShippingFee(selectedProvince === 'Hà Nội' ? 20000 : 35000);
    }
  };

  const total = subtotal + (shippingFee || 0);

  const handlePlaceOrder = async () => {
    const token = getAuthToken();
    if (!token) {
      showToast('error', 'Vui lòng đăng nhập để đặt hàng!');
      setTimeout(() => openLogin(), 300);
      return;
    }

    if (!selectedProvince) {
      showToast('error', 'Vui lòng chọn tỉnh/thành phố và tính phí vận chuyển trước!');
      return;
    }

    if (shippingFee === null) {
      showToast('error', 'Vui lòng bấm "Tính phí vận chuyển" trước khi đặt hàng!');
      return;
    }

    setPlacing(true);
    try {
      const res = await apiFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          subtotal,
          shippingFee: shippingFee || 0,
          province: selectedProvince,
          items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price }))
        })
      });

      const data = await readJson(res);

      if (res.ok) {
        clearCart();
        showToast('success', `Đặt hàng thành công! Mã đơn hàng: #${data.orderId}`);
        setTimeout(() => navigate('/orders'), 2000);
      } else if (res.status === 409) {
        // Hết hàng hoặc không đủ số lượng
        showToast('error', data.message || 'Sản phẩm không đủ số lượng trong kho.');
      } else if (res.status === 401) {
        showToast('error', 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại rồi bấm đặt hàng một lần nữa.');
        logout();
        setTimeout(() => openLogin(), 500);
      } else {
        showToast('error', data.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
      }
    } catch (err) {
      showToast('error', 'Lỗi kết nối tới server. Kiểm tra lại kết nối mạng.');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fadeIn">
        <Toast toast={toast} onClose={() => setToast(null)} />
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-mint flex items-center justify-center">
          <ShoppingBag size={36} className="text-forest" />
        </div>
        <h1 className="text-2xl font-bold text-slate-dark mb-3">Giỏ hàng trống</h1>
        <p className="text-muted mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-8 py-3 rounded-xl transition-all"
        >
          <ArrowLeft size={18} />
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <h1 className="text-3xl font-bold text-slate-dark mb-8 animate-fadeIn">Giỏ hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => {
            const maxStock = item.stockQuantity ?? 99;
            const isOverStock = item.quantity > maxStock;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start animate-slideUp ${
                  isOverStock ? 'border-red-200 bg-red-50/30' : 'border-border'
                }`}
                style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
              >
                {/* Image */}
                <Link to={`/product/${item.id}`} className="w-24 h-24 rounded-xl overflow-hidden bg-bg-off shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`} className="text-base font-semibold text-slate-dark hover:text-forest transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted mt-0.5">{item.category}</p>
                  <p className="text-lg font-bold text-forest mt-2">{formatPrice(item.price)}</p>
                  {isOverStock && (
                    <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle size={12} />
                      Vượt quá tồn kho! Chỉ còn {maxStock} sản phẩm.
                    </p>
                  )}
                </div>

                {/* Quantity & Remove */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <QuantityPicker
                    quantity={item.quantity}
                    onChange={(qty) => updateQuantity(item.id, qty, maxStock)}
                    max={maxStock}
                  />
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 animate-slideUp" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          {/* Shipping Calculator */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck size={20} className="text-forest" />
              <h3 className="font-semibold text-slate-dark">Phí vận chuyển</h3>
            </div>

            <select
              value={selectedProvince}
              onChange={(e) => { setSelectedProvince(e.target.value); setShippingFee(null); }}
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none text-sm mb-3 bg-white"
              id="shipping-province"
            >
              <option value="">Chọn Tỉnh/Thành phố</option>
              {provinces.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <button
              onClick={calculateShipping}
              disabled={!selectedProvince}
              className="w-full py-2.5 text-sm font-medium border border-forest text-forest rounded-lg hover:bg-forest/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Tính phí vận chuyển
            </button>

            {shippingFee !== null && (
              <p className="text-sm text-forest font-medium mt-3">
                {shippingFee === 0 ? '✨ Miễn phí vận chuyển!' : `Phí: ${formatPrice(shippingFee)}`}
              </p>
            )}

            {remainingForFreeShipping > 0 && (
              <div className="flex items-start gap-2 mt-4 p-3 bg-amber-50 rounded-lg">
                <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700">
                  💡 Mua thêm <strong>{formatPrice(remainingForFreeShipping)}</strong> để được miễn phí vận chuyển
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-slate-dark mb-4">Tóm tắt đơn hàng</h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Tạm tính ({items.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {shippingFee !== null && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Phí vận chuyển</span>
                  <span className="font-medium">{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-dark">Tổng cộng</span>
                <span className="text-xl font-bold text-forest">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-forest/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
              id="place-order"
            >
              {placing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Đặt hàng'
              )}
            </button>

            <Link
              to="/"
              className="block text-center text-sm text-forest font-medium mt-4 hover:underline"
            >
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
