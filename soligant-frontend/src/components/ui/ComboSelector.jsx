// src/components/ui/ComboSelector.jsx
import { motion } from "framer-motion";

const ComboSelector = ({ combos, selectedCombos, onSelectCombo }) => {
  const handleSelectCombo = (combo) => {
    onSelectCombo(combo);
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-3 font-utm-avo">Combo ưu đãi</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {combos.map((combo) => {
          const isSelected = selectedCombos?.some((c) => c.id === combo.id);

          return (
            <motion.div
              key={combo.id}
              className={`
                border rounded-lg p-4 cursor-pointer transition-all
                ${
                  isSelected
                    ? "border-soligant-primary bg-soligant-secondary"
                    : "border-gray-200 hover:border-soligant-primary"
                }
              `}
              onClick={() => handleSelectCombo(combo)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-bold text-soligant-primary font-utm-avo">
                  {combo.name}
                </h4>
                {isSelected && (
                  <div className="bg-soligant-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                    ✓
                  </div>
                )}
              </div>

              <p className="text-gray-700 mb-2 font-utm-avo">
                {combo.description}
              </p>

              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-soligant-primary font-utm-avo">
                  {new Intl.NumberFormat("vi-VN").format(combo.price)} VNĐ
                </span>
                <span className="text-sm line-through text-gray-500 font-utm-avo">
                  {new Intl.NumberFormat("vi-VN").format(combo.originalPrice)}{" "}
                  VNĐ
                </span>
                <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full font-utm-avo">
                  Tiết kiệm{" "}
                  {new Intl.NumberFormat("vi-VN").format(
                    combo.originalPrice - combo.price
                  )}{" "}
                  VNĐ
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ComboSelector;
