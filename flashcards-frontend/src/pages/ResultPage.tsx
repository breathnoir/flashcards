import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";
import { useEffect } from "react";
import userApi from "../apis/userApi";
import { MDBTypography } from "mdb-react-ui-kit";
import { useToast } from "../components/Toast";

export default function ResultPage() {
  const { state } = useLocation();
  const { cardboxId, title, percentage } = state;

  const toast = useToast();

  useEffect(() => {
    try {
      userApi.get("/collections/check/" + cardboxId).then((res) => {
        const collectionId = res.data;
        if (collectionId != 0) {
          userApi.put("/collections/" + collectionId, percentage);
        }
      });
    } catch (error) {
      toast.error("Failed to save your score.");
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="page-wrapper d-flex flex-column align-items-center">
        <h1 className="fw-bold text-dark-green mb-5">{title}</h1>
        <MDBTypography className="fs-1 text-dark-green">
          Your score is: {percentage}%
        </MDBTypography>
        <a href="/collection" className="fs-3 text-underline">
          Back to your decks
        </a>
      </div>

      <Footer />
    </>
  );
}
