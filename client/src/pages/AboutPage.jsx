import { Link } from 'react-router-dom';
import { Heart, Users, Award, Leaf } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-16 animate-fadeIn">
        <div className="inline-flex items-center gap-2 bg-forest/10 rounded-full px-4 py-2 mb-4">
          <Leaf size={16} className="text-forest" />
          <span className="text-sm font-medium text-forest">Về chúng tôi</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-dark mb-4">
          Chúng tôi là <span className="text-forest">Tre Mộc</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
          Một thương hiệu Việt Nam với sứ mệnh mang lại sản phẩm thủ công từ tre cao cấp,
          vừa đẹp vừa thân thiện với môi trường — kết nối giữa truyền thống và hiện đại.
        </p>
      </div>

      {/* Mission Banner */}
      <div className="bg-gradient-to-br from-forest to-forest-dark rounded-3xl p-10 text-white text-center mb-16 animate-slideUp shadow-xl shadow-forest/20">
        <p className="text-3xl font-bold mb-3">🎋</p>
        <h2 className="text-2xl font-bold mb-3">Sứ Mệnh Của Chúng Tôi</h2>
        <p className="text-white/80 text-lg leading-relaxed max-w-xl mx-auto">
          Thay thế từng sản phẩm nhựa trong ngôi nhà của bạn bằng một sản phẩm tre tự nhiên,
          để cùng nhau xây dựng một tương lai xanh hơn cho các thế hệ mai sau.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          {
            icon: Heart,
            title: 'Tâm Huyết',
            desc: 'Mỗi sản phẩm đều được chế tác với tình yêu và sự chú tâm, từ khâu chọn tre đến hoàn thiện sản phẩm.',
            color: 'bg-rose-50 text-rose-600'
          },
          {
            icon: Users,
            title: 'Cộng Đồng',
            desc: 'Chúng tôi làm việc trực tiếp với các nghệ nhân làng nghề, tạo thu nhập bền vững cho họ.',
            color: 'bg-blue-50 text-blue-600'
          },
          {
            icon: Award,
            title: 'Chất Lượng',
            desc: 'Từng sản phẩm đều trải qua kiểm tra nghiêm ngặt trước khi đến tay khách hàng.',
            color: 'bg-amber-50 text-amber-600'
          }
        ].map(({ icon: Icon, title, desc, color }, i) => (
          <div
            key={title}
            className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg transition-all duration-300 animate-slideUp"
            style={{ animationDelay: `${i * 120}ms`, animationFillMode: 'both' }}
          >
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
              <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-dark mb-2">{title}</h3>
            <p className="text-muted text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-mint rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-12">
        {[
          { value: '2020', label: 'Năm thành lập' },
          { value: '50+', label: 'Nghệ nhân hợp tác' },
          { value: '5000+', label: 'Khách hàng tin tưởng' },
          { value: '8', label: 'Dòng sản phẩm' },
        ].map(({ value, label }) => (
          <div key={label}>
            <p className="text-3xl font-extrabold text-forest">{value}</p>
            <p className="text-sm text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-xl hover:shadow-forest/25"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
