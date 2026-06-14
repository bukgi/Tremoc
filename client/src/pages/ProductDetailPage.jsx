import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ZoomIn, ZoomOut, RotateCcw, Leaf, TreePine, Droplets, ChevronRight, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { formatPrice } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import QuantityPicker from '../components/ui/QuantityPicker';
import { apiFetch } from '../lib/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message: '' }
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    apiFetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch product', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-20 text-center">
        <div className="inline-block w-10 h-10 border-4 border-forest border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted">Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-dark mb-4">Sản phẩm không tồn tại</h1>
        <Link to="/" className="text-forest font-medium hover:underline">← Quay lại trang chủ</Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 3;

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || adding) return;
    setAdding(true);
    const result = await addToCart(product, quantity);
    setAdding(false);

    if (!result.success) {
      showToast('error', result.message);
    } else {
      showToast('success', `Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white font-medium text-sm transition-all duration-300 animate-slideUp max-w-sm ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle size={20} className="shrink-0" />
            : <AlertCircle size={20} className="shrink-0" />
          }
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-80 hover:opacity-100">
            <XCircle size={16} />
          </button>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8 animate-fadeIn">
        <Link to="/" className="text-muted hover:text-forest transition-colors">Trang chủ</Link>
        <ChevronRight size={14} className="text-muted" />
        <Link to="/products" className="text-muted hover:text-forest transition-colors">Sản phẩm</Link>
        <ChevronRight size={14} className="text-muted" />
        <span className="text-forest font-medium">{product.category}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Image Gallery */}
        <div className="animate-slideUp">
          {/* Main Image */}
          <div className="relative aspect-square bg-bg-off rounded-2xl overflow-hidden mb-4 group">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'opacity-70 grayscale' : ''}`}
            />
            {/* 360 Badge */}
            <div className="absolute top-4 left-4 bg-forest text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
              360° View
            </div>
            {/* Hết hàng overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                <div className="bg-gray-800/90 text-white font-bold text-xl px-8 py-3 rounded-2xl shadow-2xl">
                  Hết hàng
                </div>
              </div>
            )}
            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              {[ZoomIn, ZoomOut, RotateCcw].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center hover:bg-white transition-all hover:scale-110"
                >
                  <Icon size={16} className="text-slate-dark" />
                </button>
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  selectedImage === index
                    ? 'border-forest shadow-md shadow-forest/20'
                    : 'border-transparent hover:border-border opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="animate-slideUp" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <span className="text-sm font-semibold text-forest uppercase tracking-wider">{product.category}</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-dark mt-2 mb-3">{product.name}</h1>
          <p className="text-3xl font-bold text-forest mb-3">{formatPrice(product.price)}</p>

          {/* Trạng thái tồn kho */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold mb-6 ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-500'
              : isLowStock
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              isOutOfStock ? 'bg-gray-400' : isLowStock ? 'bg-amber-500' : 'bg-green-500'
            }`} />
            {isOutOfStock
              ? 'Hết hàng'
              : isLowStock
              ? `Sắp hết hàng — Chỉ còn ${product.stockQuantity} sản phẩm!`
              : `Còn hàng — ${product.stockQuantity} sản phẩm`
            }
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-dark uppercase tracking-wider mb-3">Mô tả sản phẩm</h3>
            <p className="text-muted leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 mb-8">
            {!isOutOfStock && (
              <div>
                <label className="block text-sm font-medium text-slate-dark mb-2">
                  Số lượng <span className="text-muted font-normal">(tối đa {product.stockQuantity})</span>
                </label>
                <QuantityPicker
                  quantity={quantity}
                  onChange={setQuantity}
                  max={product.stockQuantity}
                />
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || adding || isManager}
              className={`w-full flex items-center justify-center gap-2 font-semibold py-4 rounded-xl transition-all duration-300 text-lg ${
                isOutOfStock || isManager
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : adding
                  ? 'bg-forest/70 text-white cursor-wait'
                  : 'bg-forest hover:bg-forest-dark text-white hover:shadow-xl hover:shadow-forest/25 active:scale-[0.98]'
              }`}
              id="add-to-cart-detail"
            >
              <ShoppingCart size={22} />
              {isOutOfStock 
                ? 'Sản phẩm hết hàng' 
                : isManager 
                ? 'Tài khoản quản lý không được mua hàng' 
                : adding 
                ? 'Đang thêm...' 
                : 'Thêm vào giỏ hàng'}
            </button>

            {isOutOfStock && (
              <p className="text-center text-sm text-muted">
                Sản phẩm này hiện đã hết hàng. Hãy quay lại sau.
              </p>
            )}
          </div>

          {/* Environmental Impact */}
          <div className="bg-mint rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Leaf size={20} className="text-forest" />
              <h3 className="text-base font-semibold text-slate-dark">Tác động tích cực của bạn</h3>
            </div>
            <p className="text-sm text-muted mb-4">
              Bằng việc chọn 1 {product.name} thay vì sản phẩm nhựa
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Leaf, value: product.impact.plastic, label: 'Nhựa giảm thiểu', color: 'text-green-600' },
                { icon: TreePine, value: product.impact.co2, label: 'CO₂ giảm', color: 'text-emerald-600' },
                { icon: Droplets, value: product.impact.water, label: 'Nước tiết kiệm', color: 'text-blue-500' },
              ].map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <Icon size={20} className={`${color} mx-auto mb-1.5`} />
                  <p className="text-lg font-bold text-slate-dark">{value}</p>
                  <p className="text-xs text-muted">{label}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-center text-muted mt-4">
              🌍 Cảm ơn bạn đã góp phần bảo vệ hành tinh!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
