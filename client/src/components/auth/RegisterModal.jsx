import { useState } from 'react';
import { Eye, EyeOff, X, Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PasswordStrength = ({ password }) => {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const labels = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh', 'Rất mạnh'];
  const colors = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-forest'];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= strength ? colors[strength] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${
        strength <= 1 ? 'text-red-500' : strength <= 2 ? 'text-orange-500' : strength <= 3 ? 'text-yellow-600' : 'text-green-600'
      }`}>
        Độ mạnh: {labels[strength]}
      </p>
    </div>
  );
};

const RegisterModal = () => {
  const { showRegisterModal, closeModals, register, openLogin } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');

  if (!showRegisterModal) return null;

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (!agreeTerms) {
      setError('Vui lòng đồng ý với Điều khoản dịch vụ');
      return;
    }
    const res = await register(formData);
    if (!res.success) {
      setError(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop animate-fadeIn" onClick={closeModals}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative animate-scaleIn max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={closeModals}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-muted" />
        </button>

        {/* Logo */}
        <div className="text-center mb-6 flex flex-col items-center">
          <img src="/images/logo-circle.png" alt="Tre Mộc Logo" className="h-20 w-20 rounded-full object-cover ring-2 ring-forest/10 mb-3" />
          <h2 className="text-xl font-semibold text-slate-dark">Tạo tài khoản mới</h2>
          <p className="text-muted text-sm mt-1">Tham gia cùng cộng đồng xanh!</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4 animate-slideDown">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-dark mb-1.5">Họ và tên *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={handleChange('fullName')}
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
              id="register-fullname"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-dark mb-1.5">Số điện thoại *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              placeholder="0912 345 678"
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
              id="register-phone"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-dark mb-1.5">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
              id="register-email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-dark mb-1.5">Mật khẩu *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange('password')}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm pr-12"
                id="register-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-slate-dark transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <PasswordStrength password={formData.password} />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-dark mb-1.5">Xác nhận mật khẩu *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder="Nhập lại mật khẩu"
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm pr-12"
                id="register-confirm-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-slate-dark transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-border text-forest focus:ring-forest"
            />
            <span className="text-sm text-muted">
              Tôi đồng ý với <a href="#" className="text-forest font-medium hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-forest font-medium hover:underline">Chính sách bảo mật</a> của Tre Mộc.
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-forest hover:bg-forest-dark text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-forest/25 active:scale-[0.98]"
            id="register-submit"
          >
            Đăng ký
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted mt-6">
          Đã có tài khoản?{' '}
          <button
            onClick={openLogin}
            className="text-forest font-semibold hover:text-forest-dark transition-colors"
          >
            Đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
