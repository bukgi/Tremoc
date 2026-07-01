import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle, Camera, Play } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-dark text-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
              <img
                src="/images/logo-circle.png"
                alt="Tre Mộc"
                className="h-16 w-16 rounded-full object-cover ring-2 ring-white/20 group-hover:ring-forest-light/50 transition-all"
              />
              <div>
                <span className="text-xl font-bold text-white block">TRE MỘC</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Nghệ thuật tiêu dùng xanh</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Sản phẩm tre thân thiện môi trường, chế tác thủ công từ làng nghề Việt Nam. Mỗi sản phẩm là một câu chuyện về sự bền vững.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-forest flex items-center justify-center transition-colors">
                <MessageCircle size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-forest flex items-center justify-center transition-colors">
                <Camera size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-forest flex items-center justify-center transition-colors">
                <Play size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-300">Khám phá</h4>
            <ul className="space-y-2.5">
              {['Trang chủ', 'Sản phẩm', 'Lookbook', 'Câu chuyện', 'Blog'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-forest-light transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-300">Hỗ trợ</h4>
            <ul className="space-y-2.5">
              {['Chính sách đổi trả', 'Hướng dẫn mua hàng', 'Vận chuyển', 'Câu hỏi thường gặp', 'Điều khoản dịch vụ'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-forest-light transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-300">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-forest-light mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">Hòa Lạc, Hanoi, Vietnam</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-forest-light shrink-0" />
                <span className="text-sm text-gray-400">097 984 55 96</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-forest-light shrink-0" />
                <span className="text-sm text-gray-400">tremoc4@gmail.com</span>
              </li>
              <li className="flex items-center gap-4 pt-1.5 pl-[26px]">
                <a
                  href="https://www.facebook.com/tremoc4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-forest-light transition-all hover:scale-110 duration-200"
                  title="Facebook"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a
                  href="https://www.tiktok.com/@tremoc.official?is_from_webapp=1&sender_device=pc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-forest-light transition-all hover:scale-110 duration-200"
                  title="TikTok"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-xs text-gray-500">© 2026 Tre Mộc. Tất cả quyền được bảo lưu.</p>
            <div className="flex gap-4">
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Chính sách bảo mật</a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Điều khoản sử dụng</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
