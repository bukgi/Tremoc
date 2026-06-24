import { Link } from "react-router-dom";
import {
  TreePine,
  ArrowRight,
  Star,
  HandHeart,
  Sparkles,
  Heart,
} from "lucide-react";

const storySections = [
  {
    emoji: "🎋",
    title: "Tôn vinh hồn cốt Việt qua vẻ đẹp mộc mạc của Tre",
    paragraphs: [
      "Nhắc đến tre, lòng ta lại man mác nhớ về những lũy tre làng rì rào trong gió, nơi cất giữ tuổi thơ bình yên và bóng mát quê nhà. Tre không chỉ là một loài cây vô tri vô giác, mà từ bao đời nay đã là biểu tượng của sự kiên cường, của sự chở che và nét mộc mạc mang đậm hồn cốt Việt. Tại TRE MỘC, chúng mình khát khao đánh thức những giá trị truyền thống tốt đẹp ấy, thổi vào đó hơi thở của nhịp sống đương đại để tạo nên một \"nghệ thuật tiêu dùng xanh\".",
      "Cầm trên tay một chiếc bút tre, nhấp một ngụm nước từ chiếc ly tre hay sử dụng chiếc ống hút của TRE MỘC, bạn sẽ cảm nhận được độ nhám nhẹ rất thật của thớ gỗ, ngửi thấy mùi hương ngai ngái thoang thoảng của tự nhiên. Mỗi sản phẩm đều được những người thợ lành nghề chế tác với tất cả sự nâng niu và tỉ mỉ. Chúng mình theo đuổi phong cách tối giản, lược bỏ đi những chi tiết cầu kỳ, phô trương để giữ lại trọn vẹn nét nguyên bản nhất. Sự mộc mạc ấy không chỉ làm dịu đi những căng thẳng nơi góc bàn làm việc, mà còn giúp tâm hồn bạn xích lại gần hơn với vòng tay êm ái của Mẹ Thiên Nhiên.",
    ],
    image: "/images/bamboo-forest.jpg",
    imageAlt: "Rừng tre Việt Nam",
  },
  {
    emoji: "💌",
    title: "Dấu ấn cá nhân: Khắc ghi yêu thương trong từng thớ gỗ",
    paragraphs: [
      "TRE MỘC thấu hiểu sâu sắc rằng, một món đồ chỉ thực sự có linh hồn khi nó gắn liền với một câu chuyện, một kỷ niệm hay một bóng hình ai đó. Chúng mình không muốn những chiếc bút, chiếc ly chỉ là những vật dụng nằm lặng lẽ trên bàn. Chúng mình muốn chúng trở thành những \"người kể chuyện\" mang theo hơi ấm của tình cảm.",
      "Đó là lý do TRE MỘC mang đến trải nghiệm cá nhân hóa thông qua công nghệ khắc laser tỉ mỉ. Mỗi nét khắc sâu vào thân tre là một dấu ấn độc bản không thể trộn lẫn. Để rồi, khi món quà ấy được trao tay, nó không đơn thuần là một vật dụng hữu ích nữa, mà đã hóa thành một cái ôm vô hình, một lời thì thầm đầy yêu thương, lưu giữ vẹn nguyên cảm xúc thiêng liêng giữa người trao và người nhận.",
    ],
    highlights: [
      "Tên gọi thân thương của chính bạn hoặc một người mà bạn trân quý.",
      "Những thông điệp ấm áp, một câu châm ngôn hay lời động viên chân thành.",
      "Một cột mốc kỷ niệm không thể nào quên.",
    ],
    image: "/images/products/cup_logo.jpg",
    imageAlt: "Sản phẩm tre khắc cá nhân",
    reverse: true,
  },
  {
    emoji: "🌱",
    title: "Chạm tay vào tự nhiên: Hành trình xanh từ những lựa chọn nhỏ nhoi",
    paragraphs: [
      "Hành trình bảo vệ Trái Đất nghe có vẻ thật lớn lao, nhưng TRE MỘC mang trong mình một niềm tin mãnh liệt: Mọi sự thay đổi vĩ đại đều bắt đầu từ những hạt mầm bé nhỏ.",
      "Chỉ cần một chút để tâm, một thay đổi nhỏ bé trong những lựa chọn quen thuộc mỗi ngày, chúng ta đã và đang cùng nhau dệt nên một dải lụa xanh mát cho tương lai. Việc từ chối một chiếc ống hút nhựa để dùng ống hút tre, hay thay thế một chiếc bút bi nhựa dùng cạn rồi bỏ đi bằng một chiếc bút tre khắc tên mình... tuy thật nhỏ bé, nhẹ nhàng nhưng lại là những bước chân vô cùng vững chãi hướng tới lối sống bền vững.",
      "Hơn cả một thương hiệu cung cấp sản phẩm thân thiện với môi trường, TRE MỘC khao khát được trở thành một người bạn tri kỷ, một trạm dừng chân bình yên để cùng bạn chia sẻ tình yêu thiên nhiên và lan tỏa những giá trị chân thành nhất.",
    ],
    image: "/images/products/cup_close.jpg",
    imageAlt: "Lối sống xanh cùng Tre Mộc",
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
                NGHỆ THUẬT TIÊU DÙNG XANH
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              Câu Chuyện{" "}
              <span className="bg-gradient-to-r from-mint-light via-emerald-300 to-green-200 bg-clip-text text-transparent">
                TRE MỘC
              </span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed">
              Lối Sống Xanh Bắt Đầu Từ Những Yêu Thương Giản Dị Nhất 🌿
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mở đầu */}
        <article className="mb-20 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-border shadow-sm p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <img
                src="/images/logo-circle.png"
                alt="Tre Mộc"
                className="w-14 h-14 rounded-full ring-2 ring-forest/15"
              />
              <div>
                <p className="text-xs font-bold text-forest uppercase tracking-widest">
                  Lời mở đầu
                </p>
                <p className="text-sm text-muted">TRE MỘC — Nghệ thuật tiêu dùng xanh</p>
              </div>
            </div>

            <div className="space-y-5 text-muted leading-relaxed text-base md:text-lg">
              <p>
                Giữa guồng quay hối hả của nhịp sống hiện đại, đôi khi chúng ta mải miết chạy theo
                những tất bật của công việc mà vô tình bỏ quên tiếng thở nhẹ nhàng của thiên nhiên.
                Sự tiện lợi của những chiếc túi nilon hay ly nhựa dùng một lần đã trở thành một thói
                quen khó bỏ, len lỏi vào từng ngóc ngách của căn bếp, góc bàn làm việc hay trong
                những chuyến đi vội vã. Nhưng đằng sau vài phút giây tiện lợi ngắn ngủi ấy, đọng
                lại là tiếng thở dài của Trái Đất và những tổn thương vô hình mà chúng ta đang để
                lại cho môi trường tự nhiên.
              </p>
              <p>
                <strong className="text-forest font-semibold">TRE MỘC</strong> được ấp ủ và sinh ra
                từ chính những tiếng thở dài trăn trở ấy. Chúng mình không bắt đầu hành trình này
                bằng những lời kêu gọi vĩ mô hay những khẩu hiệu to tát. TRE MỘC ra đời từ một ước
                mong vô cùng bé nhỏ, hiền hòa: Mang đến cho bạn một người bạn đồng hành xanh mát,
                một sản phẩm lành tính từ thiên nhiên, để cùng nhau gieo mầm cho một lối sống bền
                vững và ý nghĩa hơn mỗi ngày.
              </p>
            </div>
          </div>
        </article>

        {/* Các chương câu chuyện */}
        <div className="space-y-16 md:space-y-24 mb-20">
          {storySections.map((section, i) => (
            <section
              key={section.title}
              className="animate-slideUp"
              style={{ animationDelay: `${i * 120}ms`, animationFillMode: "both" }}
            >
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${
                  section.reverse ? "md:[direction:rtl]" : ""
                }`}
              >
                <div className={`${section.reverse ? "md:[direction:ltr]" : ""}`}>
                  <div className="rounded-3xl overflow-hidden shadow-xl shadow-forest/10 aspect-[4/3]">
                    <img
                      src={section.image}
                      alt={section.imageAlt}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>

                <div className={`${section.reverse ? "md:[direction:ltr]" : ""}`}>
                  <span className="text-3xl mb-4 block">{section.emoji}</span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-dark mb-5 leading-snug">
                    {section.title}
                  </h2>
                  <div className="space-y-4 text-muted leading-relaxed">
                    {section.paragraphs.map((para) => (
                      <p key={para.slice(0, 40)}>{para}</p>
                    ))}
                  </div>

                  {section.highlights && (
                    <ul className="mt-6 space-y-3">
                      {section.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-slate-dark">
                          <span className="w-6 h-6 rounded-full bg-mint flex items-center justify-center shrink-0 mt-0.5">
                            <Heart size={12} className="text-forest" />
                          </span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Lời kết */}
        <div className="bg-gradient-to-br from-mint to-mint-light rounded-3xl border border-forest/10 p-8 md:p-12 mb-16 text-center animate-fadeIn">
          <Sparkles size={32} className="text-forest mx-auto mb-4" />
          <p className="text-lg md:text-xl text-slate-dark leading-relaxed max-w-2xl mx-auto font-medium">
            Nào, hãy đưa tay đây, cùng TRE MỘC viết tiếp câu chuyện của nghệ thuật tiêu dùng xanh,
            từ những điều giản dị và ấm áp nhất ngày hôm nay, bạn nhé! 🌿💚
          </p>
        </div>

        {/* CTA */}
        <div className="text-center bg-white rounded-3xl border border-border p-10 md:p-14 relative overflow-hidden animate-fadeIn shadow-sm">
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
              Cùng TRE MỘC <span className="text-forest">Sống Xanh</span> Mỗi Ngày
            </h2>
            <p className="text-muted mb-8 max-w-lg mx-auto leading-relaxed">
              Khám phá bộ sưu tập bút tre, ly tre, ống hút tre và trải nghiệm khắc cá nhân —
              bắt đầu hành trình xanh của bạn ngay hôm nay.
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
