import SideBar from "../../components/Profile/SideBar";
import { Outlet } from "react-router-dom";

const Profile = () => {
  return (
    <div className="container mb-4 py-4">
      <div className="row g-4">
        {/* Sidebar Column */}
        <div className="col-12 col-md-3 col-lg-2">
          <div className="sticky-top" style={{ top: "20px", zIndex: 10 }}>
            <SideBar />
          </div>
        </div>

        {/* Dynamic Nested Content Column */}
        <div className="col-12 col-md-9 col-lg-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Profile;