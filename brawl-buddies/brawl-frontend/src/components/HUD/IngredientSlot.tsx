interface IngredientSlotProps {
  ingredients: string[];
  maxSlots?: number;
}

export default function IngredientSlot({ ingredients, maxSlots = 4 }: IngredientSlotProps) {
  const slots = Array.from({ length: maxSlots }, (_, i) => ingredients[i] ?? '');

  return (
    <div className="hud-panel flex gap-1.5 p-1.5 sm:gap-2 sm:p-2">
      {slots.map((item, index) => (
        <div
          key={index}
          className="grid h-9 w-9 place-items-center rounded-xl border-2 border-[#2c1621] bg-[#fff9e8] text-xl shadow-[2px_2px_0_#2c1621] sm:h-12 sm:w-12 sm:text-2xl"
        >
          {item || <span className="font-game text-xl text-[#8c3a2d]/45">+</span>}
        </div>
      ))}
    </div>
  );
}
