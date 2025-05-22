import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import userApi from "../apis/userApi";
import { useState } from "react";
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import CreateDeckModal from "./modals/CreateDeckModal";

export default function Navbar() {
  const { user, setUser } = useUser();
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
    location.reload();
  }

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <MDBNavbar
        expand="lg"
        light
        bgColor="light"
        className="px-3 py-2 shadow-sm"
        sticky
      >
        <MDBContainer fluid>
          <MDBNavbarNav className="me-auto mb-lg-0 align-items-center">
            <div className="d-flex align-items-center gap-4">
              <MDBNavbarBrand
                href="/"
                className="fw-bold fs-4"
                style={{ color: "#3a5b22" }}
              >
                Flash Cards
              </MDBNavbarBrand>

              <MDBNavbarItem>
                <MDBNavbarLink
                  active
                  aria-current="page"
                  href="/"
                  className="fs-5"
                >
                  Explore
                </MDBNavbarLink>
              </MDBNavbarItem>

              <MDBNavbarItem>
                {user ? (
                  <MDBNavbarLink href="/collection" className="text-black fs-5">
                    Your decks
                  </MDBNavbarLink>
                ) : (
                  <Link to="/login" className="text-black fs-5">
                    Your decks
                  </Link>
                )}
              </MDBNavbarItem>
            </div>

            <div
              className="d-flex align-items-center gap-4 ms-auto"
              style={{ whiteSpace: "nowrap" }}
            >
              <MDBNavbarItem className="mx-3">
                {user ? (
                  <MDBBtn onClick={() => setModalOpen(true)}>
                    Create deck <MDBIcon fas icon="plus" className="ms-2" />
                  </MDBBtn>
                ) : (
                  <MDBBtn onClick={() => navigate("/login")}>
                    Create deck <MDBIcon fas icon="plus" className="ms-2" />
                  </MDBBtn>
                )}
              </MDBNavbarItem>

              <MDBNavbarItem>
                {user ? (
                  <MDBNavbarLink href="/profile">
                    <Link
                      to="/profile"
                      className="text-black fs-5"
                      title="Profile"
                    >
                      <MDBIcon fas icon="user" size="lg" />
                    </Link>
                  </MDBNavbarLink>
                ) : (
                  <Link to="/login" title="Profile">
                    <MDBIcon
                      fas
                      icon="user"
                      className="text-dark-green"
                      size="lg"
                    />
                  </Link>
                )}
              </MDBNavbarItem>

              <MDBNavbarItem>
                {user ? (
                  <MDBNavbarLink
                    href="#"
                    className="text-black fs-5"
                    onClick={handleLogout}
                  >
                    Log Out
                  </MDBNavbarLink>
                ) : (
                  <Link to="/login" className="text-black fs-5">
                    Log In
                  </Link>
                )}
              </MDBNavbarItem>
            </div>
          </MDBNavbarNav>
        </MDBContainer>
      </MDBNavbar>
      <CreateDeckModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
