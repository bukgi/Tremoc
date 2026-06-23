import { Link } from "react-router-dom";
import {
  TreePine,
  ArrowRight,
  Heart,
  Users,
  Award,
  Star,
  Quote,
  Globe,
  HandHeart,
  PenTool,
} from "lucide-react";

const milestones = [
  {
    year: "2025",
    title: "Tre Mộc Ra Đời",
    subtitle: "Từ trăn trở môi trường đến xưởng tre đầu tiên",
    desc: "Tháng 6 năm 2025, sau thời gian dài học hỏi từ các nghệ nhân làng nghề truyền thống, Tre Mộc chính thức được thành lập. Với căn xưởng nhỏ và mong muốn giảm thiểu rác thải nhựa, hai dòng sản phẩm đầu tiên là Cốc Tre Mộc và Ống Hút Tre đã ra đời, nhận được sự đồng hành của hàng ngàn khách hàng trong phong trào sống xanh.",
    quote:
      '"Mỗi chiếc cốc tre được đưa vào sử dụng là một lời khẳng định cho phong cách sống bền vững và tôn trọng thiên nhiên."',
    image: "/images/products/cup_logo.jpg",
  },
  {
    year: "2026",
    title: "Nghệ Thuật Khắc & Lan Tỏa",
    subtitle: "Cá nhân hóa trải nghiệm sống xanh",
    desc: "Năm 2026, Tre Mộc đột phá với dịch vụ khắc chữ, khắc logo thủ công cá nhân hóa. Những nét khắc tinh tế từ đôi tay tài hoa của các nghệ nhân biến mỗi sản phẩm thành một tác phẩm nghệ thuật độc bản. Đến nay, dự án đã hợp tác với hơn 50 nghệ nhân và phục vụ hơn 5.000 khách hàng tin tưởng.",
    quote:
      '"Chúng tôi không chỉ bán cốc tre, chúng tôi gửi gắm những kỷ niệm và giá trị bền vững theo thời gian."',
    image: "/images/products/cup_close.jpg",
  },
];

const values = [
  {
    icon: Heart,
    title: "Thủ Công Tận Tâm",
    desc: "Mỗi chiếc cốc, mỗi ống hút, mỗi nét khắc đều là kết tinh của hàng giờ lao động tỉ mỉ từ đôi bàn tay nghệ nhân Việt. Chúng tôi không dùng máy CNC — mỗi sản phẩm đều mang hơi ấm con người, không chiếc nào giống chiếc nào.",
  },
  {
    icon: Globe,
    title: "Thay Thế Nhựa Dùng Một Lần",
    desc: "Một chiếc cốc tre sử dụng được 3-5 năm, thay thế cho khoảng 1.000 chiếc cốc nhựa dùng một lần. Một ống hút tre dùng được 1-2 năm, thay thế cho khoảng 500 ống hút nhựa. Mỗi sản phẩm Tre Mộc là một lá phiếu chống lại rác thải nhựa.",
  },
  {
    icon: Users,
    title: "Trao Quyền Cộng Đồng",
    desc: "85% thợ thủ công của chúng tôi là phụ nữ và người cao tuổi tại các làng nghề. Mỗi đơn hàng bạn mua góp phần tạo sinh kế bền vững, giữ gìn nghề truyền thống và trao quyền kinh tế cho những người yếu thế.",
  },
  {
    icon: PenTool,
    title: "Nghệ Thuật Khắc Thủ Công",
    desc: "Khắc trên tre là một nghệ thuật đòi hỏi sự kiên nhẫn và đôi tay tài hoa. Mỗi nét khắc là một lần lưỡi dao chạm vào thân tre — không thể sửa, không thể xóa. Đó là sự dấn thân trọn vẹn của người nghệ nhân vào từng tác phẩm.",
  },
];

