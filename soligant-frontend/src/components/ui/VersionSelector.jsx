// src/components/ui/VersionSelector.jsx
import { motion } from "framer-motion";

const VersionSelector = ({ versions, selectedVersion, onSelectVersion }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4 font-utm-avo">Chọn phiên bản</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {versions.map((version) => (
          <motion.div
            key={version.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedVersion === version.id
                ? "border-soligant-primary bg-soligant-secondary shadow-md"
                : "border-gray-200 hover:border-soligant-primary"
            }`}
            onClick={() => onSelectVersion(version.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="text-lg font-bold text-soligant-primary font-utm-avo">
              {version.name} -{" "}
              {new Intl.NumberFormat("vi-VN").format(version.price)} VNĐ
            </h3>
            <p className="text-gray-700 font-utm-avo">{version.description}</p>
            <ul className="mt-2 pl-5 list-disc text-sm text-gray-600">
              <li className="font-utm-avo">Tặng Box quà sang trọng</li>
              <li className="font-utm-avo">Tặng Túi đựng xinh xắn</li>
              <li className="font-utm-avo">Tặng Thiệp viết tay</li>
            </ul>
          </motion.div>
        ))}
      </div>
      <p className="mt-3 text-sm text-red-600 italic font-utm-avo">
        * Lưu ý: Giá trên CHƯA BAO GỒM tóc và phụ kiện đi kèm
      </p>
    </div>
  );
};

export default VersionSelector;
