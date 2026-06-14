import { Minus, Plus } from 'lucide-react';

const QuantityPicker = ({ quantity, onChange, min = 1, max = 99 }) => {
  const decrease = () => {
    if (quantity > min) onChange(quantity - 1);
  };

  const increase = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value) || min;
    onChange(Math.min(Math.max(val, min), max));
  };

  return (
    <div className="inline-flex items-center border border-border rounded-lg overflow-hidden">
      <button
        onClick={decrease}
        disabled={quantity <= min}
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Minus size={16} />
      </button>
      <input
        type="text"
        value={quantity}
        onChange={handleInputChange}
        className="w-12 h-10 text-center text-sm font-medium border-x border-border outline-none"
      />
      <button
        onClick={increase}
        disabled={quantity >= max}
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantityPicker;
