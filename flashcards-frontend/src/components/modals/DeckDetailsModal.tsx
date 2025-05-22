import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import Tag from "../Tag";
import { CardBoxDTO } from "../../types";
import { useToast } from "../Toast";
import { useUser } from "../../context/UserContext";

interface DeckDetailsModalProps {
  open: boolean;
  deck?: CardBoxDTO;
  inCollection: boolean;
  userBoxId?: number;
  onClose: () => void;
  onAdd?: (boxId: number) => void;
  onRemove?: (userBoxId: number, boxId: number) => void;
  canCollect: boolean;
  onStartLearning: (boxId: number) => void;
  onEdit: () => void;
}

export default function DeckDetailsModal({
  open,
  deck,
  inCollection,
  userBoxId,
  onClose,
  onAdd,
  onRemove,
  canCollect,
  onStartLearning,
  onEdit,
}: DeckDetailsModalProps) {
  const toast = useToast();
  const { user, setUser } = useUser();

  if (!deck) return null;

  const handleClick = () => {
    if (!user) {
      toast.info("Please log in to start learning");
    } else {
      onStartLearning(deck.id);
    }
  };

  const handleToggle = async () => {
    if (!canCollect) {
      toast.error("You need to be logged in to add decks to your collection.");
      return;
    }
    try {
      if (inCollection) {
        await onRemove!(userBoxId!, deck.id);
      } else {
        await onAdd!(deck.id);
      }
    } catch (error) {
      toast.error("An error occurred while updating your collection.");
    }
  };

  return (
    <MDBModal tabIndex="-1" open={open} onClose={onClose} staticBackdrop>
      <MDBModalDialog centered>
        <MDBModalContent className="p-2 rounded-8">
          <MDBModalHeader className="d-flex justify-content-between align-items-center">
            <MDBModalTitle className="fw-bold fs-2 text-dark-green text-capitalize">
              {deck.title}
            </MDBModalTitle>
            <div className="d-flex align-items-center gap-4 ms-auto">
              {deck.ownerUsername === user?.username && (
                <MDBIcon
                  icon="edit"
                  size="3x"
                  className="text-dark-green"
                  role="button"
                  onClick={(e: React.MouseEvent<SVGElement>) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                />
              )}

              <MDBIcon
                fas={inCollection}
                far={!inCollection}
                icon="heart"
                size="3x"
                className="text-dark-green cursor-pointer"
                role="button"
                onClick={(e: React.MouseEvent<SVGElement>) => {
                  e.stopPropagation();
                  handleToggle();
                }}
              />
              <MDBBtn className="btn-close" color="none" onClick={onClose} />
            </div>
          </MDBModalHeader>
          <MDBModalBody>
            <p className="text-muted mb-3">Author: {deck.ownerUsername}</p>
            <p className="text-black mb-4">{deck.description}</p>
            <div className="gap-2 d-flex flex-wrap">
              {deck.tags.map((t) => (
                <Tag
                  key={t.id}
                  tagName={t.tagName}
                  color={t.color}
                  textColor={t.textColor}
                />
              ))}
            </div>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn
              size="lg"
              onClick={handleClick}
              className={user ? "" : "opacity-50 cursor-not-allowed"}
              style={!user ? { pointerEvents: "auto" } : {}}
            >
              Start Learning
              <MDBIcon fas icon="play" className="ms-3" />
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
