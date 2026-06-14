import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Leaf, TreePine, Shield, Truck, AlertCircle } from 'lucide-react';
import { formatPrice } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { apiFetch } from '../lib/api';

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const [toast, setToast] = useState(null);
  const [adding, setAdding] = useState(false);

  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 3;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (isOutOfStock || adding) return;

    setAdding(true);
    const result = await addToCart(product, 1);
    setAdding(false);

    if (!result.success) {
      setToast({ type: 'error', message: result.message });
    } else {
      setToast({ type: 'success', message: 'Đã thêm vào giỏ hàng!' });
    }
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-border/50 animate-slideUp relative"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
    >
      {/* Toast thông báo */}
      {toast && (
        <div className={`absolute top-2 left-2 right-2 z-20 px-3 py-2 rounded-lg text-xs font-medium text-white shadow-lg transition-all duration-300 flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <AlertCircle size={14} />
          {toast.message}
        </div>
      )}

      {/* Badge tồn kho */}
      {isOutOfStock && (
        <div className="absolute top-3 left-3 z-10 bg-gray-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
          Hết hàng
        </div>
      )}
      {isLowStock && (
        <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
          Sắp hết
        </div>
      )}

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square bg-bg-off">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Info */}
      <div className="p-4 relative">
        <span className="text-xs font-semibold text-forest uppercase tracking-wider">
          {product.category}
        </span>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-base font-semibold text-slate-dark mt-1.5 mb-1 group-hover:text-forest transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Số lượng tồn kho */}
        <p className={`text-xs mb-2 font-medium ${
          isOutOfStock ? 'text-gray-400' :
          isLowStock ? 'text-amber-600' : 'text-green-600'
        }`}>
          {isOutOfStock ? 'Hết hàng' : isLowStock ? `⚠ Còn ${product.stockQuantity} sản phẩm` : `✓ Còn ${product.stockQuantity} sản phẩm`}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-forest">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className={`w-10 h-10 rounded-full text-white flex items-center justify-center transition-all duration-200 ${
              isOutOfStock
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-forest hover:bg-forest-dark hover:scale-110 hover:shadow-lg hover:shadow-forest/30 active:scale-95'
            }`}
            title={isOutOfStock ? 'Sản phẩm hết hàng' : 'Thêm vào giỏ hàng'}
            id={`add-to-cart-${product.id}`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculatorCount, setCalculatorCount] = useState(10);
  const [banner, setBanner] = useState(() => {
    const saved = localStorage.getItem('tremoc_banner');
    if (saved) return JSON.parse(saved);
    const initialBanner = {
      title: 'Sống xanh cùng',
      highlightTitle: 'Tre Mộc',
      description: 'Khám phá bộ sưu tập sản phẩm tre thủ công cao cấp, được chế tác tỉ mỉ từ các làng nghề truyền thống Việt Nam.',
      ctaText: 'Khám phá ngay',
      link: '/products'
    };
    localStorage.setItem('tremoc_banner', JSON.stringify(initialBanner));
    return initialBanner;
  });

  useEffect(() => {
    apiFetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('tremoc_banner');
    if (saved) setBanner(JSON.parse(saved));
  }, []);

  // Eco-calculator calculations
  const plasticSaved = calculatorCount * 50; // 50g per plastic item replaced
  const co2Saved = (calculatorCount * 1.5).toFixed(1); // 1.5kg CO2
  const waterSaved = calculatorCount * 20; // 20L water

  const getMilestone = (count) => {
    if (count <= 5) {
      return {
        emoji: '🌱',
        title: 'Mầm Xanh Mới Nhú',
        desc: 'Hành trình xanh bắt đầu từ những bước nhỏ nhất!',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      };
    } else if (count <= 15) {
      return {
        emoji: '🐢',
        title: 'Bạn Của Rùa Biển',
        desc: 'Bạn đã cứu sống rùa biển khỏi mối đe dọa từ rác nhựa đại dương!',
        color: 'bg-blue-50 text-blue-700 border-blue-200 animate-bounceSubtle'
      };
    } else if (count <= 30) {
      return {
        emoji: '🌳',
        title: 'Đại Sứ Phủ Xanh',
        desc: 'Lượng CO₂ giảm thiểu tương đương với việc bạn trồng 2 cây xanh trưởng thành!',
        color: 'bg-green-50 text-green-700 border-green-200 animate-bounceSubtle'
      };
    } else {
      return {
        emoji: '🌍',
        title: 'Người Hùng Trái Đất',
        desc: 'Tuyệt vời! Bạn đang truyền cảm hứng sống xanh mạnh mẽ cho cộng đồng!',
        color: 'bg-teal-50 text-teal-700 border-teal-200 animate-bounceSubtle'
      };
    }
  };

  const milestone = getMilestone(calculatorCount);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-mint-light via-cream to-mint overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-72 h-72 bg-forest/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-bamboo/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-forest/10 rounded-full px-4 py-2 mb-6 animate-fadeIn">
                <Leaf size={16} className="text-forest" />
                <span className="text-sm font-medium text-forest">Thân thiện môi trường 100%</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-dark leading-tight mb-6 animate-slideUp">
                {banner.title}
                <span className="text-forest block mt-1">{banner.highlightTitle}</span>
              </h1>
              <p className="text-lg text-muted max-w-xl mx-auto lg:mx-0 mb-8 animate-slideUp" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                {banner.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slideUp" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                <Link
                  to={banner.link}
                  className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 hover:shadow-xl hover:shadow-forest/25 active:scale-[0.98]"
                  id="hero-cta"
                >
                  {banner.ctaText}
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 border-2 border-forest text-forest font-semibold px-8 py-3.5 rounded-full hover:bg-forest/5 transition-all duration-200"
                >
                  Câu chuyện của chúng tôi
                </Link>
              </div>
            </div>

            {/* Right: Hero Images */}
            <div className="relative animate-fadeIn" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-forest/15 aspect-[4/5] max-w-md mx-auto lg:max-w-none">
                <img
                  src="/images/hero-bamboo.jpg"
                  alt="Rừng tre xanh"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-4 sm:left-4 bg-white rounded-2xl p-3 shadow-xl border border-border/50 animate-float">
                <img src="/images/bamboo_cups.png" alt="Bộ cốc tre" className="w-24 h-24 rounded-xl object-cover" />
              </div>
              <div className="absolute -top-4 -right-4 sm:right-4 bg-white rounded-full p-2 shadow-xl border border-border/50 animate-float" style={{ animationDelay: '0.8s' }}>
                <img src="/images/logo-circle.png" alt="Tre Mộc" className="w-20 h-20 rounded-full object-cover" />
              </div>
              <div className="absolute top-1/3 -right-6 hidden sm:block bg-white rounded-2xl p-2 shadow-xl border border-border/50 animate-float" style={{ animationDelay: '1.2s' }}>
                <img src="/images/bamboo_tea_tray.png" alt="Khay trà tre" className="w-28 h-28 rounded-xl object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-y border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Leaf, label: '100% Tự nhiên', desc: 'Nguyên liệu bền vững' },
              { icon: TreePine, label: 'Thủ công', desc: 'Làng nghề Việt Nam' },
              { icon: Shield, label: 'An toàn', desc: 'Không hóa chất độc hại' },
              { icon: Truck, label: 'Giao hàng', desc: 'Miễn phí từ 500.000đ' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-mint flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-forest" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-dark">{label}</p>
                  <p className="text-xs text-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-dark mb-3">Sản phẩm nổi bật</h2>
          <p className="text-muted text-lg">Những sản phẩm được yêu thích nhất</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-border overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-100 rounded w-1/3" />
                    <div className="w-10 h-10 bg-gray-100 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-forest font-semibold hover:gap-3 transition-all duration-300 group"
            id="view-all-products"
          >
            Xem tất cả sản phẩm
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Art of Bamboo & traditional craft village Section */}
      <section className="bg-mint-light py-16 lg:py-20 border-t border-b border-forest/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-forest">
            <path d="M70,10 C65,25 50,40 50,60 C50,70 58,80 70,90 C72,75 80,60 80,45 C80,30 75,20 70,10 Z" />
            <path d="M30,30 C28,40 20,50 20,65 C20,72 25,78 32,83 C33,72 38,62 38,52 C38,42 35,35 30,30 Z" />
          </svg>
        </div>
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-forest uppercase bg-forest/10 px-3 py-1.5 rounded-full tracking-wider">Hồn Tre Đất Việt</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-dark mt-4 mb-4">
              Nghệ Thuật Chế Tác <span className="text-forest">Tre Mộc</span>
            </h2>
            <p className="text-muted text-base">
              Chúng tôi kết hợp nguồn nguyên liệu tre dồi dào, thân thiện với quy trình sản xuất thủ công tỉ mỉ tại các làng nghề truyền thống Việt Nam để mang đến vẻ đẹp mộc mạc, bền bỉ nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                image: '/images/bamboo-forest.jpg',
                title: 'Tre Già Tự Nhiên',
                desc: 'Tre được thu hoạch đúng độ tuổi trưởng thành (từ 3-5 năm) giúp thớ tre đanh cứng, dẻo dai và không bị cong vênh.'
              },
              {
                image: '/images/craft-village.jpg',
                title: 'Hồn Quê Thủ Công',
                desc: 'Mỗi sản phẩm đều trải qua quá trình gọt giũa tỉ mỉ từ bàn tay tài hoa của các nghệ nhân làng nghề Chương Mỹ, Phú Vinh.'
              },
              {
                image: '/images/bamboo_tea_tray.png',
                title: 'Kháng Khuẩn Sáp Ong',
                desc: 'Không sử dụng sơn màu hoá học. Sản phẩm được xử lý chống ẩm mốc bằng nhiệt lượng cao và đánh bóng bằng sáp ong tự nhiên.'
              },
              {
                image: '/images/bamboo_toothbrush.png',
                title: 'Phân Huỷ Sinh Học',
                desc: 'Sau vòng đời sử dụng hữu ích, sản phẩm tre dễ dàng phân huỷ tự nhiên 100%, không để lại hạt nhựa vi sinh gây độc hại cho Trái Đất.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-forest/15 hover:border-forest hover:shadow-xl hover:shadow-forest/5 transition-all duration-300 group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/30 to-transparent" />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-slate-dark mb-2 group-hover:text-forest transition-colors">{item.title}</h4>
                  <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-forest uppercase bg-forest/10 px-3 py-1.5 rounded-full tracking-wider">Bộ sưu tập</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-dark mt-4 mb-3">Khoảnh Khắc Sống Xanh</h2>
          <p className="text-muted text-lg max-w-xl mx-auto">Những hình ảnh về sản phẩm tre và lối sống bền vững cùng Tre Mộc</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { src: '/images/lookbook-tea.jpg', alt: 'Trà chiều', span: 'col-span-2 row-span-2' },
            { src: '/images/bamboo_cups.png', alt: 'Cốc tre', span: '' },
            { src: '/images/bamboo_lamp.png', alt: 'Đèn tre', span: '' },
            { src: '/images/lookbook-desk.jpg', alt: 'Bàn làm việc', span: '' },
            { src: '/images/bamboo_organizer.png', alt: 'Hộp bút tre', span: '' },
            { src: '/images/lookbook-kitchen.jpg', alt: 'Nhà bếp xanh', span: 'col-span-2' },
          ].map((img, i) => (
            <div
              key={img.alt}
              className={`relative overflow-hidden rounded-2xl group ${img.span} ${img.span.includes('row-span') ? 'aspect-square md:aspect-auto md:min-h-[320px]' : 'aspect-square'}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/lookbook"
            className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-8 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-forest/20"
          >
            Xem Lookbook
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Interactive Eco-Impact Calculator */}
      <section className="bg-gradient-to-br from-mint to-mint-light py-16 lg:py-20 border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Calculator Control Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-forest/10 animate-fadeIn">
              <div className="inline-flex items-center gap-2 bg-forest/10 rounded-full px-4 py-1.5 mb-4">
                <span className="text-base">🌍</span>
                <span className="text-xs font-bold text-forest uppercase tracking-wider">Bảng Tính Tác Động</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-dark mb-3">
                Thay đổi nhỏ, <span className="text-forest">Ý nghĩa lớn!</span>
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Chọn số lượng vật dụng nhựa (cốc, bát, ống hút, bàn chải...) bạn sẽ thay thế bằng sản phẩm tre tự nhiên và nhìn thấy tác động tức thì:
              </p>

              {/* Slider Controller */}
              <div className="space-y-4 my-6">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-dark">
                  <span>Số đồ dùng nhựa thay thế:</span>
                  <span className="text-lg font-bold text-white bg-forest px-3.5 py-1 rounded-full shadow-sm shadow-forest/20">
                    {calculatorCount} cái
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={calculatorCount}
                  onChange={(e) => setCalculatorCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest outline-none focus:ring-2 focus:ring-forest/20"
                />
                <div className="flex justify-between text-xs text-muted-light font-medium">
                  <span>1 sản phẩm</span>
                  <span>25</span>
                  <span>50 sản phẩm</span>
                </div>
              </div>

              {/* Dynamic Milestone Card */}
              <div className={`rounded-2xl p-4 border transition-all duration-500 ${milestone.color}`}>
                <div className="flex gap-3 items-start">
                  <span className="text-3xl shrink-0">{milestone.emoji}</span>
                  <div>
                    <h5 className="font-bold text-sm uppercase tracking-wide">{milestone.title}</h5>
                    <p className="text-xs opacity-90 mt-1 leading-relaxed">{milestone.desc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Stats Output Cards */}
            <div className="lg:col-span-7 space-y-6">
              <div className="max-w-xl">
                <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-dark leading-tight mb-3">
                  Tác Động Tích Cực <br />
                  <span className="text-forest">Đến Trái Đất Của Bạn</span>
                </h2>
                <p className="text-muted text-base leading-relaxed">
                  Bản tính toán đo lường gần đúng lượng chất thải được loại bỏ trực tiếp khỏi môi trường dựa trên lượng nguyên liệu tre sạch tiêu hao.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { value: `${plasticSaved}g`, label: 'Nhựa tránh được', desc: 'Lượng chất thải nhựa không bị xả ra bãi rác hoặc đại dương.', emoji: '🌿', color: 'border-emerald-200 shadow-emerald-50 text-emerald-600' },
                  { value: `${co2Saved}kg`, label: 'CO₂ giảm thiểu', desc: 'Khí nhà kính giảm thiểu nhờ chọn vật liệu tre có chu kỳ carbon âm.', emoji: '🌲', color: 'border-green-200 shadow-green-50 text-green-600' },
                  { value: `${waterSaved}L`, label: 'Nước tiết kiệm', desc: 'Lượng nước ngọt được bảo tồn so với quy trình tinh chế hạt nhựa tổng hợp.', emoji: '💧', color: 'border-blue-200 shadow-blue-50 text-blue-500' },
                ].map(({ value, label, desc, emoji, color }) => (
                  <div 
                    key={label} 
                    className={`bg-white rounded-2xl p-5 border shadow-md hover:shadow-lg transition-all duration-300 ${color}`}
                  >
                    <span className="text-2xl mb-1 block">{emoji}</span>
                    <p className="text-3xl font-extrabold text-slate-dark mt-1 animate-scaleIn" key={value}>{value}</p>
                    <p className="text-sm font-bold mt-1.5">{label}</p>
                    <p className="text-xs text-muted mt-2 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
