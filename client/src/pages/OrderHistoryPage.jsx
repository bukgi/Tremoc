import { Package, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { formatPrice } from '../data/mockData';
import { apiFetch } from '../lib/api';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch orders', err);
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
      <h1 className="text-3xl font-bold text-slate-dark mb-8 animate-fadeIn">Lịch sử đơn hàng</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center animate-slideUp">
          <div className="w-20 h-20 rounded-full bg-mint flex items-center justify-center mx-auto mb-6">
            <Package size={36} className="text-forest" />
          </div>
          <h2 className="text-xl font-semibold text-slate-dark mb-2">Chưa có đơn hàng nào</h2>
          <p className="text-muted mb-6">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
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
            <div key={order.id} className="bg-white rounded-xl border border-border p-6 shadow-sm animate-slideUp" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b border-border">
                <div>
                  <p className="text-sm text-muted">Đơn hàng #{order.id}</p>
                  <p className="text-xs text-muted mt-1">{new Date(order.date).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-forest">{formatPrice(order.total)}</p>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 mt-1">
                    {order.status === 'Pending' ? 'Đang xử lý' : order.status}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-bg-off" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-dark truncate">{item.name}</p>
                      <p className="text-xs text-muted">Số lượng: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
