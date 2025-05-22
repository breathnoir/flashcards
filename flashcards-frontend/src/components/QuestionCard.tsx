import {
  MDBCard,
  MDBCardBody,
  MDBSpinner,
  MDBTypography,
} from "mdb-react-ui-kit";
import { CardDTO } from "../types";
import { useEffect, useState } from "react";
import cardsApi from "../apis/cardsApi";

export default function QuestionCard({
  id,
  question,
  answer,
  questionImageId,
  answerImageId,
}: CardDTO) {
  const [flipped, setFlipped] = useState(false);

  const [qImgSrc, setQImgSrc] = useState<string | null>(null);
  const [aImgSrc, setAImgSrc] = useState<string | null>(null);
  const [loading, setLoadingImgs] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingImgs(true);

    const promises: Promise<void>[] = [];
    if (questionImageId) {
      promises.push(
        cardsApi
          .get<Blob>(`/images/${questionImageId}`, { responseType: "blob" })
          .then((res) => {
            if (!cancelled) setQImgSrc(URL.createObjectURL(res.data));
          })
      );
    }
    if (answerImageId) {
      promises.push(
        cardsApi
          .get<Blob>(`/images/${answerImageId}`, { responseType: "blob" })
          .then((res) => {
            if (!cancelled) setAImgSrc(URL.createObjectURL(res.data));
          })
      );
    }

    Promise.all(promises)
      .catch((err) => console.error("Image load error", err))
      .finally(() => {
        if (!cancelled) setLoadingImgs(false);
      });

    return () => {
      cancelled = true;
      qImgSrc && URL.revokeObjectURL(qImgSrc);
      aImgSrc && URL.revokeObjectURL(aImgSrc);
    };
  }, [questionImageId, answerImageId]);

  return (
    <>
      <div
        className="flip-card"
        style={{ minHeight: 400, width: 800 }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className={
            "flip-card-inner rounded-8 shadow-sm" + (flipped ? " flipped" : "")
          }
        >
          <MDBCard
            className="flip-card-front shadow-sm"
            style={{ minHeight: 400 }}
          >
            <MDBCardBody className="d-flex flex-column align-items-center justify-content-center p-3">
              <MDBTypography className="fs-2">{question}</MDBTypography>
              {loading && (
                <div style={{ width: "40%", textAlign: "center" }}>
                  <MDBSpinner />
                </div>
              )}

              {qImgSrc && !loading && (
                <div
                  style={{
                    width: "70%",
                    display: "flex",
                    alignItems: "center",
                    paddingTop: 12,
                  }}
                >
                  <img
                    src={qImgSrc}
                    alt="question"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: 8,
                    }}
                  />
                </div>
              )}
            </MDBCardBody>
          </MDBCard>

          <MDBCard
            className="flip-card-back  shadow-sm"
            style={{ minHeight: 400 }}
          >
            <MDBCardBody className="d-flex flex-column align-items-center justify-content-center p-3">
              <MDBTypography className="fs-2">{answer}</MDBTypography>
              {loading && (
                <div style={{ width: "40%", textAlign: "center" }}>
                  <MDBSpinner />
                </div>
              )}

              {aImgSrc && !loading && (
                <div
                  style={{
                    width: "70%",
                    display: "flex",
                    alignItems: "center",
                    paddingTop: 12,
                  }}
                >
                  <img
                    src={aImgSrc}
                    alt="answer"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: 8,
                    }}
                  />
                </div>
              )}
            </MDBCardBody>
          </MDBCard>
        </div>
      </div>
    </>
  );
}
