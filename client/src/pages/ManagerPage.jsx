import { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingCart, Users, Package, RefreshCw, CheckCircle, AlertCircle, TrendingUp, Calendar, MapPin, Edit3, Plus, Trash2, X } from 'lucide-react';
import { apiFetch } from '../lib/api';

const ManagerPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Editing product stock states
  const [editingProductId, setEditingProductId] = useState(null);
  const [editStockVal, setEditStockVal] = useState(0);

  // Product CRUD states
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentProductId, setCurrentProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: 0,
    description: '',
    image: '',
    impactPlastic: '',
    impactCo2: '',
    impactWater: '',
    stockQuantity: 0
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch Orders
      const ordersRes = await apiFetch('/api/orders/all');
      if (!ordersRes.ok) throw new Error('Không thể tải danh sách đơn hàng');
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

      // Fetch Users
      const usersRes = await apiFetch('/api/users');
      if (!usersRes.ok) throw new Error('Không thể tải danh sách người dùng');
      const usersData = await usersRes.json();
      setUsers(usersData);

      // Fetch Products
      const productsRes = await apiFetch('/api/products');
      if (!productsRes.ok) throw new Error('Không thể tải danh sách sản phẩm');
      const productsData = await productsRes.json();
      setProducts(productsData);

    } catch (err) {
      setError(err.message || 'Lỗi kết nối tới server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setError('');
    setSuccessMsg('');
    try {
      const res = await apiFetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi cập nhật trạng thái đơn hàng');
      
      setSuccessMsg(`Đã cập nhật đơn hàng #${orderId} thành "${newStatus}"`);
      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    setError('');
    setSuccessMsg('');
    try {
      const res = await apiFetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi cập nhật vai trò người dùng');

      setSuccessMsg(`Đã cập nhật vai trò người dùng thành công.`);
      // Update local state
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateProductStock = async (productId) => {
    setError('');
    setSuccessMsg('');
    try {
      const res = await apiFetch(`/api/products/${productId}/stock`, {
        method: 'PUT',
        body: JSON.stringify({ stockQuantity: parseInt(editStockVal) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi cập nhật kho hàng');

      setSuccessMsg(`Đã cập nhật số lượng tồn kho sản phẩm.`);
      // Update local state
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stockQuantity: parseInt(editStockVal) } : p));
      setEditingProductId(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenProductModal = (product = null) => {
    setError('');
    setSuccessMsg('');
    if (product) {
      setModalMode('edit');
      setCurrentProductId(product.id);
      setProductForm({
        name: product.name || '',
        category: product.category || '',
        price: product.price || 0,
        description: product.description || '',
        image: product.image || '',
        impactPlastic: product.impact?.plastic || product.impactPlastic || '',
        impactCo2: product.impact?.co2 || product.impactCo2 || '',
        impactWater: product.impact?.water || product.impactWater || '',
        stockQuantity: product.stockQuantity || 0
      });
    } else {
      setModalMode('create');
      setCurrentProductId(null);
      setProductForm({
        name: '',
        category: '',
        price: 0,
        description: '',
        image: '',
        impactPlastic: '',
        impactCo2: '',
        impactWater: '',
        stockQuantity: 0
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!productForm.name || !productForm.category) {
      setError('Tên sản phẩm và Danh mục là bắt buộc.');
      return;
    }

    try {
      const url = modalMode === 'create' 
        ? '/api/products'
        : `/api/products/${currentProductId}`;
      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const res = await apiFetch(url, {
        method: method,
        body: JSON.stringify({
          name: productForm.name,
          category: productForm.category,
          price: parseFloat(productForm.price),
          description: productForm.description,
          image: productForm.image,
          impactPlastic: productForm.impactPlastic,
          impactCo2: productForm.impactCo2,
          impactWater: productForm.impactWater,
          stockQuantity: parseInt(productForm.stockQuantity)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi lưu sản phẩm');

      setSuccessMsg(modalMode === 'create' ? 'Thêm sản phẩm thành công!' : 'Cập nhật sản phẩm thành công!');
      setShowProductModal(false);
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.')) {
      return;
    }
    setError('');
    setSuccessMsg('');
    try {
      const res = await apiFetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi xóa sản phẩm');

      setSuccessMsg('Đã xóa sản phẩm thành công.');
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Calculations for dashboard overview
  const totalSales = orders
    .filter(o => o.status === 'Completed')
    .reduce((sum, o) => sum + o.total, 0);

  const statusColors = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Processing: 'bg-blue-50 text-blue-700 border-blue-200',
    Shipping: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="animate-spin text-forest" size={32} />
        <p className="text-muted text-sm font-medium">Đang tải dữ liệu quản trị...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-dark tracking-tight">Bảng Quản Trị Tre Mộc</h1>
          <p className="text-sm text-muted mt-1">Hệ thống giám sát và quản lý bán hàng, tồn kho và người dùng</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 border border-border bg-white hover:bg-gray-50 text-slate-dark rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-sm"
        >
          <RefreshCw size={16} /> Làm mới
        </button>
      </div>

      {/* Alert Notices */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2.5 animate-slideDown">
          <CheckCircle size={18} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2.5 animate-slideDown">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-border mb-8 overflow-x-auto scrollbar-thin">
        {[
          { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
          { id: 'orders', label: 'Quản lý đơn hàng', icon: ShoppingCart },
          { id: 'users', label: 'Quản lý người dùng', icon: Users },
          { id: 'products', label: 'Quản lý kho hàng', icon: Package }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-forest text-forest bg-forest/[0.02]'
                  : 'border-transparent text-muted hover:text-slate-dark hover:border-gray-300'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-6">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: 'Tổng Doanh Thu', value: `${totalSales.toLocaleString('vi-VN')} đ`, subtitle: 'Đơn hàng hoàn thành', icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
                { label: 'Tổng Đơn Hàng', value: orders.length.toString(), subtitle: 'Tất cả trạng thái', icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
                { label: 'Khách Hàng', value: users.filter(u => u.role === 'Customer').length.toString(), subtitle: 'Người dùng mua sắm', icon: Users, color: 'bg-indigo-50 text-indigo-600' },
                { label: 'Sản Phẩm', value: products.length.toString(), subtitle: 'Danh mục trưng bày', icon: Package, color: 'bg-amber-50 text-amber-600' }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="border border-border rounded-xl p-5 flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-dark mt-1">{stat.value}</p>
                      <p className="text-xs text-muted-light mt-1">{stat.subtitle}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <Icon size={24} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recents Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="border border-border rounded-xl p-5">
                <h3 className="font-bold text-slate-dark mb-4 text-base">Đơn hàng mới nhất</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex justify-between items-center py-2.5 border-b border-border last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-semibold text-slate-dark">Đơn hàng #{order.id}</p>
                        <p className="text-xs text-muted mt-0.5">{order.customerName} • {new Date(order.date).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-dark">{(order.total).toLocaleString('vi-VN')} đ</p>
                        <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-semibold mt-1 ${statusColors[order.status] || ''}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-sm text-muted text-center py-4">Chưa có đơn hàng nào.</p>}
                </div>
              </div>

              {/* Recent Users */}
              <div className="border border-border rounded-xl p-5">
                <h3 className="font-bold text-slate-dark mb-4 text-base">Người dùng mới</h3>
                <div className="space-y-4">
                  {users.slice(-5).reverse().map(user => (
                    <div key={user.id} className="flex justify-between items-center py-2.5 border-b border-border last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-semibold text-slate-dark">{user.name}</p>
                        <p className="text-xs text-muted mt-0.5">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${user.role === 'Manager' ? 'bg-forest/10 text-forest' : 'bg-gray-100 text-gray-700'}`}>
                          {user.role}
                        </span>
                        <p className="text-[10px] text-muted-light mt-1">Đăng ký: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-bold text-slate-dark text-lg border-b border-border pb-3">Danh sách đơn hàng</h3>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-border text-muted font-semibold">
                    <th className="p-4">Mã Đơn</th>
                    <th className="p-4">Ngày Đặt</th>
                    <th className="p-4">Khách Hàng</th>
                    <th className="p-4">Tổng Tiền</th>
                    <th className="p-4">Địa Chỉ</th>
                    <th className="p-4">Trạng Thái</th>
                    <th className="p-4 text-center">Cập Nhật Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-slate-dark">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-semibold">#{order.id}</td>
                      <td className="p-4 text-xs">
                        <div className="flex items-center gap-1.5 text-muted">
                          <Calendar size={13} />
                          {new Date(order.date).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-xs text-muted">{order.customerEmail}</div>
                      </td>
                      <td className="p-4 font-bold text-slate-dark">{(order.total).toLocaleString('vi-VN')} đ</td>
                      <td className="p-4 text-xs">
                        <div className="flex items-center gap-1.5 text-muted">
                          <MapPin size={13} />
                          {order.shippingProvince}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full border text-xs font-semibold ${statusColors[order.status] || ''}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-border text-xs focus:ring-2 focus:ring-forest/20 focus:border-forest outline-none transition-all"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipping">Shipping</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-muted">Chưa có đơn hàng nào trong hệ thống.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-bold text-slate-dark text-lg border-b border-border pb-3">Phân quyền & Người dùng</h3>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-border text-muted font-semibold">
                    <th className="p-4">ID</th>
                    <th className="p-4">Họ và Tên</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Số Điện Thoại</th>
                    <th className="p-4">Vai Trò</th>
                    <th className="p-4">Ngày Tạo</th>
                    <th className="p-4 text-center">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-slate-dark">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-semibold">#{user.id}</td>
                      <td className="p-4 font-medium">{user.name}</td>
                      <td className="p-4 text-muted">{user.email}</td>
                      <td className="p-4 text-muted">{user.phone || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === 'Manager' ? 'bg-forest/10 text-forest' : 'bg-gray-100 text-gray-700'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-muted">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleUpdateUserRole(user.id, user.role === 'Manager' ? 'Customer' : 'Manager')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                            user.role === 'Manager' 
                              ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                              : 'bg-forest/5 border-forest/20 text-forest hover:bg-forest/10'
                          }`}
                        >
                          Gán quyền {user.role === 'Manager' ? 'Customer' : 'Manager'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCTS & STOCK MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-3">
              <h3 className="font-bold text-slate-dark text-lg">Quản lý kho hàng & sản phẩm</h3>
              <button
                onClick={() => handleOpenProductModal()}
                className="flex items-center gap-2 px-4 py-2.5 bg-forest hover:bg-forest-dark text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-95"
              >
                <Plus size={16} /> Thêm sản phẩm mới
              </button>
            </div>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-border text-muted font-semibold">
                    <th className="p-4">Ảnh</th>
                    <th className="p-4">Tên Sản Phẩm</th>
                    <th className="p-4">Danh Mục</th>
                    <th className="p-4">Đơn Giá</th>
                    <th className="p-4">Tồn Kho</th>
                    <th className="p-4">Trạng Thái</th>
                    <th className="p-4 text-center">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-slate-dark">
                  {products.map(prod => (
                    <tr key={prod.id} className="hover:bg-gray-50/50">
                      <td className="p-4">
                        <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-lg object-cover border border-border" />
                      </td>
                      <td className="p-4 font-semibold text-slate-dark">{prod.name}</td>
                      <td className="p-4 text-muted">{prod.category}</td>
                      <td className="p-4 font-bold text-slate-dark">{(prod.price).toLocaleString('vi-VN')} đ</td>
                      <td className="p-4">
                        {editingProductId === prod.id ? (
                          <input
                            type="number"
                            value={editStockVal}
                            onChange={(e) => setEditStockVal(e.target.value)}
                            className="w-20 px-2 py-1 border border-forest rounded-lg text-sm outline-none focus:ring-2 focus:ring-forest/20"
                            min="0"
                          />
                        ) : (
                          <span className="font-semibold">{prod.stockQuantity} sản phẩm</span>
                        )}
                      </td>
                      <td className="p-4">
                        {prod.stockQuantity > 0 ? (
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Còn hàng
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            Hết hàng
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          {editingProductId === prod.id ? (
                            <>
                              <button
                                onClick={() => handleUpdateProductStock(prod.id)}
                                className="px-2.5 py-1.5 bg-forest hover:bg-forest-dark text-white rounded-lg text-xs font-semibold transition-colors"
                              >
                                Lưu
                              </button>
                              <button
                                onClick={() => setEditingProductId(null)}
                                className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-slate-dark rounded-lg text-xs font-medium transition-colors"
                              >
                                Hủy
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingProductId(prod.id);
                                  setEditStockVal(prod.stockQuantity);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-border hover:bg-gray-50 text-slate-dark rounded-lg text-xs font-semibold transition-all"
                                title="Sửa nhanh tồn kho"
                              >
                                Sửa kho
                              </button>
                              <button
                                onClick={() => handleOpenProductModal(prod)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-forest/5 border border-forest/20 hover:bg-forest/10 text-forest rounded-lg text-xs font-semibold transition-all"
                              >
                                <Edit3 size={13} /> Sửa chi tiết
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-all"
                              >
                                <Trash2 size={13} /> Xóa
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-muted">Chưa có sản phẩm nào trong kho.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Product Create/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setShowProductModal(false)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-400 hover:text-gray-600" />
            </button>

            <h3 className="text-xl font-bold text-slate-dark mb-6 border-b border-border pb-3">
              {modalMode === 'create' ? 'Thêm Sản Phẩm Mới' : 'Chỉnh Sửa Sản Phẩm'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-dark mb-1">Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="Ví dụ: Cốc Tre Mộc Tự Nhiên"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-slate-dark mb-1">Phân loại *</label>
                  <input
                    type="text"
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="Ví dụ: Cốc, Bát, Ống hút..."
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-slate-dark mb-1">Giá bán (đ) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="Ví dụ: 89000"
                  />
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-slate-dark mb-1">Tồn kho *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="Ví dụ: 100"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-slate-dark mb-1">Đường dẫn ảnh</label>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="Ví dụ: /images/bamboo_cups.png"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-dark mb-1">Mô tả sản phẩm</label>
                  <textarea
                    rows="3"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm resize-none"
                    placeholder="Nhập mô tả sản phẩm..."
                  />
                </div>

                {/* Impact Plastic */}
                <div>
                  <label className="block text-sm font-semibold text-slate-dark mb-1">Nhựa giảm thiểu (g)</label>
                  <input
                    type="text"
                    value={productForm.impactPlastic}
                    onChange={(e) => setProductForm({ ...productForm, impactPlastic: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="Ví dụ: 15g nhựa"
                  />
                </div>

                {/* Impact CO2 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-dark mb-1">CO2 giảm thiểu (kg)</label>
                  <input
                    type="text"
                    value={productForm.impactCo2}
                    onChange={(e) => setProductForm({ ...productForm, impactCo2: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="Ví dụ: 0.5kg CO2"
                  />
                </div>

                {/* Impact Water */}
                <div>
                  <label className="block text-sm font-semibold text-slate-dark mb-1">Nước tiết kiệm (L)</label>
                  <input
                    type="text"
                    value={productForm.impactWater}
                    onChange={(e) => setProductForm({ ...productForm, impactWater: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="Ví dụ: 12L nước"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 border border-border bg-white hover:bg-gray-50 text-slate-dark rounded-xl text-sm font-semibold transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-forest hover:bg-forest-dark text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-forest/20"
                >
                  {modalMode === 'create' ? 'Tạo Sản Phẩm' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerPage;
