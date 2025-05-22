import { useState, useRef } from "react";
import { CardDTO } from "../../types";
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";
import { uploadImage } from "../../apis/requestFunctions";

interface CreateCardModalProps {
  open: boolean;
  onClose: () => void;
  onCardCreated: (card: CardDTO) => void;
}

export default function CreateCardModal({
  open,
  onClose,
  onCardCreated,
}: CreateCardModalProps) {
  const [errorMsg, setError] = useState("");

  const [question, setQ] = useState("");
  const [answer, setA] = useState("");
  const [qImgFile, setQImgFile] = useState<File | null>(null);
  const [aImgFile, setAImgFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const qInputRef = useRef<HTMLInputElement>(null);
  const aInputRef = useRef<HTMLInputElement>(null);

  const [qPreview, setQPreview] = useState<string | null>(null);
  const [aPreview, setAPreview] = useState<string | null>(null);

  function resetForm() {
    setQ("");
    setA("");
    setQImgFile(null);
    setAImgFile(null);
    if (qPreview) URL.revokeObjectURL(qPreview);
    if (aPreview) URL.revokeObjectURL(aPreview);
    setQPreview(null);
    setAPreview(null);
    setError("");
  }

  async function handleCreate() {
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

      const newCard = {
        question,
        answer,
        questionImageId: qImgRes?.data.id,
        answerImageId: aImgRes?.data.id,
      };

      onCardCreated(newCard as CardDTO);

      resetForm();

      onClose();
    } catch (err: any) {
      console.error("Failed to create card", err);
      setError(
        err.response?.data?.message || "Upload or create request failed."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <MDBModal tabIndex="-1" open={open} onClose={onClose} staticBackdrop>
      <MDBModalDialog centered size="lg">
        <MDBModalContent className="p-3 rounded-8" style={{ maxWidth: 600 }}>
          <MDBModalHeader className="border-0 pb-0">
            <MDBModalTitle className="fw-bold fs-4 text-dark-green">
              Create new card
            </MDBModalTitle>
            <MDBBtn className="btn-close" color="none" onClick={onClose} />
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
            <MDBBtn
              className="ms-auto px-5"
              size="lg"
              disabled={busy}
              onClick={handleCreate}
            >
              Create
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
