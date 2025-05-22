import { MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";
import { ProfileRow } from "../components/ProfileRow";
import { useUser } from "../context/UserContext";
import { useToast } from "../components/Toast";
import { useNavigate } from "react-router-dom";
import userApi from "../apis/userApi";

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const toast = useToast();

  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await userApi.post("/auth/logout");
    } catch (err) {
      console.error("logout failed", err);
    }
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/");
  }

  if (!user) return <p>Please log in to view your profile.</p>;

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      handleLogout();
      toast.info("Account deleted successfully.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        {user && (
          <div className="w-75 ms-5 ps-5 pe-5">
            <h1 className="fs-1 mb-4">Hi, {user.username}!</h1>
            <ProfileRow
              label="Username"
              name="username"
              value={user.username}
            />

            <ProfileRow label="Email" name="email" value={user.email} />

            <ProfileRow label="Password" name="password" value="" />

            <MDBBtn
              color="danger"
              className="mt-5 py-3 rounded-6"
              onClick={handleDeleteAccount}
            >
              Delete account
              <MDBIcon icon="trash" className="ms-3" size="lg" />
            </MDBBtn>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
