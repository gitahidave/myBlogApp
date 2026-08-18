import { Outlet } from "react-router-dom";
import AdminSideBar from "../../components/AdminComponents/Sidebar/SideBar";

const AdminDashboard = () => {
  return (
    <div className="container-fluid px-4 py-3">
      <div className="row g-4">
        {/* Sticky Sidebar Column */}
        <div className="col-12 col-md-4 col-lg-3">
          <div
            className="sticky-md-top"
            style={{ top: "1.5rem", zIndex: 10 }}
          >
            <AdminSideBar />
          </div>
        </div>

        {/* Scrollable Main Content Column */}
        <div className="col-12 col-md-8 col-lg-9">
          <div
            className="bg-light rounded-4 shadow-sm p-4"
            style={{
              maxHeight: "calc(100vh - 2rem)",
              overflowY: "auto",
            }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;