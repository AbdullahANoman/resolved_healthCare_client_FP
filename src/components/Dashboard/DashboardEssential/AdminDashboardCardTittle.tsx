import { BsThreeDotsVertical } from "react-icons/bs";

const AdminDashboardCardTittle = ({ tittle }: { tittle: string }) => {
  return (
    <div className="flex justify-between items-center">
      <p className="font-semibold text-md text-gray-700">{tittle}</p>
      <div>
        <BsThreeDotsVertical size={20} className="cursor-pointer" />
      </div>
    </div>
  );
};

export default AdminDashboardCardTittle;
