const ItemSelector = ({
  items,
  selectedItemId,
  onSelectItem,
  title,
  multiple = false,
}) => {
  const handleSelect = (item) => {
    onSelectItem(item);
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`
              border rounded-lg p-2 cursor-pointer transition-all
              ${
                selectedItemId === item.id ||
                (multiple && selectedItemId?.includes(item.id))
                  ? "border-soligant-primary bg-soligant-secondary"
                  : "border-gray-200 hover:border-soligant-primary"
              }
            `}
            onClick={() => handleSelect(item)}
          >
            <div className="relative aspect-square mb-2">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-contain"
              />
              {(selectedItemId === item.id ||
                (multiple && selectedItemId?.includes(item.id))) && (
                <div className="absolute top-1 right-1 bg-soligant-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                  ✓
                </div>
              )}
            </div>
            <p className="text-center text-sm">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemSelector;
