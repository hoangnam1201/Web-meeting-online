import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Autocomplete,
  LinearProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  clearSelectedUserAction,
  getUserPagingAction,
  selectedUserAction,
  updateUserAction,
} from "../../store/actions/userAction";
import { useState } from "react";
import SearchUser from "../SearchUser";
import Avatar from "react-avatar";

const ManageUser = () => {
  const user = useSelector((state) => state.userManageReducer);
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [searchValue, setSearchValue] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    dispatch(getUserPagingAction(pageIndex,
      searchValue.searchText,
      searchValue.role));
  }, [])

  const selectedUser = (ids) => {
    dispatch(selectedUserAction(ids));
  };

  const onPageChange = (page) => {
    setPageIndex(page)
    dispatch(getUserPagingAction(page,
      searchValue.searchText,
      searchValue.role));
  }

  const updateUserPermission = (data) => {
    const _user = { ids: user?.selectedUser, permission: data };
    dispatch(
      updateUserAction(_user, pageIndex, () => {
        reset({
          role: "",
          maxNoE: "",
        });
      })
    );
  };

  return (
    <div>
      <div className="shadow-md p-4 mt-4">
        <div className="py-4 text-left flex items-center justify-between w-3/4 gap-4">
          <div>
            <p className="text-lg font-semibold">User Management</p>
            <p className="text-gray-400 font-thin text-sm">
              The tables management user in system
            </p>
          </div>
          <SearchUser
            onChange={(value) => {
              setPageIndex(0);
              setSearchValue({ ...searchValue, searchText: value });
              dispatch(getUserPagingAction(0, value, searchValue.role));
            }}
          />
          <Autocomplete
            className="w-80 outline-none shadow-lg bg-slate-100"
            onChange={(e, value) => {
              setPageIndex(0);
              setSearchValue({ ...searchValue, role: value?.role });
              dispatch(
                getUserPagingAction(0, "", value ? value.role : null)
              );
            }}
            loading={user?.loading === "loading"}
            options={[{ role: "ADMIN" }, { role: "HOST" }, { role: "USER" }]}
            getOptionLabel={(o) => o.role}
            isOptionEqualToValue={(option, value) => option.role === value.role}
            renderInput={(params) => (
              <TextField variant="outlined" {...params} label="Role" />
            )}
          />
        </div>

        <div className="grid grid-cols-5">
          <div
            className="flex flex-col col-span-4 shadow-md p-2"
            style={{ height: "650px" }}
          >
            {user?.loading && <LinearProgress />}
            <div className="grid grid-cols-4 px-4 py-2 bg-gray-200 rounded-md font-bold">
              <div className="text-left border-r-2 border-gray-500">Name</div>
              <div className="text-left pl-3 border-r-2 border-gray-500">
                Email
              </div>
              <div className="text-left pl-3">Role</div>
              <div className="text-left pl-3">Max Of Event</div>
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
                    <div className="grid grid-cols-4 px-4 py-2 bg-gray-100 rounded-md text-sm text-gray-500 shadow-md group-hover:bg-slate-300">
                      <div className="text-left border-r-2 border-gray-300 flex items-center">
                        {u?.picture ? (
                          <img
                            src={u?.picture}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="cursor-pointer rounded-full w-6 mr-3"
                          />
                        ) : (
                          <Avatar
                            name={u?.name}
                            size="24"
                            round={true}
                            className="mr-3"
                          />
                        )}
                        <p className=" overflow-hidden text-ellipsis">
                          {u?.name}
                        </p>
                      </div>
                      <div className="text-left pl-3 border-r-2 border-gray-300 flex items-center overflow-hidden text-ellipsis">
                        {u?.email}
                      </div>
                      <div className="text-left pl-3  border-r-2 border-gray-300 flex items-cente">
                        {u?.role}
                      </div>
                      <div className="text-left pl-3 flex items-center">
                        {u?.maxNoE}
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
                  onChange={(e, value) => onPageChange(value - 1)}
                  page={pageIndex + 1}
                  color="primary"
                />
              </Stack>
            </div>
          </div>
          <div className="p-4">
            <div className="text-left text-md text-gray-500 font-semibold">
              Update role
            </div>
            <form className="flex flex-col gap-4">
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                label="Role"
                defaultValue={""}
                select
                {...register("role", {
                  required: "required",
                })}
                error={!!errors?.role}
              >
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="HOST">Host</MenuItem>
              </TextField>
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                label="Max of event room"
                {...register("maxNoE", {
                  required: "required",
                })}
                error={!!errors?.maxNoE}
              />

              <LoadingButton
                onClick={handleSubmit(updateUserPermission)}
                variant="contained"
                loading={user?.loading}
              >
                Update
              </LoadingButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
