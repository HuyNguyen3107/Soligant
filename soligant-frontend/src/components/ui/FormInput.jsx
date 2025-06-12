// src/components/ui/FormInput.jsx
const FormInput = ({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  onKeyDown,
  placeholder,
  maxLength,
  required = false,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-2 font-utm-avo"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>{" "}
      <input
        type={type}
        id={id}
        name={name || id}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-soligant-primary 
                   focus:border-soligant-primary font-utm-avo"
      />
      {maxLength && (
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500 font-utm-avo">
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

export default FormInput;
