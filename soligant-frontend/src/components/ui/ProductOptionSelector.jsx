// src/components/ui/ProductOptionSelector.jsx
import { motion } from "framer-motion";

const ProductOptionSelector = ({
  items,
  selectedItemId,
  onSelectItem,
  title,
  multiple = false,
  itemPrice = false,
  itemsPerRow = 5,
}) => {
  const handleSelect = (item) => {
    onSelectItem(item);
  };

  const gridCols = {
    3: "grid-cols-2 sm:grid-cols-3 md:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6",
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-3 font-utm-avo">{title}</h3>
      <div className={`grid ${gridCols[itemsPerRow] || gridCols[5]} gap-4`}>
        {items.map((item) => {
          const isSelected = multiple
            ? selectedItemId?.some((id) => id === item.id)
            : selectedItemId === item.id;

          return (
            <motion.div
              key={item.id}
              className={`
                border rounded-lg p-2 cursor-pointer transition-all
                ${
                  isSelected
                    ? "border-soligant-primary bg-soligant-secondary"
                    : "border-gray-200 hover:border-soligant-primary"
                }
              `}
              onClick={() => handleSelect(item)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative aspect-square mb-2 flex items-center justify-center">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="max-w-full max-h-full object-contain"
                />
                {isSelected && (
                  <div className="absolute top-1 right-1 bg-soligant-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                    ✓
                  </div>
                )}
              </div>
              <p className="text-center text-sm font-utm-avo">{item.name}</p>
              {itemPrice && item.price && (
                <p className="text-center text-xs text-soligant-primary font-bold mt-1 font-utm-avo">
                  {new Intl.NumberFormat("vi-VN").format(item.price)} VNĐ
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductOptionSelector;
