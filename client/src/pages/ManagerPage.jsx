import { useState, useEffect, useRef, Fragment } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  MapPin,
  Edit3,
  Plus,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  ChevronDown,
  ChevronUp,
  Truck,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { apiFetch, uploadFiles } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const STATUS_STEPS = [
  { key: "Pending", label: "Chờ xác nhận", icon: Clock },
  { key: "Processing", label: "Đang xử lý", icon: Package },
  { key: "Shipping", label: "Đang giao hàng", icon: Truck },
  { key: "Completed", label: "Hoàn thành", icon: CheckCircle2 },
];

const STATUS_INDEX = Object.fromEntries(STATUS_STEPS.map((s, i) => [s.key, i]));

const ManagerPage = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Editing product stock states
  const [editingProductId, setEditingProductId] = useState(null);
  const [editStockVal, setEditStockVal] = useState(0);

  // Product CRUD states
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [currentProductId, setCurrentProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: 0,
    description: "",
    image: "",
    images: [],
    impactPlastic: "",
    impactCo2: "",
    impactWater: "",
    stockQuantity: 0,
  });

  // Image upload states
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch Orders
      const ordersRes = await apiFetch("/api/orders/all");
      if (!ordersRes.ok) throw new Error("Không thể tải danh sách đơn hàng");
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

      // Fetch Users
      const usersRes = await apiFetch("/api/users");
      if (!usersRes.ok) throw new Error("Không thể tải danh sách người dùng");
      const usersData = await usersRes.json();
      setUsers(usersData);

      // Fetch Products
      const productsRes = await apiFetch("/api/products");
      if (!productsRes.ok) throw new Error("Không thể tải danh sách sản phẩm");
      const productsData = await productsRes.json();
      setProducts(productsData);
    } catch (err) {
      setError(err.message || "Lỗi kết nối tới server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setError("");
    setSuccessMsg("");
    try {
      const res = await apiFetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Lỗi cập nhật trạng thái đơn hàng");

      setSuccessMsg(`Đã cập nhật đơn hàng #${orderId} thành "${newStatus}"`);
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleUserStatus = async (userId, newIsActive) => {
    setError("");
    setSuccessMsg("");
    try {
      const res = await apiFetch(`/api/users/${userId}/status`, {
        method: "PUT",
        body: JSON.stringify({ isActive: newIsActive }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Lỗi cập nhật trạng thái người dùng");

      setSuccessMsg(newIsActive ? "Đã mở khóa tài khoản thành công." : "Đã khóa tài khoản thành công.");
      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: newIsActive } : u)),
      );
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateProductStock = async (productId) => {
    setError("");
    setSuccessMsg("");
    try {
      const res = await apiFetch(`/api/products/${productId}/stock`, {
        method: "PUT",
        body: JSON.stringify({ stockQuantity: parseInt(editStockVal) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi cập nhật kho hàng");

      setSuccessMsg(`Đã cập nhật số lượng tồn kho sản phẩm.`);
      // Update local state
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, stockQuantity: parseInt(editStockVal) }
            : p,
        ),
      );
      setEditingProductId(null);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenProductModal = (product = null) => {
    setError("");
    setSuccessMsg("");
    setUploadedImages([]);
    if (product) {
      setModalMode("edit");
      setCurrentProductId(product.id);
      // Lấy danh sách ảnh từ product.images (API trả về mảng)
      const existingImages =
        product.images && product.images.length > 0
          ? product.images
          : product.image
            ? [product.image]
            : [];
      setProductForm({
        name: product.name || "",
        category: product.category || "",
        price: product.price || 0,
        description: product.description || "",
        image: product.image || "",
        images: existingImages,
        impactPlastic: product.impact?.plastic || product.impactPlastic || "",
        impactCo2: product.impact?.co2 || product.impactCo2 || "",
        impactWater: product.impact?.water || product.impactWater || "",
        stockQuantity: product.stockQuantity || 0,
      });
      setUploadedImages(existingImages);
    } else {
      setModalMode("create");
      setCurrentProductId(null);
      setProductForm({
        name: "",
        category: "",
        price: 0,
        description: "",
        image: "",
        images: [],
        impactPlastic: "",
        impactCo2: "",
        impactWater: "",
        stockQuantity: 0,
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!productForm.name || !productForm.category) {
      setError("Tên sản phẩm và Danh mục là bắt buộc.");
      return;
    }

    try {
      const url =
        modalMode === "create"
          ? "/api/products"
          : `/api/products/${currentProductId}`;
      const method = modalMode === "create" ? "POST" : "PUT";

      const res = await apiFetch(url, {
        method: method,
        body: JSON.stringify({
          name: productForm.name,
          category: productForm.category,
          price: parseFloat(productForm.price),
          description: productForm.description,
          image: productForm.image,
          images:
            productForm.images && productForm.images.length > 0
              ? productForm.images
              : null,
          impactPlastic: productForm.impactPlastic,
          impactCo2: productForm.impactCo2,
          impactWater: productForm.impactWater,
          stockQuantity: parseInt(productForm.stockQuantity),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi lưu sản phẩm");

      setSuccessMsg(
        modalMode === "create"
          ? "Thêm sản phẩm thành công!"
          : "Cập nhật sản phẩm thành công!",
      );
      setShowProductModal(false);
      fetchData();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.",
      )
    ) {
      return;
    }
    setError("");
    setSuccessMsg("");
    try {
      const res = await apiFetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi xóa sản phẩm");

      setSuccessMsg("Đã xóa sản phẩm thành công.");
      fetchData();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Xử lý upload ảnh từ máy
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate trước khi upload
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError(
          `File "${file.name}" không đúng định dạng ảnh (chỉ chấp nhận JPG, PNG, WebP, GIF).`,
        );
        return;
      }
      if (file.size > maxSize) {
        setError(`File "${file.name}" vượt quá dung lượng cho phép (5MB).`);
        return;
      }
    }

    setUploading(true);
    setError("");
    try {
      const res = await uploadFiles("/api/products/upload", files);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload ảnh thất bại.");

      // Thêm ảnh đã upload vào danh sách
      const newUrls = data.urls || [];
      const updatedImages = [...uploadedImages, ...newUrls];
      setUploadedImages(updatedImages);

      // Tự động set ảnh chính nếu chưa có
      setProductForm((prev) => ({
        ...prev,
        image: prev.image || newUrls[0] || "",
        images: updatedImages,
      }));

      setSuccessMsg(`Đã tải lên ${newUrls.length} ảnh thành công!`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      // Reset file input để có thể chọn lại cùng file
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Xóa ảnh khỏi danh sách preview
  const handleRemoveImage = (index) => {
    const updated = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updated);
    setProductForm((prev) => ({
      ...prev,
      images: updated,
      image: index === 0 ? updated[0] || "" : prev.image,
    }));
  };

  // Chọn ảnh chính từ gallery
  const handleSetMainImage = (index) => {
    const url = uploadedImages[index];
    if (!url) return;
    // Đưa ảnh được chọn lên đầu
    const updated = [url, ...uploadedImages.filter((_, i) => i !== index)];
    setUploadedImages(updated);
    setProductForm((prev) => ({
      ...prev,
      image: url,
      images: updated,
    }));
  };

  // Calculations for dashboard overview
  const totalSales = orders
    .filter((o) => o.status === "Completed")
    .reduce((sum, o) => sum + o.total, 0);

  const statusColors = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Processing: "bg-blue-50 text-blue-700 border-blue-200",
    Shipping: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="animate-spin text-forest" size={32} />
        <p className="text-muted text-sm font-medium">
          Đang tải dữ liệu quản trị...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-dark tracking-tight">
            Bảng Quản Trị Tre Mộc
          </h1>
          <p className="text-sm text-muted mt-1">
            Hệ thống giám sát và quản lý bán hàng, tồn kho và người dùng
          </p>
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
          { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
          { id: "orders", label: "Quản lý đơn hàng", icon: ShoppingCart },
          { id: "users", label: "Quản lý người dùng", icon: Users },
          { id: "products", label: "Quản lý kho hàng", icon: Package },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-forest text-forest bg-forest/[0.02]"
                  : "border-transparent text-muted hover:text-slate-dark hover:border-gray-300"
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
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  label: "Tổng Doanh Thu",
                  value: `${totalSales.toLocaleString("vi-VN")} đ`,
                  subtitle: "Đơn hàng hoàn thành",
                  icon: TrendingUp,
                  color: "bg-emerald-50 text-emerald-600",
                },
                {
                  label: "Tổng Đơn Hàng",
                  value: orders.length.toString(),
                  subtitle: "Tất cả trạng thái",
                  icon: ShoppingCart,
                  color: "bg-blue-50 text-blue-600",
                },
                {
                  label: "Khách Hàng",
                  value: users
                    .filter((u) => u.role === "Customer")
                    .length.toString(),
                  subtitle: "Người dùng mua sắm",
                  icon: Users,
                  color: "bg-indigo-50 text-indigo-600",
                },
                {
                  label: "Sản Phẩm",
                  value: products.length.toString(),
                  subtitle: "Danh mục trưng bày",
                  icon: Package,
                  color: "bg-amber-50 text-amber-600",
                },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className="border border-border rounded-xl p-5 flex items-center justify-between shadow-xs"
                  >
                    <div>
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-slate-dark mt-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-light mt-1">
                        {stat.subtitle}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
                    >
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
                <h3 className="font-bold text-slate-dark mb-4 text-base">
                  Đơn hàng mới nhất
                </h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center py-2.5 border-b border-border last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-dark">
                          Đơn hàng #{order.id}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {order.customerName} •{" "}
                          {new Date(order.date).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-dark">
                          {order.total.toLocaleString("vi-VN")} đ
                        </p>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-semibold mt-1 ${statusColors[order.status] || ""}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-sm text-muted text-center py-4">
                      Chưa có đơn hàng nào.
                    </p>
                  )}
                </div>
              </div>

              {/* Recent Users */}
              <div className="border border-border rounded-xl p-5">
                <h3 className="font-bold text-slate-dark mb-4 text-base">
                  Người dùng mới
                </h3>
                <div className="space-y-4">
                  {users
                    .slice(-5)
                    .reverse()
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex justify-between items-center py-2.5 border-b border-border last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-dark">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted mt-0.5">
                            {user.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${user.role === "Manager" ? "bg-forest/10 text-forest" : "bg-gray-100 text-gray-700"}`}
                          >
                            {user.role}
                          </span>
                          <p className="text-[10px] text-muted-light mt-1">
                            Đăng ký:{" "}
                            {new Date(user.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-bold text-slate-dark text-lg border-b border-border pb-3">
              Danh sách đơn hàng
            </h3>
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
                  {orders.map((order) => (
                    <Fragment key={order.id}>
                      <tr
                        className="hover:bg-gray-50/50 cursor-pointer"
                        onClick={() =>
                          setExpandedOrderId(
                            expandedOrderId === order.id ? null : order.id,
                          )
                        }
                      >
                        <td className="p-4 font-semibold">
                          <span className="inline-flex items-center gap-1.5">
                            {expandedOrderId === order.id ? (
                              <ChevronUp size={15} className="text-muted" />
                            ) : (
                              <ChevronDown size={15} className="text-muted" />
                            )}
                            #{order.id}
                          </span>
                        </td>
                        <td className="p-4 text-xs">
                          <div className="flex items-center gap-1.5 text-muted">
                            <Calendar size={13} />
                            {new Date(order.date).toLocaleDateString("vi-VN")}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">
                            {order.customerName}
                          </div>
                          <div className="text-xs text-muted">
                            {order.customerEmail}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-dark">
                          {order.total.toLocaleString("vi-VN")} đ
                        </td>
                        <td className="p-4 text-xs">
                          <div
                            className="flex items-center gap-1.5 text-muted max-w-[140px]"
                            title={
                              order.shippingAddress || order.shippingProvince
                            }
                          >
                            <MapPin size={13} className="shrink-0" />
                            <span className="truncate">
                              {order.shippingAddress || order.shippingProvince}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full border text-xs font-semibold ${statusColors[order.status] || ""}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td
                          className="p-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.id, e.target.value)
                            }
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
                      {expandedOrderId === order.id && (
                        <tr className="bg-gray-50/30">
                          <td colSpan={7} className="p-0">
                            <div className="px-6 py-5 space-y-5 animate-slideDown border-t border-border">
                              <div className="flex flex-wrap gap-6">
                                <div className="bg-white rounded-lg border border-border p-4 flex-1 min-w-[200px]">
                                  <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                    Thông tin khách hàng
                                  </h4>
                                  <p className="text-sm font-medium text-slate-dark">
                                    {order.customerName}
                                  </p>
                                  <p className="text-xs text-muted mt-1">
                                    {order.customerEmail}
                                  </p>
                                  {order.customerPhone &&
                                    order.customerPhone !== "N/A" && (
                                      <p className="text-xs text-muted mt-0.5">
                                        {order.customerPhone}
                                      </p>
                                    )}
                                </div>
                                <div className="bg-white rounded-lg border border-border p-4 flex-1 min-w-[200px]">
                                  <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                    Địa chỉ giao hàng
                                  </h4>
                                  <p className="text-sm text-slate-dark">
                                    {order.shippingAddress ||
                                      order.shippingProvince ||
                                      "Chưa có"}
                                  </p>
                                </div>
                                <div className="bg-white rounded-lg border border-border p-4 flex-1 min-w-[180px]">
                                  <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                    Tổng đơn hàng
                                  </h4>
                                  <p className="text-lg font-bold text-forest">
                                    {order.total.toLocaleString("vi-VN")} đ
                                  </p>
                                  <div className="text-xs text-muted mt-1 space-y-0.5">
                                    <p>
                                      Tạm tính:{" "}
                                      {(
                                        order.total - (order.shippingFee || 0)
                                      ).toLocaleString("vi-VN")}{" "}
                                      đ
                                    </p>
                                    <p>
                                      Phí ship:{" "}
                                      {(order.shippingFee || 0) === 0
                                        ? "Miễn phí"
                                        : `${order.shippingFee.toLocaleString("vi-VN")} đ`}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                                  Sản phẩm ({order.items?.length || 0})
                                </h4>
                                <div className="space-y-2">
                                  {order.items?.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-4 bg-white rounded-lg border border-border p-3"
                                    >
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-12 h-12 rounded-lg object-cover bg-bg-off"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-dark">
                                          {item.name}
                                        </p>
                                        <p className="text-xs text-muted">
                                          SL: {item.quantity} ×{" "}
                                          {item.price?.toLocaleString("vi-VN")}{" "}
                                          đ
                                        </p>
                                      </div>
                                      <p className="text-sm font-semibold text-slate-dark">
                                        {(
                                          item.price * item.quantity
                                        ).toLocaleString("vi-VN")}{" "}
                                        đ
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                                  Trạng thái đơn hàng
                                </h4>
                                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                  {STATUS_STEPS.map((step, idx) => {
                                    const currentIdx =
                                      STATUS_INDEX[order.status] ?? -1;
                                    const isCompleted = idx <= currentIdx;
                                    const isActive = idx === currentIdx;
                                    const isCancelled =
                                      order.status === "Cancelled";
                                    const StepIcon = step.icon;
                                    return (
                                      <Fragment key={step.key}>
                                        <div
                                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                                            isCancelled && isActive
                                              ? "bg-rose-50 border-rose-200 text-rose-600"
                                              : isCompleted
                                                ? "bg-forest/10 border-forest/30 text-forest"
                                                : "bg-white border-gray-200 text-muted"
                                          }`}
                                        >
                                          <StepIcon size={14} />
                                          <span>{step.label}</span>
                                        </div>
                                        {idx < STATUS_STEPS.length - 1 && (
                                          <div
                                            className={`w-6 h-0.5 shrink-0 ${
                                              idx < currentIdx && !isCancelled
                                                ? "bg-forest"
                                                : "bg-gray-200"
                                            }`}
                                          />
                                        )}
                                      </Fragment>
                                    );
                                  })}
                                  {order.status === "Cancelled" && (
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium bg-rose-50 border-rose-200 text-rose-600 shrink-0">
                                      <Circle size={14} />
                                      <span>Đã hủy</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-muted">
                        Chưa có đơn hàng nào trong hệ thống.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: USERS MANAGEMENT */}
        {activeTab === "users" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-bold text-slate-dark text-lg border-b border-border pb-3">
              Quản lý tài khoản & Người dùng
            </h3>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-border text-muted font-semibold">
                    <th className="p-4">ID</th>
                    <th className="p-4">Họ và Tên</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Số Điện Thoại</th>
                    <th className="p-4">Trạng Thái</th>
                    <th className="p-4">Ngày Tạo</th>
                    <th className="p-4 text-center">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-slate-dark">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-semibold">#{user.id}</td>
                      <td className="p-4 font-medium">{user.name}</td>
                      <td className="p-4 text-muted">{user.email}</td>
                      <td className="p-4 text-muted">{user.phone || "N/A"}</td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            user.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {user.isActive ? "Hoạt động" : "Đã khóa"}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-muted">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="p-4 text-center">
                        {currentUser?.id === user.id ? (
                          <span className="text-xs text-muted italic">Tài khoản của bạn</span>
                        ) : (
                          <button
                            onClick={() =>
                              handleToggleUserStatus(user.id, !user.isActive)
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                              user.isActive
                                ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                                : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {user.isActive ? "Khóa tài khoản" : "Kích hoạt"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCTS & STOCK MANAGEMENT */}
        {activeTab === "products" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-3">
              <h3 className="font-bold text-slate-dark text-lg">
                Quản lý kho hàng & sản phẩm
              </h3>
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
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/50">
                      <td className="p-4">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-cover border border-border"
                        />
                      </td>
                      <td className="p-4 font-semibold text-slate-dark">
                        {prod.name}
                      </td>
                      <td className="p-4 text-muted">{prod.category}</td>
                      <td className="p-4 font-bold text-slate-dark">
                        {prod.price.toLocaleString("vi-VN")} đ
                      </td>
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
                          <span className="font-semibold">
                            {prod.stockQuantity} sản phẩm
                          </span>
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
                                onClick={() =>
                                  handleUpdateProductStock(prod.id)
                                }
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
                      <td colSpan="7" className="p-8 text-center text-muted">
                        Chưa có sản phẩm nào trong kho.
                      </td>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setShowProductModal(false)}
        >
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
              {modalMode === "create"
                ? "Thêm Sản Phẩm Mới"
                : "Chỉnh Sửa Sản Phẩm"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-dark mb-1">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="Ví dụ: Cốc Tre Mộc Tự Nhiên"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-slate-dark mb-1">
                    Phân loại *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="Ví dụ: Cốc, Bát, Ống hút..."
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-slate-dark mb-1">
                    Giá bán (đ) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="Ví dụ: 89000"
                  />
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-slate-dark mb-1">
                    Tồn kho *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stockQuantity}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        stockQuantity: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="Ví dụ: 100"
                  />
                </div>

                {/* Upload ảnh sản phẩm */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-dark mb-2">
                    Hình ảnh sản phẩm
                  </label>

                  {/* Khu vực kéo thả / chọn ảnh */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      uploading
                        ? "border-forest/30 bg-forest/5 pointer-events-none"
                        : "border-border hover:border-forest hover:bg-mint/50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2
                          size={28}
                          className="animate-spin text-forest"
                        />
                        <span className="text-sm text-muted">
                          Đang tải ảnh lên...
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={28} className="text-muted" />
                        <span className="text-sm font-medium text-slate-dark">
                          Nhấn để chọn ảnh từ máy
                        </span>
                        <span className="text-xs text-muted">
                          Hỗ trợ JPG, PNG, WebP, GIF — Tối đa 5MB/ảnh
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Preview ảnh đã upload */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {uploadedImages.map((url, idx) => (
                        <div
                          key={idx}
                          className={`relative group rounded-lg overflow-hidden border-2 ${
                            idx === 0
                              ? "border-forest ring-2 ring-forest/20"
                              : "border-border hover:border-forest/50"
                          }`}
                        >
                          <img
                            src={url}
                            alt={`Ảnh ${idx + 1}`}
                            className="w-full aspect-square object-cover"
                          />
                          {/* Badge ảnh chính */}
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-forest text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Chính
                            </span>
                          )}
                          {/* Nút xóa */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                          {/* Nút đặt làm ảnh chính */}
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetMainImage(idx)}
                              className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Đặt chính
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Đường dẫn ảnh thủ công (dự phòng) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-dark mb-1">
                    Hoặc nhập URL ảnh chính
                  </label>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) =>
                      setProductForm({ ...productForm, image: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="/images/bamboo_cups.png"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-dark mb-1">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    rows="3"
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm resize-none"
                    placeholder="Nhập mô tả sản phẩm..."
                  />
                </div>

                {/* Impact Plastic */}
                <div>
                  <label className="block text-sm font-semibold text-slate-dark mb-1">
                    Nhựa giảm thiểu (g)
                  </label>
                  <input
                    type="text"
                    value={productForm.impactPlastic}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        impactPlastic: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="Ví dụ: 15g nhựa"
                  />
                </div>

                {/* Impact CO2 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-dark mb-1">
                    CO2 giảm thiểu (kg)
                  </label>
                  <input
                    type="text"
                    value={productForm.impactCo2}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        impactCo2: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all text-sm"
                    placeholder="Ví dụ: 0.5kg CO2"
                  />
                </div>

                {/* Impact Water */}
                <div>
                  <label className="block text-sm font-semibold text-slate-dark mb-1">
                    Nước tiết kiệm (L)
                  </label>
                  <input
                    type="text"
                    value={productForm.impactWater}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        impactWater: e.target.value,
                      })
                    }
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
                  {modalMode === "create" ? "Tạo Sản Phẩm" : "Lưu Thay Đổi"}
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
