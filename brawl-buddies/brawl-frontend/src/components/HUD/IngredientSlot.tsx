interface IngredientSlotProps {
  ingredients: string[];
  maxSlots?: number;
}

/** 4 slot bahan di kantong dengan frame pixel art. */
export default function IngredientSlot({ ingredients, maxSlots = 4 }: IngredientSlotProps) {
  const slots = Array.from({ length: maxSlots }, (_, i) => ingredients[i] ?? '');
  return (
    <div className="flex gap-2">
      {slots.map((item, i) => (
        <div
          key={i}
          className="pixel-panel-border flex h-12 w-12 items-center justify-center text-2xl"
        >
          {item}
        </div>
      ))}
    </div>
  );
}
