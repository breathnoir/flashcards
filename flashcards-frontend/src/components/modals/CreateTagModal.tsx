import { useState } from "react";
import cardsApi from "../../apis/cardsApi";
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBBtn,
  MDBInput,
} from "mdb-react-ui-kit";
import { TagDTO } from "../../types";

interface CreateTagModalProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  onTagCreated: (tag: TagDTO) => void;
}

export default function CreateTagModal({
  open,
  onClose,
  onBack,
  onTagCreated,
}: CreateTagModalProps) {
  const [tagName, setTagName] = useState("");
  const [color, setColor] = useState("#28b5f5");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function textColor(hex: string): "#000" | "#fff" {
    const c = hex.charAt(0) === "#" ? hex.slice(1) : hex;
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 200 ? "#000" : "#fff";
  }

  async function handleCreate() {
    if (!tagName.trim()) {
      setError("Tag name is required");
      return;
    }
    setBusy(true);
    try {
      const { data: createdTag } = await cardsApi.post("/tags", {
        tagName: tagName.trim(),
        color,
        textColor: textColor(color),
      });
      onTagCreated(createdTag);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create tag");
    } finally {
      setBusy(false);
    }
  }

  return (
    <MDBModal tabIndex="-1" open={open} onClose={onClose} staticBackdrop>
      <MDBModalDialog centered size="sm">
        <MDBModalContent className="p-3 rounded-8">
          <MDBModalHeader className="border-0 pb-0">
            <MDBModalTitle className="fw-bold fs-4 text-dark-green">
              Create tag
            </MDBModalTitle>
            <MDBBtn className="btn-close" color="none" onClick={onClose} />
          </MDBModalHeader>

          <MDBModalBody>
            {error && <p className="text-danger">{error}</p>}

            <MDBInput
              label="Tag name"
              className="mb-4 fs-5"
              labelClass="fs-5"
              size="lg"
              value={tagName}
              onChange={(e) => {
                setTagName(e.target.value);
                setError("");
              }}
            />

            <label className="d-flex align-items-center gap-3 mb-4 ps-1">
              <span className="fw-semibold">Color:</span>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ width: 40, height: 40, border: "none", padding: 0 }}
              />
            </label>

            <div className="d-flex align-items-center justify-content-around">
              <MDBBtn size="lg" onClick={onBack}>
                Back
              </MDBBtn>
              <MDBBtn size="lg" disabled={busy} onClick={handleCreate}>
                Create
              </MDBBtn>
            </div>
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
