import React, { useEffect, useRef, useState } from "react";

interface Props {
  options: Array<any>;
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSelect: (selectedOptions: any) => void;
}

const MultiSelectPopup: React.FC<Props> = ({
  options,
  isOpen,
  onClose,
  onSelect,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Array<any>>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
    if (
      dropdownOpen &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedOptions([]);
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prevOpen) => !prevOpen);
  };

  const toggleOption = (option: any) => {
    setSelectedOptions((prevSelected) => {
      if (prevSelected.includes(option)) {
        return prevSelected.filter((o) => o !== option);
      } else {
        return [...prevSelected, option];
      }
    });
  };

  const handleDoneClick = () => {
    onSelect(selectedOptions);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="w-3/4 rounded-lg bg-white p-8">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="w-full rounded-lg border border-gray-300 p-2"
          >
            {selectedOptions.length > 0
              ? selectedOptions.map((option) => option.label).join(", ")
              : "Select options"}
          </button>
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute left-0 z-10 mt-2 w-full rounded-lg border border-gray-300 bg-white"
            >
              {options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => toggleOption(option)}
                  className={`flex cursor-pointer items-center px-3 py-1 ${
                    selectedOptions.includes(option)
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleDoneClick}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiSelectPopup;
