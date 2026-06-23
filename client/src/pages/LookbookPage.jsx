import { Link } from "react-router-dom";
import {
  Camera,
  Leaf,
  ArrowRight,
  Sun,
  Coffee,
  Sparkles,
  ShoppingBag,
  Gift,
  Smile,
  PenTool,
  Heart,
} from "lucide-react";

const collections = [
  {
    id: "morning-coffee",
    title: "Cà Phê Sáng Cùng Cốc Tre",
    subtitle: "Khởi đầu ngày mới thật xanh",
    mood: "Ấm áp, thư thái, khởi đầu tươi mới",
    desc: "Không gì tuyệt vời hơn một buổi sáng Sài Gòn với ly cà phê sữa đá trong chiếc cốc tre khắc tên mình. Cốc tre giữ nhiệt tự nhiên — cà phê đá lâu tan hơn, cà phê nóng giữ ấm lâu hơn. Và điều đặc biệt: mỗi ngụm cà phê là một lần bạn chạm vào vân tre — chạm vào thiên nhiên giữa lòng phố thị. Với những chiếc cốc được khắc tên, buổi sáng của bạn trở thành một nghi thức cá nhân đầy ý nghĩa.",
    image: "/images/bamboo_cups.png",
    products: ["Cốc Tre 350ml", "Cốc Tre Khắc Tên", "Ống Hút Tre"],
    tips: [
      "Chọn cốc tre 350ml cho cà phê sữa đá — kích thước hoàn hảo cho một buổi sáng tràn đầy năng lượng",
      "Đặt cốc tre cạnh một chậu cây nhỏ và cuốn sổ tay — bộ ba 'sáng xanh' không thể thiếu",
      "Khắc tên hoặc một câu trích dẫn yêu thích lên cốc — mỗi sáng nhìn thấy là một lời nhắc nhở tích cực",
    ],
    palette: ["#8B6F47", "#C4A265", "#E8D5B7", "#F5F0E8", "#4A3728"],
  },
  {
    id: "smoothie-green",
    title: "Sinh Tố Xanh Cùng Ống Hút Tre",
    subtitle: "Khỏe cơ thể, lành hành tinh",
    mood: "Tươi mát, tràn đầy năng lượng, thuần khiết",
    desc: "Ly sinh tố xoài chuối buổi chiều trở nên trọn vẹn hơn với chiếc ống hút tre. Không còn vị nhựa khó chịu, không còn cảm giác tội lỗi khi vứt ống hút sau 15 phút sử dụng. Ống hút tre của Tre Mộc được chuốt thủ công từ thân tre non, đường kính 6-8mm — hoàn hảo cho mọi loại sinh tố từ đặc đến loãng. Sau khi dùng, chỉ cần rửa qua nước và để khô tự nhiên — một ống hút có thể đồng hành cùng bạn suốt 1-2 năm.",
    image: "/images/lookbook-kitchen.jpg",
    products: ["Ống Hút Tre", "Bộ Vệ Sinh Ống Hút", "Cốc Tre 400ml"],
    tips: [
      "Dùng cốc tre 400ml cho sinh tố — thành cốc dày giữ lạnh cực tốt cho đồ uống đá xay",
      "Kết hợp ống hút tre với ly thủy tinh trong suốt — màu xanh của sinh tố + màu tre = ảnh sống ảo cực đẹp",
      "Luôn mang theo ống hút tre trong túi khi ra ngoài — bạn sẽ bất ngờ vì số lần mình cần đến nó",
    ],
    palette: ["#4A7C59", "#68A678", "#A8C69F", "#FDF8EE", "#2C4A3A"],
  },
  {
    id: "office-personal",
    title: "Góc Làm Việc Cá Nhân Hóa",
    subtitle: "Bàn làm việc xanh, tinh thần sảng khoái",
    mood: "Tập trung, chuyên nghiệp, đầy cảm hứng",
    desc: "Bạn dành 8 tiếng mỗi ngày ở bàn làm việc — tại sao không biến nó thành một không gian truyền cảm hứng? Một chiếc cốc tre khắc tên đặt trên bàn là tuyên ngôn về phong cách sống của bạn. Nó nói rằng: 'Tôi quan tâm đến môi trường, tôi trân trọng đồ thủ công, và tôi không thích sự nhàm chán của cốc nhựa văn phòng.' Khắc logo công ty lên cốc tre cũng là một món quà tặng đồng nghiệp và đối tác đầy ý nghĩa.",
    image: "/images/lookbook-desk.jpg",
    products: ["Cốc Tre Khắc Tên", "Cốc Tre Khắc Logo", "Ống Hút Tre"],
    tips: [
      "Đặt cốc tre khắc tên bên cạnh màn hình — mỗi lần với tay uống nước là một lần mỉm cười với 'chính mình'",
      "Kết hợp cốc tre với đế lót ly bằng tre — đồng bộ và chuyên nghiệp hơn hẳn",
      "Đặt hàng cốc tre khắc logo cho cả team — một món quà vừa ý nghĩa vừa gắn kết đồng đội",
    ],
    palette: ["#5B6B5A", "#7D8F7C", "#C5CFB7", "#F7F5F0", "#3D4A3E"],
  },
  {
    id: "picnic-no-plastic",
    title: "Dã Ngoại Không Nhựa",
    subtitle: "Cuối tuần trọn vẹn, không rác thải",
    mood: "Tự do, vui tươi, gần gũi thiên nhiên",
    desc: "Cuối tuần, xách balo lên và đi. Nhưng lần này, hãy để những chiếc cốc nhựa dùng một lần ở lại siêu thị. Bộ cốc tre và ống hút tre là người bạn đồng hành lý tưởng cho mọi buổi picnic, cắm trại hay tiệc nướng ngoài trời. Cốc tre nhẹ bất ngờ — cả bộ 4 chiếc chỉ nặng chưa đến 1kg. Ống hút tre gọn trong túi vải nhỏ. Sau khi dùng, rửa qua nước suối, lau khô, và tiếp tục hành trình. Bạn tận hưởng thiên nhiên mà không để lại dấu chân nhựa.",
    image: "/images/lookbook-weekend.jpg",
    products: ["Bộ 4 Cốc Tre", "Bộ 6 Ống Hút Tre", "Túi Vải Đựng Ống Hút"],
    tips: [
      "Mỗi người một cốc tre riêng — vừa vệ sinh vừa dễ phân biệt nhờ vân tre khác nhau trên từng chiếc",
      "Dùng ống hút tre cho cả nước lọc lẫn nước trái cây — không bị mềm, không bị mùi như ống hút giấy",
      "Sau chuyến đi, phơi nắng cốc và ống hút 30 phút — tre sẽ khô hoàn toàn và sẵn sàng cho lần sau",
    ],
    palette: ["#7D9B76", "#A8C69F", "#E6D5B8", "#FFF8EE", "#4B6043"],
  },
  {
    id: "cafe-style",
    title: "Phong Cách Quán Cà Phê Tre",
    subtitle: "Mang chuẩn gu thẩm mỹ vào từng món đồ",
    mood: "Tinh tế, nghệ thuật, đậm chất Việt",
    desc: "Bạn có bao giờ bước vào một quán cà phê và bị ấn tượng bởi những chiếc cốc được phục vụ? Xu hướng 'cà phê không nhựa' đang lan tỏa mạnh mẽ tại các quán cà phê độc lập ở Hà Nội, Đà Nẵng và Sài Gòn. Cốc tre mang đến trải nghiệm uống hoàn toàn khác biệt: môi chạm vào vành tre mịn màng, tay cảm nhận hơi ấm từ thân tre tự nhiên. Nhiều quán đã đặt hàng trăm cốc tre có khắc tên quán — vừa là ly uống nước, vừa là 'billboard' di động mỗi khi khách check-in.",
    image: "/images/lookbook-tea.jpg",
    products: ["Cốc Tre 350ml", "Cốc Tre Khắc Logo", "Ống Hút Tre"],
    tips: [
      "Dùng cốc tre khắc logo quán cho đồ uống phục vụ tại chỗ — khách hàng sẽ nhớ thương hiệu bạn lâu hơn",
      "Trưng bày cốc tre trên kệ gỗ mở — bản thân cốc tre đã là một món decor tuyệt đẹp cho không gian quán",
      "Kết hợp cốc tre với khay trà tre và đĩa bánh gốm — bộ ba 'thủ công Việt Nam' khiến khách mê mẩn",
    ],
    palette: ["#6B5B4F", "#8B7355", "#C4A882", "#F5EDE0", "#3D3226"],
  },
  {
    id: "gift-engraved",
    title: "Quà Tặng Khắc Thủ Công",
    subtitle: "Món quà không thể mua ở siêu thị",
    mood: "Ấm áp, cá nhân, đầy cảm xúc",
    desc: "Bạn đã bao giờ đứng giữa siêu thị, bối rối không biết chọn quà gì cho người thân? Một chiếc cốc tre khắc tên người nhận, kèm theo ngày kỷ niệm hoặc một lời nhắn ngắn — đó không còn là một món quà, mà là một kỷ vật. Chúng tôi đã chứng kiến những giọt nước mắt hạnh phúc khi một người vợ nhận được cốc tre khắc tên chồng và ngày cưới, khi một người con tặng mẹ chiếc cốc khắc dòng chữ 'Cảm ơn mẹ', khi một founder tặng toàn bộ nhân viên cốc tre khắc tên riêng. Đây là món quà mà người nhận sẽ giữ gìn suốt đời — bởi nó được làm ra chỉ để dành riêng cho họ.",
    image: "/images/bamboo_tea_tray.png",
    products: ["Cốc Tre Khắc Tên", "Cốc Tre Khắc Lời Nhắn", "Hộp Quà Tre Mộc"],
    tips: [
      "Đặt trước 5-7 ngày cho cốc khắc thủ công — mỗi nét khắc cần thời gian để hoàn thiện",
      "Chọn hộp quà tre Mộc đi kèm — hộp làm từ tre ép, lót rơm tự nhiên, sẵn sàng để tặng ngay",
      "Viết một tấm thiệp tay đi kèm — sự kết hợp giữa chữ viết tay và chữ khắc trên tre tạo nên món quà đầy cảm xúc",
    ],
    palette: ["#8B4545", "#C47A4A", "#D4A76A", "#FAF3E8", "#5C3030"],
  },
];

