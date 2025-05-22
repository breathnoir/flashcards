import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import { useEffect, useState } from "react";
import cardsApi from "../apis/cardsApi";
import { CardBoxDTO, CardDTO } from "../types";
import { MDBBtn, MDBIcon, MDBSpinner, MDBTypography } from "mdb-react-ui-kit";
import QuestionCard from "../components/QuestionCard";
import Footer from "../components/Footer";

export default function LearningPage() {
  const navigate = useNavigate();

  const { cardboxId } = useParams<{ cardboxId: string }>();
  const [deck, setDeck] = useState<CardBoxDTO | null>(null);
  const [cards, setCards] = useState<CardDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    if (!cardboxId) return;

    setLoading(true);
    setError(null);

    Promise.all([
      cardsApi.get<CardBoxDTO>(`/cardboxes/${cardboxId}`),
      cardsApi.get<CardDTO[]>(`/cards/${cardboxId}/all`),
    ])
      .then(([deckRes, cardsRes]) => {
        setDeck(deckRes.data);

        const arr = cardsRes.data.slice();

        if (arr.length === 0) {
          setError("No cards in this deck.");
          return;
        }

        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        setCards(cardsRes.data);
        setCurrentIndex(0);
        setCorrectCount(0);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load deck or cards.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cardboxId]);

  function handleAnswer(isCorrect: boolean) {
    if (isCorrect) setCorrectCount((c) => c + 1);

    const next = currentIndex + 1;
    if (next < cards.length) {
      setCurrentIndex(next);
    } else {
      const success = (correctCount + (isCorrect ? 1 : 0)) / cards.length;
      navigate("/results", {
        state: {
          cardboxId: deck?.id,
          title: deck?.title,
          percentage: success * 100,
        },
      });
    }
  }

  return (
    <>
      <Navbar />

      <div className="page-wrapper">
        {loading && (
          <div className="d-flex justify-content-center mt-5">
            <MDBSpinner grow />
          </div>
        )}

        {!loading && error && (
          <p className="text-danger text-center mt-5">{error}</p>
        )}

        {!loading && !error && deck && (
          <>
            <h1 className="fw-bold text-dark-green mb-5">{deck.title}</h1>
            <div className="d-flex flex-column align-items-center">
              <div>
                <div className="d-flex flex-row w-100 justify-content-between">
                  <MDBTypography className="align-self-start fs-4">
                    Click on the card to flip it
                  </MDBTypography>
                  <MDBTypography className="align-self-end fs-4 mb-4">
                    Card {currentIndex + 1} of {cards.length}
                  </MDBTypography>
                </div>

                <QuestionCard
                  key={cards[currentIndex].id}
                  {...cards[currentIndex]}
                />

                <div className="d-flex flex-row align-items-baseline gap-3 mt-4">
                  <MDBTypography className="align-self-start fs-2 text-dark-green">
                    Was your answer correct?
                  </MDBTypography>
                  <MDBBtn
                    size="lg"
                    color="success"
                    className="rounded-6"
                    onClick={() => handleAnswer(true)}
                  >
                    Yes
                    <MDBIcon className="ms-2" icon="check" size="lg" />
                  </MDBBtn>
                  <MDBBtn
                    size="lg"
                    color="danger"
                    className="rounded-6"
                    onClick={() => handleAnswer(false)}
                  >
                    No
                    <MDBIcon className="ms-2" icon="times" size="lg" />
                  </MDBBtn>
                </div>
              </div>
            </div>
          </>
        )}

        {!loading && !error && !deck && (
          <p className="text-center mt-5">Deck not found.</p>
        )}
      </div>
      <Footer />
    </>
  );
}
