import { useState, useRef, useCallback, useEffect } from "react";
import { MapPin, Loader2, Search, X, Navigation } from "lucide-react";

// Nominatim API (OpenStreetMap) – hoàn toàn miễn phí
const NOMINATIM_URL = "https://nominatim.openstreetmap.org";

// Rate limit: Nominatim yêu cầu tối đa 1 request/giây
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1100; // ms

const searchAddress = async (query) => {
  if (!query || query.length < 3) return [];

  // Đảm bảo rate limit
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest),
    );
  }
  lastRequestTime = Date.now();

  const params = new URLSearchParams({
    q: query,
    format: "json",
    addressdetails: "1",
    limit: "5",
    countrycodes: "vn",
    "accept-language": "vi",
  });

  const res = await fetch(`${NOMINATIM_URL}/search?${params}`, {
    headers: {
      "User-Agent": "TreMocApp/1.0 (contact@tremoc.vn)", // Nominatim yêu cầu User-Agent
    },
  });

  if (!res.ok) throw new Error("Lỗi tra cứu địa chỉ. Vui lòng thử lại sau.");
  return res.json();
};

/**
 * Component Autocomplete địa chỉ sử dụng OpenStreetMap Nominatim (MIỄN PHÍ)
 *
 * Props:
 * - onPlaceSelected: (place) => void
 *     place = { address, province, district, lat, lng }
 * - value: string
 * - onChange: (value: string) => void
 * - placeholder: string
 * - className: string
 * - disabled: boolean
 */
const AddressAutocomplete = ({
  onPlaceSelected,
  value = "",
  onChange,
  placeholder = "Nhập địa chỉ giao hàng của bạn...",
  className = "",
  disabled = false,
  required = false,
}) => {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Sync external value -> internal query
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  const handleInputChange = useCallback(
    (e) => {
      const val = e.target.value;
      setQuery(val);
      onChange?.(val);
      setError(null);
      setSelectedIndex(-1);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (val.length < 3) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const results = await searchAddress(val);
          setSuggestions(results);
          setIsOpen(results.length > 0);
        } catch (err) {
          setError(err.message);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 400);
    },
    [onChange],
  );

  const selectPlace = useCallback(
    (place) => {
      let province = "";
      let district = "";
      let ward = "";

      if (place.address) {
        province =
          place.address.state ||
          place.address.province ||
          place.address.region ||
          "";
        district =
          place.address.county ||
          place.address.district ||
          place.address.city ||
          "";
        ward =
          place.address.suburb ||
          place.address.village ||
          place.address.hamlet ||
          "";
      }

      // Tạo địa chỉ hiển thị đẹp
      const addressParts = [];
      if (place.address?.road) addressParts.push(place.address.road);
      if (place.address?.house_number)
        addressParts.unshift(place.address.house_number);
      if (ward) addressParts.push(ward);
      if (district) addressParts.push(district);
      if (province) addressParts.push(province);

      const displayAddress = place.display_name || addressParts.join(", ");

      setQuery(displayAddress);
      onChange?.(displayAddress);
      setSuggestions([]);
      setIsOpen(false);

      onPlaceSelected?.({
        address: displayAddress,
        province,
        district,
        ward,
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
      });
    },
    [onChange, onPlaceSelected],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        selectPlace(suggestions[selectedIndex]);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    [isOpen, suggestions, selectedIndex, selectPlace],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    onChange?.("");
    setSuggestions([]);
    setIsOpen(false);
    onPlaceSelected?.({
      address: "",
      province: "",
      district: "",
      lat: null,
      lng: null,
    });
    inputRef.current?.focus();
  }, [onChange, onPlaceSelected]);

  // Lấy vị trí hiện tại
  const handleGetCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Đảm bảo rate limit
          const now = Date.now();
          const timeSinceLastRequest = now - lastRequestTime;
          if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
            await new Promise((resolve) =>
              setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest),
            );
          }
          lastRequestTime = Date.now();

          const params = new URLSearchParams({
            lat: latitude.toString(),
            lon: longitude.toString(),
            format: "json",
            addressdetails: "1",
            "accept-language": "vi",
          });

          const res = await fetch(`${NOMINATIM_URL}/reverse?${params}`, {
            headers: {
              "User-Agent": "TreMocApp/1.0 (contact@tremoc.vn)",
            },
          });

          if (!res.ok) throw new Error("Không thể xác định địa chỉ hiện tại.");

          const data = await res.json();
          if (data) {
            selectPlace(data);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError(
          "Không thể lấy vị trí. Vui lòng cho phép truy cập GPS hoặc nhập tay.",
        );
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: false },
    );
  }, [selectPlace]);

  // Highlight matching text
  const highlightMatch = (text, query) => {
    if (!query || query.length < 2) return text;
    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    );
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          className="bg-forest/15 text-forest font-semibold rounded px-0.5"
        >
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      ),
    );
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white ${
          isOpen
            ? "border-forest ring-2 ring-forest/20"
            : disabled
              ? "border-border bg-gray-50 cursor-not-allowed"
              : "border-border hover:border-forest/50"
        }`}
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin text-forest shrink-0" />
        ) : (
          <MapPin size={18} className="text-forest shrink-0" />
        )}

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="flex-1 bg-transparent outline-none text-sm text-slate-dark placeholder:text-muted"
          autoComplete="off"
        />

        <div className="flex items-center gap-0.5 shrink-0">
          {/* Nút định vị GPS */}
          {navigator.geolocation && (
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={loading}
              className="p-1.5 rounded-full hover:bg-mint transition-colors"
              title="Dùng vị trí hiện tại"
            >
              <Navigation size={16} className="text-forest" />
            </button>
          )}

          {/* Nút xóa */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={16} className="text-muted" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl border border-border shadow-xl overflow-hidden animate-slideDown">
          <div className="max-h-64 overflow-y-auto">
            {suggestions.map((place, idx) => (
              <button
                key={place.place_id || idx}
                type="button"
                onClick={() => selectPlace(place)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors border-b border-border/50 last:border-0 ${
                  idx === selectedIndex ? "bg-mint" : "hover:bg-gray-50"
                }`}
              >
                <MapPin
                  size={16}
                  className={`mt-0.5 shrink-0 ${
                    idx === selectedIndex ? "text-forest" : "text-muted"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-sm text-slate-dark leading-snug line-clamp-2">
                    {highlightMatch(place.display_name, query)}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {place.type === "house" || place.type === "residential"
                      ? "📍 Địa chỉ cụ thể"
                      : place.type === "administrative"
                        ? "🏛 Khu vực hành chính"
                        : "📍 " + (place.type || "Địa điểm")}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-border flex items-center justify-between text-xs text-muted">
            <span>Dữ liệu từ OpenStreetMap</span>
            <span>↑↓ chọn · Enter xác nhận · Esc đóng</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
          {error}
        </p>
      )}

      {/* Hint */}
      {!isOpen && !query && (
        <p className="text-xs text-muted mt-1.5">
          🔍 Gõ ít nhất 3 ký tự để tìm kiếm địa chỉ — hoặc nhấn{" "}
          <Navigation size={12} className="inline text-forest" /> để dùng vị trí
          hiện tại
        </p>
      )}
    </div>
  );
};

export default AddressAutocomplete;
