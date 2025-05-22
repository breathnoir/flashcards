import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import userApi from "../apis/userApi";
import studyImg from "../assets/study-desk.jpg";
import Footer from "../components/Footer";

export default function LogInPage() {
  useEffect(() => {
    document.body.classList.add("no-bg");
    return () => {
      document.body.classList.remove("no-bg");
    };
  }, []);

  const { setUser } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    const { username, password } = form;
    if (!username || !password) {
      return "All fields are required.";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await userApi.post("/auth/login", form);

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      navigate("/");
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.error || "Login failed";
      setError(message);
    }
  };

  return (
    <MDBContainer fluid className="p-0">
      <MDBRow className="g-0 min-vh-100">
        {/* LEFT 50 % */}
        <MDBCol md={6} className="d-flex justify-content-center">
          <div className="p-5 text-center">
            <h1 className="mb-3">
              <Link to="/" className="text-dark-green">
                Flash Cards
              </Link>
            </h1>
            <h2 className="mb-8 text-start">Welcome Back!</h2>
            {error && (
              <div className="text-danger text-start mb-3">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="mb-3">
              <MDBInput
                label="Username"
                type="text"
                className="mb-4"
                id="username"
                name="username"
                onChange={handleChange}
              />
              <MDBInput
                label="Password"
                type="password"
                className="mb-4"
                id="password"
                name="password"
                onChange={handleChange}
              />
              <MDBBtn type="submit" className="w-100">
                Log in
              </MDBBtn>
            </form>
            Don't have an account?{" "}
            <Link to="/signup" className="link-primary">
              Sign Up
            </Link>
          </div>
        </MDBCol>

        {/* RIGHT 50 % */}
        <MDBCol md={6} className="p-0">
          <img src={studyImg} alt="study desk" className="w-100 vh-100" />
        </MDBCol>
      </MDBRow>
      <Footer />
    </MDBContainer>
  );
}
