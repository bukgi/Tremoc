import { Link } from 'react-router-dom';
import { Heart, Users, Award, Leaf } from 'lucide-react';

const AboutPage = () => {
  return (
    <div>
      {/* Hero with image */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <img src="/images/craft-village.jpg" alt="Làng nghề tre" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-forest/40 to-forest/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full text-center animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Leaf size={16} className="text-forest" />
              <span className="text-sm font-medium text-forest">Về chúng tôi</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
              Chúng tôi là <span className="text-mint-light">Tre Mộc</span>
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow">
              Một thương hiệu Việt Nam với sứ mệnh mang lại sản phẩm thủ công từ tre cao cấp,
              vừa đẹp vừa thân thiện với môi trường — kết nối giữa truyền thống và hiện đại.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Image + Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
          <div className="rounded-3xl overflow-hidden shadow-xl shadow-forest/10">
            <img src="/images/bamboo-forest.jpg" alt="Rừng tre" className="w-full h-72 object-cover" />
          </div>
          <div className="bg-gradient-to-br from-forest to-forest-dark rounded-3xl p-8 text-white shadow-xl shadow-forest/20 animate-slideUp">
            <img src="/images/logo-circle.png" alt="Tre Mộc" className="w-16 h-16 rounded-full mb-4 ring-2 ring-white/30" />
            <h2 className="text-2xl font-bold mb-3">Sứ Mệnh Của Chúng Tôi</h2>
            <p className="text-white/85 text-base leading-relaxed">
              Thay thế từng sản phẩm nhựa trong ngôi nhà của bạn bằng một sản phẩm tre tự nhiên,
              để cùng nhau xây dựng một tương lai xanh hơn cho các thế hệ mai sau.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Heart,
              title: 'Tâm Huyết',
              desc: 'Mỗi sản phẩm đều được chế tác với tình yêu và sự chú tâm, từ khâu chọn tre đến hoàn thiện sản phẩm.',
              color: 'bg-rose-50 text-rose-600',
              image: '/images/bamboo_tea_tray.png'
            },
            {
              icon: Users,
              title: 'Cộng Đồng',
              desc: 'Chúng tôi làm việc trực tiếp với các nghệ nhân làng nghề, tạo thu nhập bền vững cho họ.',
              color: 'bg-blue-50 text-blue-600',
              image: '/images/craft-village.jpg'
            },
            {
              icon: Award,
              title: 'Chất Lượng',
              desc: 'Từng sản phẩm đều trải qua kiểm tra nghiêm ngặt trước khi đến tay khách hàng.',
              color: 'bg-amber-50 text-amber-600',
              image: '/images/bamboo_cutting_board.png'
            }
          ].map(({ icon: Icon, title, desc, color, image }, i) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 animate-slideUp"
              style={{ animationDelay: `${i * 120}ms`, animationFillMode: 'both' }}
            >
              <div className="h-36 overflow-hidden">
                <img src={image} alt={title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 -mt-10 relative z-10 ring-4 ring-white`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-dark mb-2">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-8 py-3.5 rounded-full transition-all hover:shadow-xl hover:shadow-forest/25"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