const engravingExamples = [
  {
    label: "Khắc tên cá nhân",
    desc: '"Minh", "Lan Anh", "Mr. James" — tên bạn, được khắc bằng tất cả sự tỉ mỉ',
  },
  {
    label: "Khắc ngày kỷ niệm",
    desc: '"20.10.2025", "Kỷ niệm ngày cưới" — lưu giữ khoảnh khắc quan trọng mãi mãi',
  },
  {
    label: "Khắc lời nhắn",
    desc: '"Cảm ơn mẹ", "Mãi bên nhau", "You are my sunshine" — những lời từ trái tim',
  },
  {
    label: "Khắc logo & thương hiệu",
    desc: "Logo công ty, tên quán cà phê, biểu tượng riêng — tre mang thương hiệu của bạn",
  },
  {
    label: "Khắc họa tiết truyền thống",
    desc: "Hoa sen, trống đồng, họa tiết dân tộc — văn hóa Việt Nam trên từng thớ tre",
  },
];

const LookbookPage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[28rem] md:h-[34rem] overflow-hidden">
        <img
          src="/images/hero-bamboo.jpg"
          alt="Lookbook Tre Mộc"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/20 via-forest/50 to-forest/90 flex items-end pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Camera size={16} />
              <span className="text-sm font-medium tracking-wide">
                LOOKBOOK 2025
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight">
              Sống Xanh Cùng{" "}
              <span className="bg-gradient-to-r from-mint-light via-emerald-300 to-green-200 bg-clip-text text-transparent">
                Cốc Tre & Ống Hút Tre
              </span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed">
              Khám phá 6 phong cách sống với cốc tre và ống hút tre — từ buổi
              sáng cà phê một mình, bữa sinh tố trưa hè, góc làm việc cá nhân,
              đến những chuyến dã ngoại cuối tuần và món quà khắc thủ công đầy ý
              nghĩa.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-mint rounded-full px-4 py-1.5 text-forest text-sm font-semibold mb-4">
            <Coffee size={16} /> Bộ sưu tập theo phong cách sống
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-dark mb-4">
            Chiếc Cốc Của Bạn,{" "}
            <span className="text-forest">Phong Cách Của Bạn</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto leading-relaxed">
            Mỗi người có một cách tận hưởng cuộc sống khác nhau — người thích cà
            phê sáng một mình, người mê sinh tố healthy, người yêu những buổi dã
            ngoại cuối tuần. Dù bạn là ai, luôn có một chiếc cốc tre và ống hút
            tre dành riêng cho phong cách của bạn.
          </p>
        </div>
      </div>

      {/* Collections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="space-y-16 md:space-y-24">
          {collections.map((collection, i) => (
            <div
              key={collection.id}
              className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-12 items-center animate-slideUp`}
              style={{
                animationDelay: `${i * 150}ms`,
                animationFillMode: "both",
              }}
            >
              {/* Image */}
              <div className="w-full md:w-1/2">
                <div className="relative rounded-3xl overflow-hidden group shadow-xl">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-bold text-forest">
                    {collection.mood.split(",")[0]}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2">
                <span className="text-xs font-bold text-forest uppercase tracking-widest bg-forest/5 px-3 py-1 rounded-full">
                  {collection.subtitle}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-dark mt-3 mb-3">
                  {collection.title}
                </h2>
                <p className="text-muted leading-relaxed mb-6">
                  {collection.desc}
                </p>

                {/* Color Palette */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                    Bảng màu
                  </span>
                  <div className="flex gap-1.5">
                    {collection.palette.map((color) => (
                      <div
                        key={color}
                        className="w-5 h-5 rounded-full border border-border shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Products */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                    Sản phẩm trong bộ sưu tập
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {collection.products.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1.5 bg-mint text-forest text-sm font-medium px-3 py-2 rounded-xl"
                      >
                        <Leaf size={14} />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Styling Tips */}
                <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles size={14} /> Mẹo sử dụng
                  </p>
                  <ul className="space-y-2">
                    {collection.tips.map((tip, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-dark/80 leading-relaxed"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalization / Engraving Section */}
      <div className="bg-mint-light py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-forest text-sm font-semibold mb-4 shadow-sm">
              <PenTool size={16} /> Cá nhân hóa
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-dark mb-4">
              Chiếc Cốc Của Riêng Bạn —{" "}
              <span className="text-forest">Không Đụng Hàng</span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto leading-relaxed">
              Mỗi chiếc cốc tre đều có vân tre tự nhiên độc nhất. Khi bạn thêm
              một dòng khắc thủ công, chiếc cốc ấy trở thành tác phẩm không thể
              sao chép — chỉ có một trên đời.
            </p>
          </div>

          {/* Engraving examples */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {engravingExamples.map((example, idx) => (
              <div
                key={example.label}
                className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300 animate-slideUp"
                style={{
                  animationDelay: `${idx * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                  {idx === 0 && <Heart size={20} className="text-amber-700" />}
                  {idx === 1 && <Sun size={20} className="text-amber-700" />}
                  {idx === 2 && <Smile size={20} className="text-amber-700" />}
                  {idx === 3 && (
                    <ShoppingBag size={20} className="text-amber-700" />
                  )}
                  {idx === 4 && (
                    <Sparkles size={20} className="text-amber-700" />
                  )}
                </div>
                <h3 className="font-bold text-slate-dark mb-2">
                  {example.label}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {example.desc}
                </p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-border shadow-sm">
            <h3 className="text-xl font-bold text-slate-dark text-center mb-8">
              Cách Đặt Cốc Tre Khắc Thủ Công
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Chọn cốc & nội dung",
                  desc: "Chọn kích thước cốc (350ml hoặc 400ml) và nội dung bạn muốn khắc: tên, ngày, lời nhắn, logo, họa tiết.",
                },
                {
                  step: "02",
                  title: "Nghệ nhân khắc tay",
                  desc: "Đội ngũ thợ khắc của Tre Mộc sẽ thực hiện từng nét khắc bằng tay — không máy móc, không in laser.",
                },
                {
                  step: "03",
                  title: "Nhận tác phẩm độc bản",
                  desc: "Sau 5-7 ngày, bạn nhận được chiếc cốc của riêng mình — kèm hộp quà và thiệp từ xưởng Tre Mộc.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-forest text-white flex items-center justify-center text-xl font-extrabold mb-4 mx-auto">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-slate-dark mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-16">
        <div className="bg-gradient-to-r from-forest to-emerald-800 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden animate-fadeIn">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-white text-sm font-medium">
              <Gift size={16} /> Sẵn sàng sở hữu chiếc cốc của riêng bạn?
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Chọn Phong Cách Sống Xanh Của Bạn
            </h2>
            <p className="text-white/70 mb-8 max-w-lg mx-auto leading-relaxed">
              Từ cốc tre khắc tên cho buổi sáng cà phê, đến bộ ống hút tre cho
              những chuyến dã ngoại — mỗi sản phẩm Tre Mộc là một bước nhỏ hướng
              tới lối sống không nhựa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-white text-forest font-bold px-8 py-4 rounded-full hover:bg-mint-light transition-all hover:shadow-2xl active:scale-95"
              >
                Mua sắm ngay
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/story"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-all active:scale-95"
              >
                Đọc câu chuyện Tre Mộc
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookbookPage;