const artisans = [
  {
    name: "Nghệ nhân Năm Khoa",
    age: 71,
    village: "Phú An, Bình Dương",
    specialty: "Đúc cốc tre thủ công",
    story:
      "Ông là nghệ nhân thế hệ thứ 3 của dòng họ làm tre. Đôi bàn tay ông có thể chọn một cây tre, cưa thành từng đốt, và cho ra 15 chiếc cốc hoàn hảo trong một ngày — mỗi chiếc đều có độ dày thành cốc đồng đều đến từng milimet.",
  },
  {
    name: "Nghệ nhân Tư Vinh",
    age: 59,
    village: "Thủ Đức, TP. Hồ Chí Minh",
    specialty: "Khắc thủ công trên tre",
    story:
      "Từng là thợ khắc gỗ mỹ nghệ 35 năm kinh nghiệm, chú Tư Vinh là người đã chuyển giao toàn bộ kỹ thuật khắc cho Tre Mộc. Chú có thể khắc một bài thơ 100 chữ lên thân cốc mà không cần phác thảo trước — từng nét đều sắc nét như in.",
  },
  {
    name: "Cô Bảy Mến",
    age: 52,
    village: "Thái Bình",
    specialty: "Chuốt ống hút tre",
    story:
      "Trước đây cô làm ruộng, thu nhập bấp bênh. Từ khi tham gia xưởng ống hút của Tre Mộc, đôi tay thoăn thoắt của cô có thể chuốt 200 ống hút mỗi ngày. Cô đã dạy nghề cho 12 phụ nữ khác trong xã và trở thành tổ trưởng xưởng sản xuất.",
  },
];

