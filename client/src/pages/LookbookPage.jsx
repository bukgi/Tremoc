import { Link } from 'react-router-dom';
import { Camera, Leaf } from 'lucide-react';

const looks = [
  { title: 'Phong Cách Nhật Bản', desc: 'Tối giản, tinh tế, gần gũi thiên nhiên', products: ['Khay Trà Tre', 'Bộ Cốc Tre'], emoji: '🏯', bg: 'from-stone-100 to-stone-200' },
  { title: 'Góc Làm Việc Xanh', desc: 'Không gian làm việc tập trung và thân thiện', products: ['Hộp Đựng Bút Tre', 'Đèn Tre Trang Trí'], emoji: '💻', bg: 'from-green-50 to-emerald-100' },
  { title: 'Bếp Sạch, Bếp Xanh', desc: 'Dụng cụ nhà bếp từ tre tự nhiên', products: ['Thớt Tre Cao Cấp', 'Bộ Đũa Tre'], emoji: '🍜', bg: 'from-amber-50 to-orange-100' },
  { title: 'Phòng Tắm Spa', desc: 'Biến phòng tắm thành không gian thư giãn', products: ['Bàn Chải Tre', 'Giỏ Tre Đan'], emoji: '🛁', bg: 'from-blue-50 to-sky-100' },
  { title: 'Góc Trang Trí Nội Thất', desc: 'Điểm nhấn tự nhiên cho không gian sống', products: ['Đèn Tre Trang Trí', 'Giỏ Tre Đan'], emoji: '🏠', bg: 'from-purple-50 to-violet-100' },
  { title: 'Tiệc Trà Cuối Tuần', desc: 'Thưởng trà cùng gia đình với phong cách truyền thống', products: ['Khay Trà Tre', 'Bộ Cốc Tre'], emoji: '🍵', bg: 'from-rose-50 to-pink-100' },
];

const LookbookPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-14 animate-fadeIn">
        <div className="inline-flex items-center gap-2 bg-forest/10 rounded-full px-4 py-2 mb-4">
          <Camera size={16} className="text-forest" />
          <span className="text-sm font-medium text-forest">Lookbook 2025</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-dark mb-3">
          Phong Cách <span className="text-forest">Sống Xanh</span>
        </h1>
        <p className="text-muted text-lg max-w-xl mx-auto">
          Khám phá cách sản phẩm Tre Mộc biến không gian sống của bạn trở nên đẹp hơn và thân thiện với thiên nhiên hơn.
        </p>
      </div>

      {/* Lookbook Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {looks.map((look, i) => (
          <div
            key={look.title}
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${look.bg} p-8 group hover:shadow-2xl transition-all duration-500 animate-slideUp cursor-pointer`}
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
          >
            {/* Large emoji */}
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">
              {look.emoji}
            </div>

            <h2 className="text-xl font-bold text-slate-dark mb-2">{look.title}</h2>
            <p className="text-sm text-muted mb-4 leading-relaxed">{look.desc}</p>

            {/* Products */}
            <div className="space-y-1 mb-6">
              <p className="text-xs font-semibold text-forest uppercase tracking-wider mb-2">Sản phẩm trong bộ</p>
              {look.products.map(p => (
                <div key={p} className="flex items-center gap-2 text-sm text-slate-dark">
                  <Leaf size={12} className="text-forest shrink-0" />
                  {p}
                </div>
              ))}
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-forest text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-forest-dark transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
            >
              Mua ngay
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-xl hover:shadow-forest/25"
        >
          Khám phá tất cả sản phẩm
        </Link>
      </div>
    </div>
  );
};

export default LookbookPage;
