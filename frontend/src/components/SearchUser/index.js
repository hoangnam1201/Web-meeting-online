import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import { searchUserAction } from "../../store/actions/userAction";

const SearchUser = () => {
  const dispatch = useDispatch();

  const searchUser = (searchText) => {
    dispatch(searchUserAction(0, searchText));
  };

  return (
    <div className="relative flex items-center">
      <input
        className="h-8 w-64 p-2 rounded-md shadow-lg outline-none bg-slate-100"
        type="text"
        placeholder="Search user..."
        onChange={(e) => searchUser(e.target.value)}
      />
      <button className="absolute right-0">
        <SearchIcon className="text-blue-700" />
      </button>
    </div>
  );
};

export default SearchUser;
