import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, Package, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const navLinks = [
  { to: '/', label: 'Trang chủ' },
  { to: '/products', label: 'Sản phẩm' },
  { to: '/lookbook', label: 'Lookbook' },
  { to: '/about', label: 'Thông tin' },
  { to: '/story', label: 'Câu chuyện' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Liên hệ' },
];

const Header = () => {
  const { isAuthenticated, user, logout, openLogin, openRegister } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [shouldWiggle, setShouldWiggle] = useState(false);
  const prevTotalItems = useRef(totalItems);

  useEffect(() => {
    if (totalItems > prevTotalItems.current) {
      setShouldWiggle(true);
      const timer = setTimeout(() => setShouldWiggle(false), 400);
      prevTotalItems.current = totalItems;
      return () => clearTimeout(timer);
    }
    prevTotalItems.current = totalItems;
  }, [totalItems]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
  };

  return (
    <header className="bg-cream/95 backdrop-blur-md border-b border-border sticky top-0 z-40 transition-all duration-300 shadow-sm shadow-forest/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" id="header-logo">
            <img
              src="/images/logo-circle.png"
              alt="Tre Mộc Logo"
              className="h-14 w-14 rounded-full object-cover ring-2 ring-forest/10 transition-all duration-300 group-hover:scale-105 group-hover:ring-forest/25"
            />
            <div className="hidden sm:block">
              <p className="text-lg font-bold text-forest leading-tight tracking-wide">TRE MỘC</p>
              <p className="text-[10px] font-medium text-muted uppercase tracking-widest">Nghệ thuật tiêu dùng xanh</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-forest bg-forest/5'
                      : 'text-muted hover:text-forest hover:bg-forest/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            {user?.role !== 'Manager' && (
              <Link
                to="/cart"
                className={`relative p-2 rounded-lg hover:bg-forest/5 transition-colors group ${
                  shouldWiggle ? 'animate-wiggle' : ''
                }`}
                id="header-cart"
              >
                <ShoppingCart size={22} className="text-muted group-hover:text-forest transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-forest text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scaleIn">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Cluster */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-forest/5 transition-all duration-200"
                  id="header-user-menu"
                >
                  <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center">
                    <span className="text-forest font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-dark max-w-24 truncate">
                    {user?.name}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-muted transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-border py-2 animate-slideDown">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-semibold text-slate-dark">{user?.name}</p>
                      <p className="text-xs text-muted truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-forest hover:bg-forest/5 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User size={16} /> Tài khoản của tôi
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-forest hover:bg-forest/5 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Package size={16} /> Lịch sử đơn hàng
                    </Link>
                    {user?.role === 'Manager' && (
                      <Link
                        to="/manager"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-forest bg-forest/5 hover:bg-forest/10 transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <LayoutDashboard size={16} /> Trang quản lý
                      </Link>
                    )}
                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition-colors"
                        id="header-logout"
                      >
                        <LogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={openLogin}
                  className="px-4 py-2 text-sm font-medium text-forest hover:bg-forest/5 rounded-lg transition-all duration-200"
                  id="header-login"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={openRegister}
                  className="px-4 py-2 text-sm font-medium text-white bg-forest hover:bg-forest-dark rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-forest/25"
                  id="header-register"
                >
                  Đăng ký
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-forest/5 transition-colors"
              id="header-mobile-toggle"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white animate-slideDown">
          <div className="max-w-[1440px] mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? 'text-forest bg-forest/5' : 'text-muted hover:text-forest hover:bg-forest/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <div className="pt-3 border-t border-border mt-3 space-y-1">
                <p className="px-4 text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Tài khoản</p>
                <NavLink
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-muted hover:text-forest rounded-lg"
                >
                  Tài khoản của tôi
                </NavLink>
                <NavLink
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-muted hover:text-forest rounded-lg"
                >
                  Lịch sử đơn hàng
                </NavLink>
                {user?.role === 'Manager' && (
                  <NavLink
                    to="/manager"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold text-forest bg-forest/5 rounded-lg"
                  >
                    Trang quản lý
                  </NavLink>
                )}
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full text-left block px-4 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-lg mt-2"
                >
                  Đăng xuất
                </button>
              </div>
            )}
            {!isAuthenticated && (
              <div className="flex gap-2 pt-3 border-t border-border mt-3">
                <button onClick={() => { openLogin(); setMobileMenuOpen(false); }} className="flex-1 py-2.5 text-sm font-medium text-forest border border-forest rounded-lg hover:bg-forest/5 transition-colors">
                  Đăng nhập
                </button>
                <button onClick={() => { openRegister(); setMobileMenuOpen(false); }} className="flex-1 py-2.5 text-sm font-medium text-white bg-forest rounded-lg hover:bg-forest-dark transition-colors">
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
