import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div>
      <section className="relative h-48 md:h-56 overflow-hidden">
        <img src="/images/craft-village.jpg" alt="Liên hệ Tre Mộc" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-forest/50 flex items-center justify-center">
          <div className="text-center text-white animate-fadeIn">
            <img src="/images/logo-circle.png" alt="Tre Mộc" className="w-14 h-14 rounded-full mx-auto mb-3 ring-2 ring-white/40" />
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Liên hệ</h1>
            <p className="text-white/90">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
          </div>
        </div>
      </section>

    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Contact Info */}
        <div className="animate-slideUp">
          <h2 className="text-xl font-semibold text-slate-dark mb-6">Thông tin liên hệ</h2>

          <div className="space-y-5 mb-8">
            {[
              { icon: MapPin, title: 'Địa chỉ', content: '123 Đường Láng, Đống Đa, Hà Nội, Việt Nam' },
              { icon: Phone, title: 'Điện thoại', content: '0123 456 789 / 024 3456 7890' },
              { icon: Mail, title: 'Email', content: 'hello@treviet.vn / support@treviet.vn' },
            ].map(({ icon: Icon, title, content }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-mint flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-forest" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-dark">{title}</p>
                  <p className="text-sm text-muted mt-0.5">{content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Working Hours */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className="text-forest" />
              <h3 className="font-semibold text-slate-dark">Giờ làm việc</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { day: 'Thứ 2 - Thứ 6', hours: '8:00 - 18:00', active: true },
                { day: 'Thứ 7', hours: '8:00 - 12:00', active: true },
                { day: 'Chủ nhật', hours: 'Nghỉ', active: false },
              ].map(({ day, hours, active }) => (
                <div key={day} className="flex justify-between items-center">
                  <span className="text-sm text-muted">{day}</span>
                  <span className={`text-sm font-medium ${active ? 'text-forest' : 'text-red-400'}`}>{hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="animate-slideUp" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <div className="bg-white rounded-xl border border-border p-6 lg:p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-dark mb-6">Gửi tin nhắn cho chúng tôi</h2>

            {submitted && (
              <div className="bg-mint border border-forest/20 text-forest rounded-lg px-4 py-3 mb-6 animate-slideDown text-sm font-medium">
                ✅ Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-dark mb-1.5">Họ và tên *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleChange('name')}
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                  id="contact-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-dark mb-1.5">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                  id="contact-email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-dark mb-1.5">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  placeholder="0912 345 678"
                  className="w-full px-4 py-3 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                  id="contact-phone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-dark mb-1.5">Tin nhắn *</label>
                <textarea
                  value={formData.message}
                  onChange={handleChange('message')}
                  placeholder="Nhập nội dung tin nhắn..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm resize-none"
                  id="contact-message"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-forest/25 active:scale-[0.98]"
                id="contact-submit"
              >
                <Send size={18} />
                Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ContactPage;
