import {useEffect, useRef} from "react";

const DropdownLink = ({ title, options, links, isOpen, setOpen }: {
    title: string;
    options: string[];
    links: string[];
    isOpen: boolean;
    setOpen: (title: string | null) => void;
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [setOpen]);

    return (
        <div className="relative dropdown" ref={dropdownRef}>
            <button
                onClick={() => setOpen(isOpen ? null : title)}
                className="px-4 py-2 text-white hover:bg-gray-700 rounded-md"
            >
                {title}
            </button>
            {isOpen && (
                <ul className="absolute left-0 mt-2 w-40 bg-gray-700 rounded-md shadow-lg">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                            onClick={() => window.location.href = links[index]}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownLink;