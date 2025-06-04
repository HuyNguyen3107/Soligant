const OutfitPicker = ({ outfits, selectedOutfit, onSelectOutfit }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Outfit</label>
      <div className="flex flex-wrap gap-3">
        {outfits.map((outfit) => (
          <div
            key={outfit.id}
            className={`
              relative cursor-pointer transition-all
              ${
                selectedOutfit === outfit.id
                  ? "ring-2 ring-soligant-primary scale-105"
                  : "hover:scale-105"
              }
            `}
            onClick={() => onSelectOutfit(outfit.id)}
          >
            <img
              src={outfit.imageUrl}
              alt={outfit.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {selectedOutfit === outfit.id && (
                <div className="bg-soligant-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                  ✓
                </div>
              )}
            </div>
            <p className="text-center text-sm mt-1">{outfit.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutfitPicker;
