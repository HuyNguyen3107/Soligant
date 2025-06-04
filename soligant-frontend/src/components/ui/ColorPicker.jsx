import { useState, useEffect, useRef } from "react";

const ColorPicker = ({ colors, selectedColor, onSelectColor, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Xử lý click bên ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Xử lý khi chọn màu
  const handleColorSelect = (color) => {
    onSelectColor(color);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}

      {/* Selected color display */}
      <div
        className="w-full h-10 rounded border border-gray-300 cursor-pointer flex items-center px-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedColor ? (
          <>
            <div
              className="w-6 h-6 rounded-full mr-2"
              style={{ backgroundColor: selectedColor }}
            />
            <span>{selectedColor}</span>
          </>
        ) : (
          <span className="text-gray-500">Chọn màu</span>
        )}
      </div>

      {/* Dropdown color palette */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded p-2 border border-gray-200">
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full cursor-pointer border hover:scale-110 transition-transform ${
                  color === selectedColor
                    ? "border-2 border-black"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
