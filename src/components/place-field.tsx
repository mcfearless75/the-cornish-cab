import { suggestPlaces } from "@/lib/suggest.functions";
import { useEffect, useId, useRef, useState } from "react";

export function PlaceField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [source, setSource] = useState<"google" | "map">("map");
  const [active, setActive] = useState(0);
  const skip = useRef("");

  useEffect(() => {
    const text = value.trim();
    if (text.length < 3 || text === skip.current) {
      setItems([]);
      setOpen(false);
      return;
    }
    const timer = window.setTimeout(async () => {
      try {
        const found = await suggestPlaces({ data: { query: text } });
        if (!found.ok) return;
        setItems(found.suggestions);
        setSource(found.source);
        setActive(0);
        setOpen(found.suggestions.length > 0);
      } catch {
        setOpen(false);
      }
    }, 280);
    return () => window.clearTimeout(timer);
  }, [value]);

  function choose(item: string) {
    skip.current = item;
    onChange(item);
    setOpen(false);
  }

  return (
    <label className="relative grid gap-1.5 text-sm font-medium">
      {label}
      <input
        value={value}
        onChange={(event) => {
          skip.current = "";
          onChange(event.target.value);
        }}
        onFocus={() => {
          if (items.length) setOpen(true);
        }}
        onKeyDown={(event) => {
          if (!open || !items.length) return;
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((index) => (index + 1) % items.length);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((index) => (index - 1 + items.length) % items.length);
          } else if (event.key === "Enter") {
            event.preventDefault();
            const item = items[active];
            if (item) choose(item);
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        className="h-12 rounded-xl border border-line bg-cream px-3 font-normal text-ink"
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
      />
      {open ? (
        <div
          id={listId}
          role="listbox"
          className="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-xl border border-line bg-cream shadow-lg"
        >
          {items.map((item, index) => (
            <button
              key={item}
              type="button"
              role="option"
              aria-selected={index === active}
              className={
                "block w-full px-3 py-2 text-left text-sm font-normal text-ink " +
                (index === active ? "bg-gold/30" : "hover:bg-gold/20")
              }
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(item)}
            >
              {item}
            </button>
          ))}
          {source === "google" ? <p className="px-3 py-1 text-[11px] text-mist">Suggestions by Google</p> : null}
        </div>
      ) : null}
    </label>
  );
}
