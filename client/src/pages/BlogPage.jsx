import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Leaf, ArrowRight } from 'lucide-react';

const initialPosts = [
  {
    id: 1,
    title: '5 Lý Do Nên Chọn Sản Phẩm Tre Thay Vì Nhựa',
    excerpt: 'Tre không chỉ bền chắc mà còn thân thiện với môi trường. Hãy cùng khám phá những lợi ích tuyệt vời mà tre mang lại.',
    date: '10/06/2025',
    category: 'Môi trường',
    readTime: '5 phút đọc',
    image: '/images/blog-eco.jpg'
  },
  {
    id: 2,
    title: 'Cách Bảo Quản Sản Phẩm Tre Đúng Cách',
    excerpt: 'Để sản phẩm tre luôn bền đẹp và sử dụng lâu dài, bạn cần biết cách vệ sinh và bảo quản đúng phương pháp.',
    date: '05/06/2025',
    category: 'Hướng dẫn',
    readTime: '4 phút đọc',
    image: '/images/blog-care.jpg'
  },
  {
    id: 3,
    title: 'Làng Nghề Tre Việt Nam - Di Sản Trường Tồn',
    excerpt: 'Hành trình khám phá những làng nghề tre truyền thống, nơi mà nghệ nhân đã gìn giữ văn hóa qua bao thế hệ.',
    date: '01/06/2025',
    category: 'Câu chuyện',
    readTime: '7 phút đọc',
    image: '/images/blog-village.jpg'
  },
  {
    id: 4,
    title: 'Xu Hướng Sống Xanh 2025 - Người Việt Đang Thay Đổi',
    excerpt: 'Ngày càng nhiều gia đình Việt Nam chuyển sang dùng sản phẩm thân thiện môi trường. Cùng điểm qua xu hướng nổi bật.',
    date: '25/05/2025',
    category: 'Xu hướng',
    readTime: '6 phút đọc',
    image: '/images/blog-trend.jpg'
  },
];

const BlogPage = () => {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('tremoc_blogs');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((post, i) => ({ ...post, image: post.image || initialPosts[i]?.image }));
    }
    localStorage.setItem('tremoc_blogs', JSON.stringify(initialPosts));
    return initialPosts;
  });

  useEffect(() => {
    const saved = localStorage.getItem('tremoc_blogs');
    if (saved) {
      const parsed = JSON.parse(saved);
      setPosts(parsed.map((post, i) => ({ ...post, image: post.image || initialPosts[i]?.image })));
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12 animate-fadeIn">
        <div className="inline-flex items-center gap-2 bg-forest/10 rounded-full px-4 py-2 mb-4">
          <BookOpen size={16} className="text-forest" />
          <span className="text-sm font-medium text-forest">Blog Tre Mộc</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-dark mb-3">Tin tức & Chia sẻ</h1>
        <p className="text-muted text-lg max-w-xl mx-auto">
          Những câu chuyện về lối sống xanh, nghề thủ công truyền thống và bảo vệ môi trường.
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post, index) => (
          <article
            key={post.id}
            className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group animate-slideUp"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
          >
            <div className="h-52 overflow-hidden relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/30 to-transparent" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-forest bg-forest/10 px-3 py-1 rounded-full">{post.category}</span>
                <span className="text-xs text-muted">{post.readTime}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-dark mb-2 group-hover:text-forest transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">{post.date}</span>
                <button className="inline-flex items-center gap-1 text-sm text-forest font-medium hover:gap-2 transition-all group/btn">
                  Đọc thêm <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link to="/" className="inline-flex items-center gap-2 text-forest font-medium hover:underline">
          <Leaf size={16} />
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default BlogPage;
