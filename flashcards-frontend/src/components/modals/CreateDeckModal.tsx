import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBBtn,
  MDBInput,
  MDBSwitch,
  MDBTextArea,
} from "mdb-react-ui-kit";
import cardsApi from "../../apis/cardsApi";
import userApi from "../../apis/userApi";
import { useUser } from "../../context/UserContext";

interface CreateDeckModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateDeckModal({
  open,
  onClose,
}: CreateDeckModalProps) {
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setPublic] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    if (!title) {
      return "Title is required.";
    }
    if (!user) {
      return "Not logged in";
    }
    return "";
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError || !user) {
      setError(validationError);
      return;
    }

    try {
      const res = await cardsApi.post("/cardboxes/create", {
        title,
        isPublic,
        ownerId: user.id,
        description,
      });

      const cardboxId = res.data.id;
      console.log("Deck created with ID:", cardboxId);

      try {
        const res2 = await userApi.post("/collections/" + cardboxId);
        console.log("Deck added to user collections:", res2.data);

        if (res2.status === 201) {
          console.log("Deck added to user collections successfully");
          onClose();
          navigate("/create/" + cardboxId, {
            state: {
              titleEntered: title,
              descriptionEntered: description,
              userBoxId: res2.data.id,
            },
          });
        }
      } catch (error: any) {
        console.error(
          "Error adding deck to user collections:",
          error.response?.data || error
        );
      }
    } catch (error: any) {
      console.log(title, isPublic, user.id, description);
      console.error("Error creating deck:", error.response?.data || error);
    }
  };

  return (
    <MDBModal tabIndex="-1" open={open} onClose={onClose} staticBackdrop>
      <MDBModalDialog centered>
        <MDBModalContent className="p-3 rounded-8">
          <MDBModalHeader className="border-0 pb-0">
            <MDBModalTitle className="fw-bold fs-4 text-dark-green">
              Create new deck
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
              className="mb-4 fs-5 lh-base"
              labelClass="fs-5"
              size="lg"
              value={description}
              maxLength={254}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="d-flex align-items-center gap-3 ">
              <span className="fw-semibold">Public deck</span>
              <MDBSwitch
                id="public-switch"
                checked={isPublic}
                onChange={() => setPublic(!isPublic)}
              />
              <MDBBtn onClick={handleCreate} className="ms-auto">
                Create
              </MDBBtn>
            </div>
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
