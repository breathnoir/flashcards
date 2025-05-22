import Navbar from "../components/NavBar";
import CardBoxGrid from "../components/CardBoxGrid";
import {
  MDBInputGroup,
  MDBIcon,
  MDBBtn,
  MDBRadio,
  MDBContainer,
  MDBTypography,
  MDBSpinner,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";
import cardsApi from "../apis/cardsApi";
import userApi from "../apis/userApi";
import { useEffect, useState } from "react";
import { CardBoxDTO, UserBoxDTO } from "../types";
import { useUser } from "../context/UserContext";
import Footer from "../components/Footer";
import DeckDetailsModal from "../components/modals/DeckDetailsModal";
import { useNavigate } from "react-router-dom";
import EditDeckModal from "../components/modals/EditDeckModal";

export default function ExplorePage() {
  const { user } = useUser();

  const navigate = useNavigate();

  const [decks, setDecks] = useState<CardBoxDTO[]>([]);
  const [collectionMap, setCollectionMap] = useState<Record<number, number>>(
    {}
  );
  const [successPercentages, setSuccessPercentages] = useState<
    Record<number, number>
  >({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState<"all" | "title" | "tag">("all");

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const totalPages = Math.ceil(decks.length / pageSize);
  const pagedDecks = decks.slice((page - 1) * pageSize, page * pageSize);

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
    const deckPromise = cardsApi.get<CardBoxDTO[]>("/cardboxes/public");
    const collPromise = user
      ? userApi.get<UserBoxDTO[]>("/collections/my")
      : Promise.resolve({ data: [] });

    Promise.all([deckPromise, collPromise])
      .then(([deckRes, collRes]) => {
        setDecks(deckRes.data);
        const map: Record<number, number> = {};
        collRes.data.forEach((ub: UserBoxDTO) => {
          map[ub.cardBoxId] = ub.id;
        });
        const map2: Record<number, number> = {};
        collRes.data.forEach((ub: UserBoxDTO) => {
          map2[ub.cardBoxId] = ub.successPercentage;
        });
        setSuccessPercentages(map2);
        setCollectionMap(map);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const params =
        searchBy === "title"
          ? { title: query.trim() }
          : searchBy === "tag"
          ? { tag: query.trim() }
          : { keyword: query.trim() };

      const { data } = await cardsApi.get<CardBoxDTO[]>("/cardboxes/search", {
        params,
      });
      setDecks(data);
      setPage(1);
    } catch (err) {
      console.error(err);
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(boxId: number) {
    const res = await userApi.post<UserBoxDTO>("/collections/" + boxId);
    setCollectionMap((m) => ({ ...m, [boxId]: res.data.id }));
  }

  async function handleRemove(userBoxId: number, boxId: number) {
    await userApi.delete("/collections/" + userBoxId);
    setCollectionMap((m) => {
      const next = { ...m };
      delete next[boxId];
      return next;
    });
  }

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <MDBInputGroup
          tag="form"
          className="d-flex w-auto"
          onSubmit={handleSearch}
        >
          <input
            className="form-control form-control-lg fs-5 p-4"
            placeholder="Search decks"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
          />
          <MDBBtn
            id="big-search-btn"
            color="tertiary"
            className="px-4 py-3 d-flex align-items-center"
            onClick={handleSearch}
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

        <hr className="my-4" />

        {loading ? (
          <div className="d-flex justify-content-center mt-5">
            <MDBSpinner />
          </div>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : decks.length === 0 ? (
          <p className="text-center text-muted">No matches</p>
        ) : (
          <>
            <CardBoxGrid
              decks={pagedDecks}
              userBoxMap={collectionMap}
              successMap={successPercentages}
              onAdd={user ? handleAdd : undefined}
              onRemove={user ? handleRemove : undefined}
              canCollect={!!user}
              onCardClick={handleShowInfo}
            />

            {totalPages > 1 && (
              <MDBPagination className="my-4 justify-content-center">
                <MDBPaginationItem disabled={page === 1}>
                  <MDBPaginationLink
                    aria-label="Previous"
                    onClick={() => setPage(page - 1)}
                  >
                    <span aria-hidden="true">{"<"}</span>
                  </MDBPaginationLink>
                </MDBPaginationItem>

                {Array.from({ length: totalPages }, (_, i) => (
                  <MDBPaginationItem active={page === i + 1} key={i}>
                    <MDBPaginationLink onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </MDBPaginationLink>
                  </MDBPaginationItem>
                ))}

                <MDBPaginationItem disabled={page === totalPages}>
                  <MDBPaginationLink
                    aria-label="Next"
                    onClick={() => setPage(page + 1)}
                  >
                    <span aria-hidden="true">{">"}</span>
                  </MDBPaginationLink>
                </MDBPaginationItem>
              </MDBPagination>
            )}
          </>
        )}
      </div>
      <Footer />

      {deckDialog === "info" && selectedDeck && (
        <DeckDetailsModal
          open
          deck={selectedDeck}
          inCollection={
            selectedDeck ? Boolean(collectionMap[selectedDeck.id]) : false
          }
          canCollect={!!user}
          userBoxId={selectedDeck ? collectionMap[selectedDeck.id] : undefined}
          onClose={handleCloseDialog}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onStartLearning={(id) => {
            navigate("/learning/" + id);
          }}
          onEdit={handleShowEdit}
        />
      )}

      {deckDialog === "edit" && selectedDeck && (
        <EditDeckModal
          open
          onClose={handleCloseDialog}
          deck={selectedDeck}
          userBoxId={selectedDeck ? collectionMap[selectedDeck.id] : undefined}
        />
      )}
    </>
  );
}
