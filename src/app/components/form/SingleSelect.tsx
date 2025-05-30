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

const SingleSelect: React.FC<SingleSelectProps> = ({ label, options, selectedValue, onChange, onDropdownClose }) => {
    const [selectedLabel, setSelectedLabel] = useState(selectedValue || label);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown container

    const handleSelection = (option: Option) => {
        setSelectedLabel(option.label);
        setIsOpen(false);
        onDropdownClose?.(); // ✅ Trigger closing event
        if (onChange) {
            onChange(option.value);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                onDropdownClose?.(); // ✅ Ensure it triggers on outside click
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block w-64" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
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