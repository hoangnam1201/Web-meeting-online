import React from "react";
import SearchIcon from "@mui/icons-material/Search";

const SearchUser = ({ onChange }) => {
  const searchUser = (searchText) => {
    onChange(searchText);
  };

  return (
    <div className="relative flex items-center bg-slate-100 rounded-md shadow-lg">
      <input
        className="h-8 w-64 py-7 px-4 outline-none bg-slate-100 "
        type="text"
        placeholder="Search user..."
        onChange={(e) => searchUser(e.target.value)}
      />
      <button>
        <SearchIcon className="text-blue-700" />
      </button>
    </div>
  );
};

export default SearchUser;
