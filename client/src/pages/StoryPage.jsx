import { Link } from 'react-router-dom';
import { Leaf, TreePine, ArrowRight } from 'lucide-react';

const StoryPage = () => {
  const milestones = [
    {
      year: '2018',
      title: 'Khởi Nguồn Ý Tưởng',
      desc: 'Hai người bạn thất vọng trước lượng rác nhựa khổng lồ sau một chuyến dã ngoại. Ý tưởng về Tre Mộc được nhen nhóm từ đây.',
      emoji: '💡'
    },
    {
      year: '2019',
      title: 'Về Làng Học Nghề',
      desc: 'Cả nhóm về làng nghề Quảng Nam, sống cùng các nghệ nhân, học cách chọn tre và đan thủ công truyền thống suốt 6 tháng.',
      emoji: '🎋'
    },
    {
      year: '2020',
      title: 'Tre Mộc Ra Đời',
      desc: 'Với 8 sản phẩm đầu tiên và 200 đơn hàng trong tháng ra mắt, Tre Mộc chính thức hiện diện trên thị trường.',
      emoji: '🚀'
    },
    {
      year: '2022',
      title: 'Mở Rộng Hợp Tác',
      desc: 'Ký kết hợp tác với 5 làng nghề khắp cả nước, mở rộng lên 50+ nghệ nhân và ra mắt 30 sản phẩm mới.',
      emoji: '🤝'
    },
    {
      year: '2024',
      title: 'Tác Động Môi Trường',
      desc: 'Đã giúp giảm 2.5 tấn rác nhựa, phủ rộng 5000+ gia đình Việt Nam sử dụng sản phẩm thân thiện môi trường.',
      emoji: '🌍'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16 animate-fadeIn">
        <div className="inline-flex items-center gap-2 bg-forest/10 rounded-full px-4 py-2 mb-4">
          <TreePine size={16} className="text-forest" />
          <span className="text-sm font-medium text-forest">Hành trình của chúng tôi</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-dark mb-4">
          Câu Chuyện <span className="text-forest">Tre Mộc</span>
        </h1>
        <p className="text-muted text-lg max-w-xl mx-auto">
          Từ ý tưởng nhỏ của hai người bạn đến thương hiệu được 5000+ gia đình tin yêu.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-forest/30 via-forest to-forest/10" />

        <div className="space-y-10">
          {milestones.map((m, i) => (
            <div
              key={m.year}
              className="relative flex gap-8 animate-slideUp"
              style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'both' }}
            >
              {/* Circle on timeline */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-white border-4 border-forest flex items-center justify-center shrink-0 shadow-lg shadow-forest/20 text-2xl">
                {m.emoji}
              </div>

              {/* Content */}
              <div className="bg-white rounded-2xl border border-border p-6 flex-1 shadow-sm hover:shadow-lg transition-all duration-300">
                <span className="text-sm font-bold text-forest bg-forest/10 px-3 py-1 rounded-full">{m.year}</span>
                <h3 className="text-lg font-bold text-slate-dark mt-3 mb-2">{m.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 bg-gradient-to-br from-mint to-mint-light rounded-3xl p-10 text-center">
        <Leaf size={40} className="text-forest mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-dark mb-3">Hành trình vẫn tiếp tục...</h2>
        <p className="text-muted mb-6">
          Và chúng tôi muốn bạn đồng hành cùng chúng tôi trong hành trình bảo vệ hành tinh xanh.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-xl hover:shadow-forest/25"
        >
          Khám phá sản phẩm
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default StoryPage;
