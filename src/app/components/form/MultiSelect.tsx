import { useState, useRef, useEffect } from "react";

interface Option {
    value: string;
    label: string;
}

interface MultiSelectProps {
    label: string;
    options: Option[];
    selectedValues?: string[];
    onChange?: (values: string[]) => void;
    onDropdownClose?: (values: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
                                                     label,
                                                     options,
                                                     selectedValues = [],
                                                     onChange,
                                                     onDropdownClose,
                                                 }) => {
    const [localSelectedValues, setLocalSelectedValues] = useState<string[]>(selectedValues);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        setLocalSelectedValues(selectedValues);
    }, [selectedValues]);

    const maxVisibleItems = 3;
    const visibleLabels = localSelectedValues
        .slice(0, maxVisibleItems)
        .map((val) => options.find((opt) => opt.value === val)?.label);
    const hiddenCount = localSelectedValues.length - maxVisibleItems;

    const handleSelection = (option: Option) => {
        const updatedSelectedValues = localSelectedValues.includes(option.value)
            ? localSelectedValues.filter((val) => val !== option.value)
            : [...localSelectedValues, option.value];

        setLocalSelectedValues(updatedSelectedValues);

        if (onChange) {
            onChange(updatedSelectedValues);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                onDropdownClose?.(localSelectedValues);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [localSelectedValues, onDropdownClose]);

    return (
        <div className="relative inline-block w-64" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-2 pr-4 border border-gray-300 bg-white rounded-md shadow-sm text-left text-gray-900 overflow-hidden truncate flex items-center"
            >
        <span className="truncate w-full">
          {visibleLabels.length > 0
              ? visibleLabels.join(", ") + (hiddenCount > 0 ? ` +${hiddenCount} more` : "")
              : label}
        </span>
            </button>

            {isOpen && (
                <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                    <ul className="py-1 max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleSelection(option)}
                                className="px-4 py-2 cursor-pointer flex items-center justify-between text-gray-900 hover:bg-gray-100"
                            >
                                <span>{option.label}</span>
                                {localSelectedValues.includes(option.value) && (
                                    <span className="text-green-600">✔️</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export { MultiSelect };
export type { Option };