const StoryPage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[28rem] md:h-[34rem] overflow-hidden">
        <img
          src="/images/bamboo-forest.jpg"
          alt="Câu chuyện Tre Mộc"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/30 via-forest/60 to-forest/90 flex items-end pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <TreePine size={16} />
              <span className="text-sm font-medium tracking-wide">
                TỪ BÃI RÁC NHỰA ĐẾN CHIẾC CỐC TRE
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight">
              Câu Chuyện{" "}
              <span className="bg-gradient-to-r from-mint-light via-emerald-300 to-green-200 bg-clip-text text-transparent">
                Tre Mộc
              </span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed">
              Hành trình từ những chiếc cốc nhựa trôi dạt trên bãi biển Cửa Đại,
              đến những chiếc cốc tre thủ công mang tên bạn — được khắc bằng cả
              trái tim của người nghệ nhân Việt.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Intro */}
        <div className="text-center mb-20 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-mint mb-6">
            <Quote size={28} className="text-forest" />
          </div>
          <blockquote className="text-2xl md:text-3xl font-bold text-slate-dark italic leading-relaxed max-w-3xl mx-auto mb-4">
            "Chúng tôi không chỉ làm ra những chiếc cốc tre.
            <br />
            Chúng tôi đang thay thế từng chiếc cốc nhựa trên hành tinh này."
          </blockquote>
          <p className="text-muted">— Minh & Lan, Đồng sáng lập Tre Mộc</p>
        </div>

        {/* Timeline */}
        <div className="relative mb-20">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-[3.75rem] top-0 bottom-0 w-0.5 bg-gradient-to-b from-forest/30 via-forest to-forest/10" />

          <div className="space-y-12 md:space-y-16">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className="relative flex flex-col md:flex-row gap-4 md:gap-10 animate-slideUp"
                style={{
                  animationDelay: `${i * 120}ms`,
                  animationFillMode: "both",
                }}
              >
                {/* Timeline node */}
                <div className="hidden md:flex relative z-10 w-[7.5rem] shrink-0 flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-forest flex items-center justify-center shadow-lg shadow-forest/20 overflow-hidden mb-2">
                    <img
                      src={m.image}
                      alt={m.year}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-lg font-extrabold text-forest bg-forest/5 px-3 py-0.5 rounded-full">
                    {m.year}
                  </span>
                </div>

                {/* Mobile year badge */}
                <div className="md:hidden flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white border-3 border-forest flex items-center justify-center shadow-md shadow-forest/20 overflow-hidden shrink-0">
                    <img
                      src={m.image}
                      alt={m.year}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-lg font-extrabold text-forest">
                    {m.year}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
                    <div className="h-48 md:h-56 overflow-hidden">
                      <img
                        src={m.image}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6 md:p-8">
                      <p className="text-xs font-bold text-forest uppercase tracking-widest mb-1">
                        {m.subtitle}
                      </p>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-dark mb-3">
                        {m.title}
                      </h3>
                      <p className="text-muted leading-relaxed mb-4">
                        {m.desc}
                      </p>
                      <div className="border-l-4 border-forest/30 pl-4 italic text-slate-dark/70 bg-forest/[0.02] rounded-r-lg py-2">
                        {m.quote}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Engraving Craftsmanship */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <PenTool size={16} /> Nghệ thuật khắc thủ công
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-dark mb-4">
              Mỗi Nét Khắc Là <span className="text-forest">Một Linh Hồn</span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto leading-relaxed">
              Khắc thủ công trên tre không phải là in laser hàng loạt. Đó là
              nghệ thuật — nơi mỗi đường dao là một nhịp thở của người thợ, và
              mỗi tác phẩm là một câu chuyện không thể sao chép.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Không Hai Tác Phẩm Giống Nhau",
                desc: "Mỗi cây tre có vân riêng. Mỗi người thợ có tay nghề riêng. Mỗi đơn hàng có câu chuyện riêng. Kết quả là một tác phẩm hoàn toàn độc bản — không thể tìm thấy chiếc thứ hai trên thế giới.",
              },
              {
                title: "Khắc Trên Từng Thớ Tre",
                desc: "Không giống như khắc gỗ hay khắc kim loại, khắc trên tre đòi hỏi kỹ thuật riêng. Thân tre có các thớ dọc — nếu không khéo, đường khắc sẽ bị xơ. Người thợ phải 'đọc' được vân tre trước khi đặt dao.",
              },
              {
                title: "Từ Tên Người Đến Logo Doanh Nghiệp",
                desc: "Chúng tôi nhận khắc: tên cá nhân, ngày kỷ niệm, lời chúc, câu thơ yêu thích, logo thương hiệu, họa tiết hoa văn dân tộc. Mỗi yêu cầu là một thử thách sáng tạo mới cho đội ngũ thợ khắc.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-border p-6 md:p-8 hover:shadow-lg transition-all duration-300 group animate-slideUp"
                style={{
                  animationDelay: `${i * 120}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <PenTool size={24} className="text-amber-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-dark mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-dark mb-4">
              Giá Trị <span className="text-forest">Cốt Lõi</span>
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              Bốn trụ cột định hình mọi quyết định và sản phẩm của Tre Mộc
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white rounded-2xl border border-border p-6 md:p-8 hover:shadow-lg transition-all duration-300 group animate-slideUp"
                  style={{
                    animationDelay: `${i * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="w-12 h-12 rounded-xl bg-mint flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon size={24} className="text-forest" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-dark mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Artisans */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <Award size={16} /> Gặp gỡ người làm nên Tre Mộc
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-dark mb-4">
              Những Đôi <span className="text-forest">Bàn Tay Vàng</span>
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              Đằng sau mỗi chiếc cốc, mỗi ống hút, mỗi nét khắc là những con
              người với đôi tay tài hoa và trái tim nhiệt huyết
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {artisans.map((a, i) => (
              <div
                key={a.name}
                className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 group animate-slideUp"
                style={{
                  animationDelay: `${i * 150}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="p-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mint to-forest/10 flex items-center justify-center mb-4 mx-auto text-2xl font-extrabold text-forest group-hover:scale-110 transition-transform">
                    {a.name.split(" ").pop().charAt(0)}
                  </div>
                  <h3 className="text-base font-bold text-slate-dark text-center mb-1">
                    {a.name}
                  </h3>
                  <p className="text-xs text-forest font-medium text-center mb-3">
                    {a.village}
                  </p>
                  <div className="inline-block w-full text-center">
                    <span className="text-xs bg-mint text-forest px-2.5 py-1 rounded-full font-medium">
                      {a.specialty}
                    </span>
                  </div>
                  <p className="text-sm text-muted mt-4 leading-relaxed text-center">
                    {a.story}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-forest to-emerald-800 rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "30.000+", label: "Cốc tre đã đến tay" },
              { number: "120.000+", label: "Ống hút tre sản xuất" },
              { number: "8.000+", label: "Cốc khắc thủ công" },
              { number: "500.000+", label: "Cốc nhựa được thay thế" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="animate-slideUp"
                style={{
                  animationDelay: `${i * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                  {stat.number}
                </p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-mint rounded-3xl p-10 md:p-14 relative overflow-hidden animate-fadeIn">
          <div className="absolute top-6 right-6 opacity-10">
            <img
              src="/images/logo-circle.png"
              alt=""
              className="w-40 h-40 rounded-full"
            />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-forest/10 rounded-full px-4 py-1.5 text-forest text-sm font-semibold mb-4">
              <Star size={16} className="fill-forest" /> Hành trình vẫn tiếp tục
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-dark mb-4">
              Cùng Chúng Tôi <span className="text-forest">Thay Thế Nhựa</span>{" "}
              Bằng Tre
            </h2>
            <p className="text-muted mb-8 max-w-lg mx-auto leading-relaxed">
              Mỗi chiếc cốc tre bạn chọn là một chiếc cốc nhựa ít đi trong lòng
              đại dương. Mỗi ống hút tre là một ống hút nhựa không trôi ra bãi
              biển. Hãy cùng Tre Mộc viết tiếp câu chuyện.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-8 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-forest/30 active:scale-95 text-lg"
            >
              <HandHeart size={20} />
              Khám phá sản phẩm
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPage;
