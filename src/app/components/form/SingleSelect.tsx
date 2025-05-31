import { useState, useRef, useEffect } from "react";

interface Option {
    value: string;
    label: string;
}

interface SingleSelectProps {
    label: string;
    options: Option[];
    selectedValue?: string;
    onChange?: (value: string) => void;
    onDropdownClose?: () => void;
}

const SingleSelect: React.FC<SingleSelectProps> = ({
                                                       label,
                                                       options,
                                                       selectedValue,
                                                       onChange,
                                                       onDropdownClose,
                                                   }) => {
    // Initialize the label based on the selectedValue (if any) or fall back to the default label.
    const [selectedLabel, setSelectedLabel] = useState<string>(
        selectedValue ? options.find((opt) => opt.value === selectedValue)?.label || label : label
    );
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // This effect updates the displayed label whenever the selectedValue prop changes.
    useEffect(() => {
        if (selectedValue) {
            const opt = options.find((opt) => opt.value === selectedValue);
            setSelectedLabel(opt ? opt.label : label);
        } else {
            setSelectedLabel(label);
        }
    }, [selectedValue, options, label]);

    const handleSelection = (option: Option) => {
        setSelectedLabel(option.label);
        setIsOpen(false);
        onDropdownClose?.();
        onChange?.(option.value);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                onDropdownClose?.();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onDropdownClose]);

    return (
        <div className="relative inline-block w-64" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-2 border bg-white rounded-md shadow-sm text-left text-gray-900"
            >
                {selectedLabel}
            </button>

            {isOpen && (
                <div className="absolute w-full mt-2 bg-white border rounded-md shadow-lg z-50">
                    <ul className="py-1 max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleSelection(option)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export { SingleSelect };
export type { Option };