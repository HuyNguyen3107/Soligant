// src/components/ui/BackgroundTemplateSelector.jsx
import { motion } from "framer-motion";

const BackgroundTemplateSelector = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
  type = "all",
}) => {
  // Lọc templates theo type (nếu cần)
  const filteredTemplates =
    type === "all"
      ? templates
      : templates.filter((template) => template.type === type);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTemplates.map((template) => (
        <motion.div
          key={template.id}
          className={`
            border rounded-lg p-2 cursor-pointer transition-all
            ${
              selectedTemplate === template.id
                ? "border-soligant-primary bg-soligant-secondary shadow-md"
                : "border-gray-200 hover:border-soligant-primary"
            }
          `}
          onClick={() => onSelectTemplate(template.id)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative aspect-video mb-2">
            <img
              src={template.imageUrl}
              alt={template.name}
              className="w-full h-full object-cover rounded"
            />
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 bg-soligant-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                ✓
              </div>
            )}
          </div>
          <h3 className="text-center font-utm-avo">{template.name}</h3>
        </motion.div>
      ))}
    </div>
  );
};

export default BackgroundTemplateSelector;
