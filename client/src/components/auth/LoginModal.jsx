import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, X, Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginModal = () => {
  const navigate = useNavigate();
  const { showLoginModal, closeModals, login, openRegister } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  if (!showLoginModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    const res = await login(email, password);
    if (!res.success) {
      setError(res.error);
    } else {
      const savedUser = localStorage.getItem('tremoc_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'Manager') {
          navigate('/manager');
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop animate-fadeIn" onClick={closeModals}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative animate-scaleIn"
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
          <h2 className="text-xl font-semibold text-slate-dark">Đăng nhập tài khoản</h2>
          <p className="text-muted text-sm mt-1">Chào mừng bạn trở lại!</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4 animate-slideDown">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-dark mb-1.5">Email hoặc Số điện thoại</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
              id="login-email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-dark mb-1.5">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm pr-12"
                id="login-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-slate-dark transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border text-forest focus:ring-forest"
              />
              <span className="text-sm text-muted">Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" className="text-sm text-forest hover:text-forest-dark font-medium transition-colors">
              Quên mật khẩu?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-forest hover:bg-forest-dark text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-forest/25 active:scale-[0.98]"
            id="login-submit"
          >
            Đăng nhập
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted mt-6">
          Chưa có tài khoản?{' '}
          <button
            onClick={openRegister}
            className="text-forest font-semibold hover:text-forest-dark transition-colors"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
