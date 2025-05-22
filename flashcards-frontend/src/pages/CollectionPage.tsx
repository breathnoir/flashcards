import {
  MDBBtn,
  MDBContainer,
  MDBIcon,
  MDBInputGroup,
  MDBRadio,
  MDBSpinner,
  MDBTypography,
} from "mdb-react-ui-kit";
import Navbar from "../components/NavBar";
import { useEffect, useMemo, useState } from "react";
import { CardBoxDTO, UserBoxDTO } from "../types";
import cardsApi from "../apis/cardsApi";
import FilterDropdown, { FilterOption } from "../components/FilterDropDown";
import { useUser } from "../context/UserContext";
import CardBoxGrid from "../components/CardBoxGrid";
import userApi from "../apis/userApi";
import Footer from "../components/Footer";
import DeckDetailsModal from "../components/modals/DeckDetailsModal";
import { useNavigate } from "react-router-dom";
import EditDeckModal from "../components/modals/EditDeckModal";

export default function CollectionPage() {
  const navigate = useNavigate();

  const { user } = useUser();

  const [decks, setDecks] = useState<CardBoxDTO[]>([]);
  const [userBoxMap, setUserBoxMap] = useState<Record<number, number>>({});
  const [successPercentages, setSuccessPercentages] = useState<
    Record<number, number>
  >({});
  const [removedSet, setRemovedSet] = useState<Set<number>>(new Set());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<FilterOption>("All");

  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState<"all" | "title" | "tag">("all");

  const [selectedDeck, setSelectedDeck] = useState<CardBoxDTO | undefined>(
    undefined
  );

  type DeckDialog = "info" | "edit" | null;
  const [deckDialog, setDeckDialog] = useState<DeckDialog>(null);

  function handleShowInfo(deck: CardBoxDTO) {
    setSelectedDeck(deck);
    setDeckDialog("info");
  }

  function handleShowEdit() {
    setDeckDialog("edit");
  }

  function handleCloseDialog() {
    setDeckDialog(null);
  }

  useEffect(() => {
    setLoading(true);
    async function loadCollection() {
      try {
        const userBoxRes = await userApi.get<UserBoxDTO[]>("/collections/my");
        const userBoxIds = userBoxRes.data.map((ub) => ub.cardBoxId);

        const map2: Record<number, number> = {};
        userBoxRes.data.forEach((ub) => {
          map2[ub.cardBoxId] = ub.successPercentage;
        });
        setSuccessPercentages(map2);

        const map: Record<number, number> = {};
        userBoxRes.data.forEach((ub) => {
          map[ub.cardBoxId] = ub.id;
        });
        setUserBoxMap(map);

        if (userBoxIds.length === 0) {
          setDecks([]);
          return;
        }
        const deckRes = await cardsApi.post<CardBoxDTO[]>(
          "/cardboxes/collection",
          userBoxIds
        );
        setDecks(deckRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load collection");
      } finally {
        setLoading(false);
      }
    }
    loadCollection();
  }, []);

  async function handleAdd(boxId: number) {
    const res = await userApi.post<UserBoxDTO>("/collections/" + boxId);
    setUserBoxMap((m) => ({ ...m, [boxId]: res.data.id }));
    setRemovedSet((s) => {
      const nxt = new Set(s);
      nxt.delete(boxId);
      return nxt;
    });
  }

  async function handleRemove(userBoxId: number, boxId: number) {
    await userApi.delete("/collections/" + userBoxId);

    setUserBoxMap((m) => {
      const nxt = { ...m };
      delete nxt[boxId];
      return nxt;
    });

    setRemovedSet((s) => {
      const nxt = new Set(s);
      nxt.add(boxId);
      return nxt;
    });
  }

  const displayedDecks = useMemo(() => {
    let arr = decks.filter((d) => {
      if (filter === "Added") return d.ownerUsername !== user?.username;
      if (filter === "Created") return d.ownerUsername === user?.username;
      return true;
    });

    const q = query.trim().toLowerCase();
    if (q) {
      arr = arr.filter((d) => {
        if (searchBy === "title") {
          return d.title.toLowerCase().includes(q);
        }
        if (searchBy === "tag") {
          return d.tags.some((t) => t.tagName.toLowerCase().includes(q));
        }

        return (
          d.title.toLowerCase().includes(q) ||
          d.tags.some((t) => t.tagName.toLowerCase().includes(q))
        );
      });
    }

    return arr;
  }, [decks, filter, query, searchBy, user?.username]);

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="d-flex align-items-start gap-5 flex-wrap">
          <FilterDropdown initial={filter} onChange={setFilter} />
          <div className="w-75">
            <MDBInputGroup
              tag="form"
              className="d-flex w-auto"
              onSubmit={(e?: React.FormEvent) => e?.preventDefault()}
            >
              <input
                className="form-control form-control-lg fs-5 p-4"
                placeholder="Search decks"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
              />
              <MDBBtn
                type="button"
                id="big-search-btn"
                color="tertiary"
                className="px-4 py-3 d-flex align-items-center"
              >
                <MDBIcon fas icon="search" size="lg" />
              </MDBBtn>
            </MDBInputGroup>

            <MDBContainer className="my-4">
              <MDBTypography className="d-inline me-3 fw-semibold fs-5">
                Search by:
              </MDBTypography>

              <MDBRadio
                name="searchBy"
                id="byAll"
                value="All"
                label="All"
                inline
                checked={searchBy === "all"}
                onChange={() => setSearchBy("all")}
              />
              <MDBRadio
                name="searchBy"
                id="byTitle"
                value="Title"
                label="Title"
                inline
                checked={searchBy === "title"}
                onChange={() => setSearchBy("title")}
              />
              <MDBRadio
                name="searchBy"
                id="byTag"
                value="Tag"
                label="Tag"
                inline
                checked={searchBy === "tag"}
                onChange={() => setSearchBy("tag")}
              />
            </MDBContainer>
          </div>
        </div>
        <hr className="my-4" />
        {loading ? (
          <div className="d-flex justify-content-center mt-5">
            <MDBSpinner />
          </div>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : displayedDecks.length === 0 ? (
          <p className="text-center text-muted">No matches</p>
        ) : (
          <CardBoxGrid
            decks={displayedDecks}
            onAdd={user ? handleAdd : undefined}
            onRemove={user ? handleRemove : undefined}
            canCollect={!!user}
            userBoxMap={userBoxMap}
            successMap={successPercentages}
            removedSet={removedSet}
            onCardClick={handleShowInfo}
          />
        )}
      </div>
      <Footer />
      {deckDialog === "info" && selectedDeck && (
        <DeckDetailsModal
          open
          deck={selectedDeck}
          inCollection={
            !!selectedDeck && userBoxMap[selectedDeck.id] !== undefined
          }
          onClose={handleCloseDialog}
          onAdd={handleAdd}
          onRemove={handleRemove}
          userBoxId={selectedDeck ? userBoxMap[selectedDeck.id] : undefined}
          canCollect={!!user}
          onStartLearning={(id) => navigate("/learning/" + id)}
          onEdit={handleShowEdit}
        />
      )}

      {deckDialog === "edit" && selectedDeck && (
        <EditDeckModal
          open
          onClose={handleCloseDialog}
          deck={selectedDeck}
          userBoxId={selectedDeck ? userBoxMap[selectedDeck.id] : undefined}
        />
      )}
    </>
  );
}
