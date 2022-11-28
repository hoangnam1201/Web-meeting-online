import React, { useEffect } from "react";
import { Autocomplete, LinearProgress, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { LoadingButton } from "@mui/lab";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  clearSelectedUserAction,
  getUserPagingAction,
  selectedUserAction,
  userSelectedAllAction,
} from "../../store/actions/userAction";
import { useState } from "react";
import SearchUser from "../SearchUser";
import Avatar from "react-avatar";
import { addMembersAPI } from "../../api/room.api";
import { useHistory, useParams } from "react-router-dom";

const AddMembers = () => {
  const user = useSelector((state) => state.userManageReducer);
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const { id } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getUserPagingAction(pageIndex, searchValue));
  }, [pageIndex]);

  const selectedUser = (ids) => {
    dispatch(selectedUserAction(ids));
  };

  const onAddMember = async () => {
    setLoading(true);
    try {
      await addMembersAPI(id, user?.selectedUser);
      setLoading(false);
      dispatch(clearSelectedUserAction());
      history.goBack();
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <div className="p-10">
      <div className="shadow-md p-4 mt-4">
        <div className="py-4 text-left flex items-center justify-between w-1/2 gap-4">
          <div>
            <p className="text-lg font-semibold">User System</p>
            <p className="text-gray-400 font-thin text-sm">
              The tables show user in system
            </p>
          </div>

          <SearchUser
            onChange={(value) => {
              setSearchValue(value);
              dispatch(getUserPagingAction(pageIndex, value));
            }}
          />
        </div>

        <div className="grid grid-cols-3">
          <div
            className="flex flex-col col-span-2 shadow-md p-2"
            style={{ height: "650px" }}
          >
            {loading && <LinearProgress />}
            <div className="grid grid-cols-2 px-4 py-2 bg-gray-200 rounded-md font-bold ">
              <div className="text-left border-r-2 border-gray-500">Name</div>

              <div className="text-left pl-3">Email</div>
            </div>
            <div className="flex-grow h-0 overflow-y-auto scroll-sm">
              {user?.items?.map((u) => {
                return (
                  <div
                    key={u.id}
                    onClick={() => selectedUser(u.id)}
                    className={`group rounded-md mt-3 ${user?.selectedUser?.indexOf(u.id) !== -1
                      ? "border-2 border-gray-500"
                      : ""
                      } `}
                  >
                    <div className="grid grid-cols-2 px-4 py-2 bg-gray-100 rounded-md text-sm text-gray-500 shadow-md group-hover:bg-slate-300">
                      <div className="text-left border-r-2 border-gray-300 flex items-center">
                        {u?.picture ? (
                          <img
                            src={u?.picture}
                            alt=""
                            className="cursor-pointer rounded-full w-6 mr-3"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <Avatar
                            name={u?.name}
                            size="24"
                            round={true}
                            className="mr-3"
                          />
                        )}
                        {u?.name}
                      </div>

                      <div className="text-left pl-3 flex items-center">
                        {u?.email}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end">
              <Stack spacing={2}>
                <Pagination
                  count={user?.totalPages}
                  onChange={(e, value) => setPageIndex(value - 1)}
                  color="primary"
                  page={pageIndex + 1}
                />
              </Stack>
            </div>
          </div>
          <div className="p-4">
            <div className="text-center text-md text-gray-500 font-semibold">
              Add members to event room
            </div>

            <LoadingButton
              className="mt-3"
              onClick={onAddMember}
              variant="contained"
              loading={loading}
            >
              Add members
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMembers;
