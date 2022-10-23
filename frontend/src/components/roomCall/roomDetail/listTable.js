import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { roomCallJoinTable, setSeletedTable } from "../../../store/actions/roomCallAction";
import Table1 from "../tables/table1";
import Table2 from "../tables/table2";
import Table3 from "../tables/table3";
import Table4 from "../tables/table4";
import Table5 from "../tables/table5";
import Table6 from "../tables/table6";
import Table7 from "../tables/table7";
import Table8 from "../tables/table8";

const ListTable = ({
  tables,
}) => {
  const dispatch = useDispatch();
  const roomCall = useSelector(state => state.roomCall);

  const selecteTableHandler = (id) => {
    if (!roomCall.joinLoading)
      dispatch(setSeletedTable(id));
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2 relative z-0 grid-flow-row-dense">
        {tables?.map((t) => {
          switch (t.numberOfSeat) {
            case 1:
              return (
                <Table1
                  key={t._id}
                  className={`'h-full shadow hover:border-blue-300 border-4 ${roomCall?.selectedTable === t._id && 'border-blue-400'}`}
                  data={t}
                  onClick={() => selecteTableHandler(t._id)}
                />
              );
            case 2:
              return (
                <Table2
                  key={t._id}
                  className={`h-full shadow  hover:border-blue-300 border-4 ${roomCall?.selectedTable === t._id && 'border-blue-400'}`}
                  data={t}
                  onClick={() => selecteTableHandler(t._id)}
                />
              );
            case 3:
              return (
                <Table3
                  key={t._id}
                  className={`h-full shadow hover:border-blue-300 border-4 ${roomCall?.selectedTable === t._id && 'border-blue-400'}`}
                  data={t}
                  onClick={() => selecteTableHandler(t._id)}
                />
              );
            case 4:
              return (
                <Table4
                  key={t._id}
                  className={`h-full shadow hover:border-blue-300 border-4 ${roomCall?.selectedTable === t._id && 'border-blue-400'}`}
                  data={t}
                  onClick={() => selecteTableHandler(t._id)}
                />
              );
            case 5:
              return (
                <Table5
                  key={t._id}
                  className={`h-full col-span-2 shadow hover:border-blue-300 border-4
                  ${roomCall?.selectedTable === t._id && 'border-blue-400'}`}
                  data={t}
                  onClick={() => selecteTableHandler(t._id)}
                />
              );
            case 6:
              return (
                <Table6
                  key={t._id}
                  className={`h-full col-span-2 shadow hover:border-blue-300
                   border-4 ${roomCall?.selectedTable === t._id && 'border-blue-400'}`}
                  data={t}
                  onClick={() => selecteTableHandler(t._id)}
                />
              );
            case 7:
              return (
                <Table7
                  key={t._id}
                  className={`h-full col-span-2 shadow hover:border-blue-300 border-4
                  ${roomCall?.selectedTable === t._id && 'border-blue-400'}`}
                  data={t}
                  onClick={() => selecteTableHandler(t._id)}
                />
              );
            default:
              return (
                <Table8
                  key={t._id}
                  className={`h-full col-span-2 shadow hover:border-blue-300 border-4
                  ${roomCall?.selectedTable === t._id && 'border-blue-400'}`}
                  data={t}
                  onClick={() => selecteTableHandler(t._id)}
                />
              );
          }
        })}
      </div>
    </div>
  );
};
export default ListTable