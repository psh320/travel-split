import { useEffect, useId, useRef, useState } from "react";

type DropdownOption<T extends string> = {
  value: T;
  label: string;
};

type DropdownProps<T extends string> = {
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
};

export function Dropdown<T extends string>({
  label,
  value,
  options,
  onChange,
}: DropdownProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const labelId = useId();
  const menuId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  const [highlightedIndex, setHighlightedIndex] = useState(selectedIndex);
  const selectedOption = options[selectedIndex];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      optionRefs.current[highlightedIndex]?.focus();
    }
  }, [isOpen, highlightedIndex]);

  const openMenu = () => {
    setHighlightedIndex(selectedIndex);
    setIsOpen(true);
  };

  const selectOption = (nextValue: T) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openMenu();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((current) => !current);
    }
  };

  const handleOptionKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((current) => Math.min(current + 1, options.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Home") {
      event.preventDefault();
      setHighlightedIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setHighlightedIndex(options.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption(options[highlightedIndex].value);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div className="dropdown-control" ref={rootRef}>
      <span className="dropdown-label" id={labelId}>
        {label}
      </span>
      <button
        type="button"
        className={`dropdown-trigger${isOpen ? " dropdown-trigger-open" : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={labelId}
        aria-controls={menuId}
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{selectedOption?.label}</span>
        <span className="dropdown-chevron" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="dropdown-menu" id={menuId} role="listbox" aria-labelledby={labelId}>
          {options.map((option, index) => (
            <button
              key={option.value}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={`dropdown-option${
                option.value === value ? " dropdown-option-selected" : ""
              }${index === highlightedIndex ? " dropdown-option-highlighted" : ""}`}
              onClick={() => selectOption(option.value)}
              onKeyDown={handleOptionKeyDown}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <span className="dropdown-check" aria-hidden="true">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
