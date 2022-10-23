import { useSelector } from "react-redux";

const ListFloor = ({ currentFloor }) => {
  const roomCall = useSelector(state => state.roomCall);
  return (
    <>
      <div className="scroll-sm flex flex-row gap-4 border overflow-x-auto snap-x p-2">
        {roomCall?.roomInfo?.floors?.map((f, index) => (
          <button
            onClick={() => {
              roomCall.socket.emit("floor:join", f);
            }}
            key={f}
            className={`shadow-md p-1 whitespace-nowrap rounded text-sm font-thin text-gray-500 snap-start scroll-ml-4 ${currentFloor === f && "shadow-lg bg-gray-200"
              }`}
          >
            Floor {index}
          </button>
        ))}
      </div>
    </>
  );
};

export default ListFloor
