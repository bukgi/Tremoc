import { Link } from 'react-router-dom';
import { Camera, Leaf, ArrowRight } from 'lucide-react';

const looks = [
  { title: 'Phong Cách Nhật Bản', desc: 'Tối giản, tinh tế, gần gũi thiên nhiên', products: ['Khay Trà Tre', 'Bộ Cốc Tre'], image: '/images/lookbook-tea.jpg' },
  { title: 'Góc Làm Việc Xanh', desc: 'Không gian làm việc tập trung và thân thiện', products: ['Hộp Đựng Bút Tre', 'Đèn Tre Trang Trí'], image: '/images/lookbook-desk.jpg' },
  { title: 'Bếp Sạch, Bếp Xanh', desc: 'Dụng cụ nhà bếp từ tre tự nhiên', products: ['Thớt Tre Cao Cấp', 'Bộ Đũa Tre'], image: '/images/lookbook-kitchen.jpg' },
  { title: 'Phòng Tắm Spa', desc: 'Biến phòng tắm thành không gian thư giãn', products: ['Bàn Chải Tre', 'Giỏ Tre Đan'], image: '/images/lookbook-bath.jpg' },
  { title: 'Góc Trang Trí Nội Thất', desc: 'Điểm nhấn tự nhiên cho không gian sống', products: ['Đèn Tre Trang Trí', 'Giỏ Tre Đan'], image: '/images/lookbook-home.jpg' },
  { title: 'Tiệc Trà Cuối Tuần', desc: 'Thưởng trà cùng gia đình với phong cách truyền thống', products: ['Khay Trà Tre', 'Bộ Cốc Tre'], image: '/images/lookbook-weekend.jpg' },
];

const LookbookPage = () => {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src="/images/hero-bamboo.jpg" alt="Lookbook Tre Mộc" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/70 to-forest/30 flex items-center justify-center">
          <div className="text-center text-white px-4 animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Camera size={16} />
              <span className="text-sm font-medium">Lookbook 2025</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-3">
              Phong Cách <span className="text-mint-light">Sống Xanh</span>
            </h1>
            <p className="text-white/90 text-lg max-w-xl mx-auto">
              Khám phá cách sản phẩm Tre Mộc biến không gian sống trở nên đẹp hơn và thân thiện với thiên nhiên.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Lookbook Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {looks.map((look, i) => (
            <div
              key={look.title}
              className="relative overflow-hidden rounded-3xl group hover:shadow-2xl transition-all duration-500 animate-slideUp cursor-pointer"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={look.image}
                  alt={look.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/30 to-transparent flex flex-col justify-end p-6">
                <h2 className="text-xl font-bold text-white mb-2">{look.title}</h2>
                <p className="text-sm text-white/80 mb-4 leading-relaxed">{look.desc}</p>

                <div className="space-y-1 mb-4">
                  <p className="text-xs font-semibold text-mint-light uppercase tracking-wider mb-2">Sản phẩm trong bộ</p>
                  {look.products.map(p => (
                    <div key={p} className="flex items-center gap-2 text-sm text-white/90">
                      <Leaf size={12} className="text-mint-light shrink-0" />
                      {p}
                    </div>
                  ))}
                </div>

                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-white text-forest text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-mint-light transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 w-fit"
                >
                  Mua ngay <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-8 py-3.5 rounded-full transition-all hover:shadow-xl hover:shadow-forest/25"
          >
            Khám phá tất cả sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LookbookPage;
