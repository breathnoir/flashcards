import {
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
} from "mdb-react-ui-kit";
import { useEffect, useRef, useState } from "react";
import { CardDTO } from "../../types";
import cardsApi from "../../apis/cardsApi";
import { uploadImage } from "../../apis/requestFunctions";

interface EditCardModalProps {
  open: boolean;
  onClose: () => void;
  card: CardDTO;
  handleDeleteCard: (id: number) => void;
}

export default function EditCardModal({
  open,
  onClose,
  card,
  handleDeleteCard,
}: EditCardModalProps) {
  const [errorMsg, setError] = useState("");
  const [question, setQ] = useState(card.question);
  const [answer, setA] = useState(card.answer);

  const [qImgFile, setQImgFile] = useState<File | null>(null);
  const [aImgFile, setAImgFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const qInputRef = useRef<HTMLInputElement>(null);
  const aInputRef = useRef<HTMLInputElement>(null);

  const [qPreview, setQPreview] = useState<string | null>(null);
  const [aPreview, setAPreview] = useState<string | null>(null);

  useEffect(() => {
    setQ(card.question);
    setA(card.answer);
    setError("");
    setQImgFile(null);
    setAImgFile(null);

    qPreview && URL.revokeObjectURL(qPreview);
    aPreview && URL.revokeObjectURL(aPreview);
    setQPreview(null);
    setAPreview(null);

    async function loadImages() {
      try {
        if (card.questionImageId) {
          const { data } = await cardsApi.get<Blob>(
            `/images/${card.questionImageId}`,
            { responseType: "blob" }
          );
          setQPreview(URL.createObjectURL(data));
        }
        if (card.answerImageId) {
          const { data } = await cardsApi.get<Blob>(
            `/images/${card.answerImageId}`,
            { responseType: "blob" }
          );
          setAPreview(URL.createObjectURL(data));
        }
      } catch (e) {
        console.error("Pre-loading images failed", e);
      }
    }
    loadImages();

    return () => {
      qPreview && URL.revokeObjectURL(qPreview);
      aPreview && URL.revokeObjectURL(aPreview);
    };
  }, [card]);

  async function handleSave() {
    if (!question.trim() || !answer.trim()) {
      setError("Question and Answer are required.");
      return;
    }
    setBusy(true);
    try {
      const [qImgRes, aImgRes] = await Promise.all([
        qImgFile ? uploadImage(qImgFile) : Promise.resolve(null),
        aImgFile ? uploadImage(aImgFile) : Promise.resolve(null),
      ]);

      await cardsApi.put(`/cards/${card.id}`, {
        question,
        answer,
        questionImageId: qImgRes?.data.id ?? card.questionImageId,
        answerImageId: aImgRes?.data.id ?? card.answerImageId,
      });

      onClose();
      window.location.reload();
    } catch (e: any) {
      setError(e.response?.data?.message ?? "Update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <MDBModal tabIndex="-1" open={open} onClose={onClose} staticBackdrop>
      <MDBModalDialog centered size="lg">
        <MDBModalContent className="p-3 rounded-8" style={{ maxWidth: 600 }}>
          <MDBModalHeader className="border-0 pb-0 d-flex justify-content-between">
            <MDBModalTitle className="fw-bold fs-4 text-dark-green">
              Edit card
            </MDBModalTitle>
            <div className="d-flex align-items-center gap-3">
              <MDBIcon
                icon="trash"
                size="2x"
                className="ms-5 text-danger trash-button"
                onClick={() => {
                  handleDeleteCard;
                  onClose();
                }}
              />
              <MDBBtn className="btn-close" color="none" onClick={onClose} />
            </div>
          </MDBModalHeader>

          <MDBModalBody>
            {errorMsg && <p className="text-danger mt-3">{errorMsg}</p>}

            <div className="d-flex align-items-center gap-3 mb-4">
              <MDBInput
                label="Question"
                className="fs-5 flex-grow-1"
                labelClass="fs-5"
                size="lg"
                value={question}
                onChange={(e) => {
                  setQ(e.target.value);
                  setError("");
                }}
              />
              <input
                type="file"
                accept="image/*"
                hidden
                ref={qInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setQImgFile(file);
                  setQPreview(file ? URL.createObjectURL(file) : null);
                }}
              />
              <MDBBtn
                color="white"
                className="d-flex align-items-center justify-content-center rounded-7 flex-shrink-0 p-0"
                style={{
                  width: 80,
                  height: 80,
                  border: "3px dashed #3a5b22",
                }}
                onClick={() => qInputRef.current?.click()}
              >
                {qPreview ? (
                  <img
                    src={qPreview}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "0.75rem",
                    }}
                  />
                ) : (
                  <MDBIcon
                    fas
                    icon="image"
                    size="4x"
                    className="text-dark-green"
                  />
                )}
              </MDBBtn>
            </div>
            <div className="d-flex align-items-center gap-3">
              <MDBInput
                label="Answer"
                className="fs-5 flex-grow-1"
                labelClass="fs-5"
                size="lg"
                value={answer}
                onChange={(e) => {
                  setA(e.target.value);
                  setError("");
                }}
              />
              <input
                type="file"
                accept="image/*"
                hidden
                ref={aInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setAImgFile(file);
                  setAPreview(file ? URL.createObjectURL(file) : null);
                }}
              />
              <MDBBtn
                color="white"
                className="d-flex align-items-center justify-content-center rounded-7 flex-shrink-0 p-0"
                style={{
                  width: 80,
                  height: 80,
                  border: "3px dashed #3a5b22",
                }}
                onClick={() => aInputRef.current?.click()}
              >
                {aPreview ? (
                  <img
                    src={aPreview}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "0.75rem",
                    }}
                  />
                ) : (
                  <MDBIcon
                    fas
                    icon="image"
                    size="4x"
                    className="text-dark-green"
                  />
                )}
              </MDBBtn>
            </div>
          </MDBModalBody>

          <MDBModalFooter className="border-0 pt-3">
            <MDBBtn className="ms-auto px-5" size="lg" onClick={handleSave}>
              Save
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
