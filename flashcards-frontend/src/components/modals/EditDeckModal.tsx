import {
  MDBBtn,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalHeader,
  MDBModalTitle,
  MDBSwitch,
  MDBTextArea,
  MDBTypography,
} from "mdb-react-ui-kit";
import { useState } from "react";
import { CardBoxDTO } from "../../types";
import cardsApi from "../../apis/cardsApi";
import { useToast } from "../Toast";
import { useNavigate } from "react-router-dom";

interface EditDeckModalProps {
  open: boolean;
  onClose: () => void;
  deck: CardBoxDTO;
  userBoxId?: number;
}

export default function EditDeckModal({
  open,
  onClose,
  deck,
  userBoxId,
}: EditDeckModalProps) {
  const toast = useToast();
  const [title, setTitle] = useState(deck.title);
  const [description, setDescription] = useState(deck.description || "");
  const [isPublic, setPublic] = useState(deck.public);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleEdit() {
    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }
    try {
      const { data: updated } = await cardsApi.put(`/cardboxes/${deck.id}`, {
        title,
        isPublic,
        description,
      });
      toast.success("Deck info edited successfully");
      onClose();
      navigate(`/edit/${updated.id}`, {
        state: { ...updated, userBoxId },
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to edit deck"
      );
      console.error(err);
    }
  }

  return (
    <MDBModal tabIndex="-1" open={open} onClose={onClose} staticBackdrop>
      <MDBModalDialog centered>
        <MDBModalContent className="p-3 rounded-8">
          <MDBModalHeader className="border-0 pb-0">
            <MDBModalTitle className="fw-bold fs-4 text-dark-green">
              Edit deck
            </MDBModalTitle>
            <MDBBtn className="btn-close" color="none" onClick={onClose} />
          </MDBModalHeader>

          {error && (
            <div className="text-danger text-start mx-3 my-1">{error}</div>
          )}

          <MDBModalBody>
            <MDBInput
              label="Title"
              className="mb-3 fs-5"
              labelClass="fs-5"
              size="lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <MDBTextArea
              label="Description"
              className="mb-2 fs-5 lh-base"
              labelClass="fs-5"
              size="lg"
              value={description}
              maxLength={254}
              onChange={(e) => setDescription(e.target.value)}
            />

            <MDBTypography
              className="fs-5 text-underline"
              type="button"
              onClick={handleEdit}
            >
              Edit cards and tags
            </MDBTypography>

            <div className="d-flex align-items-center gap-3 mt-4">
              <span className="fw-semibold">Public deck</span>
              <MDBSwitch
                id="public-switch"
                checked={isPublic}
                onChange={() => setPublic(!isPublic)}
              />
              <MDBBtn
                type="button"
                onClick={(e) => {
                  (e as React.MouseEvent<HTMLButtonElement>).stopPropagation();
                  handleEdit();
                }}
                className="ms-auto"
              >
                Save
              </MDBBtn>
            </div>
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
