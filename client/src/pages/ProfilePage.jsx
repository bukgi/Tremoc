import { useState } from 'react';
import { User, Mail, Phone, ShoppingBag, Heart, Settings, Edit2, ShieldCheck, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  // Password change states
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setChangePassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Họ và tên không được để trống.');
      return;
    }

    if (changePassword) {
      if (!currentPassword) {
        setError('Vui lòng nhập mật khẩu hiện tại.');
        return;
      }
      if (!newPassword || newPassword.length < 6) {
        setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp.');
        return;
      }
    }

    setLoading(true);
    const result = await updateProfile({
      name,
      phone,
      currentPassword: changePassword ? currentPassword : '',
      newPassword: changePassword ? newPassword : ''
    });
    setLoading(false);

    if (result.success) {
      setSuccess('Cập nhật thông tin tài khoản thành công!');
      setIsEditing(false);
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setChangePassword(false);
      // Automatically clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Đã xảy ra lỗi khi cập nhật thông tin.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-dark animate-fadeIn">Tài khoản của tôi</h1>
          <p className="text-sm text-muted mt-1">Quản lý và cập nhật thông tin cá nhân của bạn</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-forest hover:bg-forest-dark text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Edit2 size={16} /> Chỉnh sửa thông tin
          </button>
        )}
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2.5 animate-slideDown">
          <CheckCircle size={18} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2.5 animate-slideDown">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 animate-slideUp">
          <div className="bg-white rounded-xl border border-border p-6 text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-forest"></div>
            <div className="w-24 h-24 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4 border-2 border-forest/20">
              <span className="text-4xl font-bold text-forest">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-slate-dark truncate px-2">{user?.name}</h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/5 text-forest text-xs font-semibold mt-2">
              <ShieldCheck size={13} /> {user?.role === 'Manager' ? 'Quản lý' : 'Khách hàng'}
            </div>
            <p className="text-xs text-muted mt-3 block truncate">{user?.email}</p>
          </div>
        </div>

        {/* Info & Edit Card */}
        <div className="md:col-span-2 animate-slideUp" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <h3 className="font-semibold text-slate-dark border-b border-border pb-3 text-lg flex items-center gap-2">
                  <User size={18} className="text-forest" /> Cập nhật thông tin
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-dark mb-1.5 uppercase tracking-wider">Họ và tên</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-dark mb-1.5 uppercase tracking-wider">Số điện thoại</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                      placeholder="0912345678"
                    />
                  </div>
                </div>

                {/* Password Change Toggle */}
                <div className="pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={changePassword}
                      onChange={(e) => setChangePassword(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-border text-forest focus:ring-forest transition-all"
                    />
                    <span className="text-sm font-medium text-slate-dark flex items-center gap-1.5">
                      <Lock size={15} /> Thay đổi mật khẩu
                    </span>
                  </label>
                </div>

                {/* Password Fields */}
                {changePassword && (
                  <div className="space-y-4 pt-2 border-t border-dashed border-border animate-slideDown">
                    <div>
                      <label className="block text-xs font-semibold text-slate-dark mb-1.5 uppercase tracking-wider">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-dark mb-1.5 uppercase tracking-wider">Mật khẩu mới</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                          placeholder="Tối thiểu 6 ký tự"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-dark mb-1.5 uppercase tracking-wider">Xác nhận mật khẩu mới</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                          placeholder="Nhập lại mật khẩu mới"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-gray-50 text-slate-dark cursor-pointer transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 rounded-lg bg-forest hover:bg-forest-dark text-white text-sm font-semibold cursor-pointer transition-all hover:shadow-md flex items-center gap-2"
                  >
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <h3 className="font-semibold text-slate-dark border-b border-border pb-3 text-lg">Thông tin cá nhân</h3>
                <div className="space-y-4.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-forest/5 flex items-center justify-center text-forest">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider font-semibold">Họ và tên</p>
                      <p className="text-sm font-semibold text-slate-dark mt-0.5">{user?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-forest/5 flex items-center justify-center text-forest">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider font-semibold">Email đăng nhập</p>
                      <p className="text-sm font-semibold text-slate-dark mt-0.5">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-forest/5 flex items-center justify-center text-forest">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider font-semibold">Số điện thoại</p>
                      <p className="text-sm font-semibold text-slate-dark mt-0.5">{user?.phone || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { icon: ShoppingBag, label: 'Đơn hàng của tôi', value: 'Chi tiết', color: 'bg-blue-50 text-blue-600', link: '/orders' },
              { icon: Heart, label: 'Sản phẩm yêu thích', value: '0 mục', color: 'bg-pink-50 text-pink-600', link: '#' },
              { icon: Settings, label: 'Cài đặt hệ thống', value: 'Quản lý', color: 'bg-gray-50 text-gray-600', link: '#' },
            ].map(({ icon: Icon, label, value, color, link }) => (
              <a href={link} key={label} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-dark group-hover:text-forest transition-colors">{label}</p>
                  <p className="text-xs text-muted mt-0.5">{value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
