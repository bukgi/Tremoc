import {
  Package,
  ArrowLeft,
  Loader2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Truck,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatPrice } from "../data/mockData";
import { apiFetch } from "../lib/api";

const STATUS_STEPS = [
  { key: "Pending", label: "Chờ xác nhận", icon: Clock },
  { key: "Processing", label: "Đang xử lý", icon: Package },
  { key: "Shipping", label: "Đang giao hàng", icon: Truck },
  { key: "Completed", label: "Hoàn thành", icon: CheckCircle2 },
];

const STATUS_INDEX = Object.fromEntries(STATUS_STEPS.map((s, i) => [s.key, i]));

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    apiFetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center flex flex-col items-center">
        <Loader2 className="animate-spin text-forest mb-4" size={32} />
        <p className="text-muted">Đang tải lịch sử đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-3xl font-bold text-slate-dark mb-8 animate-fadeIn">
        Lịch sử đơn hàng
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center animate-slideUp">
          <div className="w-20 h-20 rounded-full bg-mint flex items-center justify-center mx-auto mb-6">
            <Package size={36} className="text-forest" />
          </div>
          <h2 className="text-xl font-semibold text-slate-dark mb-2">
            Chưa có đơn hàng nào
          </h2>
          <p className="text-muted mb-6">
            Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            <ArrowLeft size={18} />
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, i) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-border p-6 shadow-sm animate-slideUp"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b border-border cursor-pointer select-none"
                onClick={() =>
                  setExpandedOrderId(
                    expandedOrderId === order.id ? null : order.id,
                  )
                }
              >
                <div className="flex items-center gap-3">
                  {expandedOrderId === order.id ? (
                    <ChevronUp size={20} className="text-muted" />
                  ) : (
                    <ChevronDown size={20} className="text-muted" />
                  )}
                  <div>
                    <p className="text-sm text-muted">Đơn hàng #{order.id}</p>
                    <p className="text-xs text-muted mt-1">
                      {new Date(order.date).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-forest">
                    {formatPrice(order.total)}
                  </p>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 mt-1">
                    {order.status === "Pending"
                      ? "Đang xử lý"
                      : order.status === "Processing"
                        ? "Đang xử lý"
                        : order.status === "Shipping"
                          ? "Đang giao hàng"
                          : order.status === "Completed"
                            ? "Hoàn thành"
                            : order.status === "Cancelled"
                              ? "Đã hủy"
                              : order.status}
                  </span>
                </div>
              </div>

              {/* Collapsed preview */}
              <div
                className="space-y-3 cursor-pointer select-none"
                onClick={() =>
                  setExpandedOrderId(
                    expandedOrderId === order.id ? null : order.id,
                  )
                }
              >
                {order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-bg-off"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-dark truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted">
                        SL: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <p className="text-xs text-muted text-center">
                    + {order.items.length - 2} sản phẩm khác — nhấn để xem chi
                    tiết
                  </p>
                )}
              </div>

              {/* Expanded detail */}
              {expandedOrderId === order.id && (
                <div className="mt-5 pt-5 border-t border-border space-y-5 animate-slideDown">
                  {/* Full item list */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-dark mb-3">
                      🛒 Danh sách sản phẩm
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 bg-bg-off rounded-lg p-3"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover bg-white border border-border"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-dark">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted mt-0.5">
                              SL: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-slate-dark">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping address */}
                  {order.shippingAddress && (
                    <div className="bg-bg-off rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={16} className="text-forest" />
                        <h4 className="text-sm font-semibold text-slate-dark">
                          Địa chỉ giao hàng
                        </h4>
                      </div>
                      <p className="text-sm text-slate-dark ml-6">
                        {order.shippingAddress}
                      </p>
                    </div>
                  )}

                  {/* Status timeline */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-dark mb-3">
                      📦 Trạng thái đơn hàng
                    </h4>
                    <div className="relative">
                      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
                      <div className="space-y-4">
                        {STATUS_STEPS.map((step, idx) => {
                          const currentIdx = STATUS_INDEX[order.status] ?? -1;
                          const isCompleted = idx <= currentIdx;
                          const isActive = idx === currentIdx;
                          const isCancelled = order.status === "Cancelled";
                          const StepIcon = step.icon;
                          return (
                            <div
                              key={step.key}
                              className="flex items-start gap-3 relative"
                            >
                              <div
                                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                                  isCancelled
                                    ? "bg-rose-50 border-rose-300 text-rose-500"
                                    : isCompleted
                                      ? "bg-forest border-forest text-white"
                                      : "bg-white border-gray-300 text-gray-400"
                                }`}
                              >
                                {isCancelled && idx === currentIdx ? (
                                  <Circle size={16} />
                                ) : (
                                  <StepIcon size={16} />
                                )}
                              </div>
                              <div className="pt-2">
                                <p
                                  className={`text-sm font-medium ${
                                    isCancelled
                                      ? "text-rose-600"
                                      : isActive
                                        ? "text-forest"
                                        : isCompleted
                                          ? "text-slate-dark"
                                          : "text-muted"
                                  }`}
                                >
                                  {step.label}
                                </p>
                                {isActive && !isCancelled && (
                                  <p className="text-xs text-forest mt-0.5">
                                    Đơn hàng đang ở bước này
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Total breakdown */}
                  <div className="bg-bg-off rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-slate-dark mb-3">
                      💰 Tổng đơn hàng
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted">Tạm tính</span>
                        <span className="font-medium">
                          {formatPrice(order.total - (order.shippingFee || 0))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Phí vận chuyển</span>
                        <span className="font-medium">
                          {(order.shippingFee || 0) === 0
                            ? "Miễn phí"
                            : formatPrice(order.shippingFee)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-2">
                        <span className="font-semibold text-slate-dark">
                          Tổng cộng
                        </span>
                        <span className="font-semibold text-forest">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
