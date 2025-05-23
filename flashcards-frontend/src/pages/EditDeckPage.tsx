import {
  useParams,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/NavBar";
import Tag from "../components/Tag";
import AddTagModal from "../components/modals/AddTagModal.tsx";
import CreateTagModal from "../components/modals/CreateTagModal.tsx";
import CreateCardModal from "../components/modals/CreateCardModal.tsx";
import { CardBoxDTO, CardDTO, TagDTO } from "../types.ts";
import { MDBBtn, MDBIcon, MDBTypography } from "mdb-react-ui-kit";
import cardsApi from "../apis/cardsApi";
import { useToast } from "../components/Toast.tsx";
import Footer from "../components/Footer.tsx";
import QuestionCardSmall from "../components/QuestionCardSmall.tsx";
import userApi from "../apis/userApi.ts";
import EditCardModal from "../components/modals/EditCardModal.tsx";

export default function EditDeckPage() {
  const { cardboxId } = useParams<{ cardboxId: string }>();

  const { state } = useLocation();
  const toast = useToast();

  const navigate = useNavigate();

  const deck = useLocation().state as CardBoxDTO | null;

  const [userBoxId] = useState(state?.userBoxId);

  if (!cardboxId) {
    return <Navigate to="/" replace />;
  }

  type TagDialog = "add" | "create" | null;
  const [tagDialog, setTagDialog] = useState<TagDialog>(null);

  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [editCardModalOpen, setEditCardModalOpen] = useState(false);

  const [cards, setCards] = useState<CardDTO[]>([]);
  const [tags, setTags] = useState<TagDTO[]>(deck?.tags || []);

  const origTagIds = useRef<Set<number>>(new Set(deck?.tags.map((t) => t.id)));
  const origCardIds = useRef<Set<number>>(new Set());

  const [selectedCard, setSelectedCard] = useState<CardDTO | undefined>(
    undefined
  );

  useEffect(() => {
    if (!cardboxId) return;

    cardsApi
      .get<CardDTO[]>(`/cards/${cardboxId}/all`)
      .then((res) => {
        setCards(res.data);
        origCardIds.current = new Set(res.data.map((c) => c.id));
      })
      .catch(console.error);
  }, [cardboxId]);

  async function handleSave() {
    const newTags = tags.filter((t) => !origTagIds.current.has(t.id));

    const newCards = cards.filter((c) => !origCardIds.current.has(c.id));

    try {
      await cardsApi.post(`/cardboxes/${cardboxId}/bulk`, {
        cards: newCards.map((c) => ({
          question: c.question,
          answer: c.answer,
          questionImageId: c.questionImageId,
          answerImageId: c.answerImageId,
        })),
        tagIds: newTags.map((t) => t.id),
      });

      toast.success("Deck updated successfully!");
      navigate(-1);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to save new cards/tags"
      );
    }
  }

  function onTagRemove(id: number) {
    setTags(tags.filter((t) => t.id !== id));

    try {
      cardsApi.put(`/cardboxes/${cardboxId}/${id}/removeTag`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Tag removing failed");
    }
  }

  function onCardDelete(id: number) {
    if (window.confirm("Are you sure you want to delete this deck?")) {
      setCards(cards.filter((c) => c.id !== id));
      try {
        cardsApi.delete(`/cardboxes/${cardboxId}/deleteCard/${id}`);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Card deletion failed");
      }
      setEditCardModalOpen(false);
    }
  }

  async function handleDeleteDeck() {
    if (window.confirm("Are you sure you want to delete this deck?")) {
      sessionStorage.removeItem("draftCards");
      sessionStorage.removeItem("draftTags");
      try {
        await cardsApi.delete(`/cardboxes/${cardboxId}`);
        await userApi.delete(`/collections/${userBoxId}`);
        toast.success("Deck deleted successfully");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Deck deletion failed");
      }
      window.location.assign("/collection");
    }
  }

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="d-flex justify-content-between align-items-baseline mb-4">
          <h1 className="fw-bold text-dark-green m-0">{deck?.title}</h1>
          <div>
            {" "}
            <MDBBtn className="px-5 fs-5" onClick={handleSave}>
              Save
            </MDBBtn>
            <MDBIcon
              icon="trash"
              size="3x"
              className="ms-5 text-danger trash-button"
              onClick={handleDeleteDeck}
            />
          </div>
        </div>

        <MDBTypography className="text-black fs-5 w-75">
          {deck?.description}
        </MDBTypography>

        <div className="d-flex align-items-center flex-wrap gap-3 border-bottom pb-3 mb-4">
          <MDBBtn
            outline
            color="dark"
            className="py-1 px-3 rounded-pill bg-white fw-semibold"
            style={{ borderStyle: "dashed" }}
            onClick={() => setTagDialog("add")}
          >
            <MDBIcon fas icon="plus" className="me-2" />
            Add tag
          </MDBBtn>

          {tags.map((t) => (
            <div
              key={t.id}
              className="tag-removable d-inline-block"
              onClick={() => onTagRemove(t.id)}
              style={{ display: "inline-block" }}
            >
              <Tag
                key={t.id}
                tagName={t.tagName}
                color={t.color}
                textColor={t.textColor}
              />
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-3">
            <MDBBtn
              className="w-100 rounded-8 d-flex justify-content-center align-items-center py-5 fw-semibold fs-6"
              color="light"
              style={{ height: 150, border: "2px dashed" }}
              onClick={() => setCardModalOpen(true)}
            >
              <MDBIcon fas icon="plus" size="lg" className="me-2" />
              Add&nbsp;card
            </MDBBtn>
          </div>

          {cards.map((c) => (
            <div
              key={c.id}
              className="col-12 col-md-6 col-lg-3 card-editable"
              onClick={() => {
                setSelectedCard(c);
                setEditCardModalOpen(true);
              }}
            >
              <QuestionCardSmall text={c.question} />
            </div>
          ))}
        </div>
      </div>
      <AddTagModal
        open={tagDialog === "add"}
        onClose={() => setTagDialog(null)}
        onCreateNew={() => setTagDialog("create")}
        onTagPicked={(tag) => {
          setTags((prev) =>
            prev.find((t) => t.id === tag.id) ? prev : [...prev, tag]
          );
        }}
      />

      <CreateTagModal
        open={tagDialog === "create"}
        onClose={() => setTagDialog(null)}
        onBack={() => setTagDialog("add")}
        onTagCreated={(tag) => setTags((prev) => [...prev, tag])}
      />

      <CreateCardModal
        open={cardModalOpen}
        onClose={() => setCardModalOpen(false)}
        onCardCreated={(card) => setCards((prev) => [...prev, card])}
      />

      {selectedCard && (
        <EditCardModal
          open={editCardModalOpen}
          onClose={() => setEditCardModalOpen(false)}
          card={selectedCard}
          handleDeleteCard={() => onCardDelete(selectedCard.id)}
        />
      )}
      <Footer />
    </>
  );
}
