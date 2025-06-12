// src/components/ui/ColorPicker.jsx
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
    <div className="relative mb-4" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium mb-2 font-utm-avo">
          {label}
        </label>
      )}

      {/* Selected color display */}
      <div
        className="w-full h-11 rounded border border-gray-300 cursor-pointer flex items-center px-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedColor ? (
          <>
            <div
              className="w-6 h-6 rounded-full mr-2 border border-gray-300"
              style={{ backgroundColor: selectedColor.colorCode }}
            />
            <span className="font-utm-avo">{selectedColor.name}</span>
          </>
        ) : (
          <span className="text-gray-500 font-utm-avo">Chọn màu</span>
        )}
      </div>

      {/* Dropdown color palette */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded p-2 border border-gray-200">          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <div
                key={color.id}
                className={`flex flex-col items-center cursor-pointer p-1 rounded hover:bg-gray-100`}
                onClick={() => handleColorSelect(color)}
              >
                <div
                  className={`w-8 h-8 rounded-full border hover:scale-110 transition-transform ${
                    selectedColor && color.id === selectedColor.id
                      ? "border-2 border-black"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.colorCode }}
                  title={color.name}
                />
                <span className="text-xs mt-1 text-center truncate w-full font-utm-avo">
                  {color.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
