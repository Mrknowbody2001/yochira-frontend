import react from "react";

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="px-3 py-2 rounded border border-gray-400 text-black"
    />
  );
};

export default SearchBar;
