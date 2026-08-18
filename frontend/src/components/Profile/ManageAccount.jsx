import { FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { CiMail } from "react-icons/ci";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ManageAccount = () => {
  // Avatar State
  const [changeAvatar, setChangeAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Password State
  const [passwords, setPasswords] = useState({
    userPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const backendUrl = useSelector((state) => state.prod.link);

  // Avatar Selection & Preview Handling
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);

    setChangeAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  // Prevent memory leaks on unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Avatar Upload Handler
  const avatarChange = async () => {
    if (!changeAvatar) {
      toast.warning("Please select an image first.");
      return;
    }

    try {
      setAvatarLoading(true);
      const data = new FormData();
      data.append("image", changeAvatar);

      const response = await axios.put(
        `${backendUrl}/api/user/change-avatar`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success(response.data?.message || "Avatar updated successfully!");
      setChangeAvatar(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update avatar."
      );
    } finally {
      setAvatarLoading(false);
    }
  };

  // Password Change Input Handler
  const handlePasswordInput = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Password Change Submit Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const { userPassword, newPassword, confirmPassword } = passwords;

    if (!userPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    try {
      setPasswordLoading(true);
      const response = await axios.put(
        `${backendUrl}/api/user/change-password`,
        { userPassword, newPassword },
        { withCredentials: true }
      );

      toast.success(response.data?.message || "Password updated successfully!");
      setPasswords({ userPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Account Info & Avatar Card */}
      <div className="card shadow-sm border-0 p-4 mb-4">
        <div className="d-flex align-items-center gap-4 flex-wrap">
          <div className="d-flex flex-column align-items-center">
            <div
              className="border rounded-circle d-flex align-items-center justify-content-center overflow-hidden shadow-sm"
              style={{ width: "150px", height: "150px", background: "#f8f9fa" }}
            >
              <label
                htmlFor="imgFile"
                className="w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ cursor: "pointer" }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Avatar preview"
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <FaUser size={60} className="text-secondary" />
                )}
              </label>
            </div>
            <input
              type="file"
              id="imgFile"
              className="d-none"
              accept="image/*"
              onChange={handleAvatar}
            />

            <button
              type="button"
              className={`btn mt-3 ${avatarLoading ? "btn-warning" : "btn-primary"}`}
              onClick={avatarChange}
              disabled={avatarLoading || !changeAvatar}
            >
              {avatarLoading ? "Changing Avatar . . ." : "Change Avatar"}
            </button>
          </div>

          <div className="flex-grow-1">
            <div className="p-3 rounded-3 bg-light border">
              <h4 className="mb-1 fw-bold">John Doe</h4>
              <p className="mb-2 text-muted">Blogger • Developer</p>
              <div className="d-flex flex-column gap-1">
                <small className="text-muted d-flex align-items-center gap-1">
                  <CiMail /> victor.simiyu@gmail.com
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Form */}
      <div className="card shadow-sm border-0 p-4">
        <h5 className="mb-4 fw-bold">Change Password</h5>

        <form className="row g-3" onSubmit={handlePasswordSubmit}>
          <div className="col-12">
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="currentPassword"
                placeholder="Current Password"
                name="userPassword"
                value={passwords.userPassword}
                onChange={handlePasswordInput}
              />
              <label htmlFor="currentPassword">Current Password</label>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="newPassword"
                placeholder="New Password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordInput}
              />
              <label htmlFor="newPassword">New Password</label>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm New Password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordInput}
              />
              <label htmlFor="confirmPassword">Confirm New Password</label>
            </div>
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary btn-sm w-100"
              disabled={passwordLoading}
            >
              {passwordLoading ? "Updating Password..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageAccount;