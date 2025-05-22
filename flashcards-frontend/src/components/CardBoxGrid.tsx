import { CardBoxDTO } from "../types";
import CardBox from "./CardBox";

interface CardBoxGridProps {
  decks: CardBoxDTO[];
  onAdd?: (boxId: number) => void;
  onRemove?: (userBoxId: number, boxId: number) => void;
  canCollect?: boolean;
  userBoxMap?: Record<number, number>;
  successMap?: Record<number, number>;
  removedSet?: Set<number>;
  onCardClick?: (deck: CardBoxDTO) => void;
}

export default function CardBoxGrid({
  decks,
  onAdd,
  onRemove,
  canCollect = false,
  userBoxMap = {},
  successMap = {},
  removedSet = new Set<number>(),
  onCardClick,
}: CardBoxGridProps) {
  return (
    <div className="row g-4">
      {decks.map((d) => {
        const userBoxId = userBoxMap[d.id];
        const successPercentage = successMap[d.id];
        const inCollection =
          canCollect && userBoxId !== undefined && !removedSet.has(d.id);

        return (
          <div
            key={d.id}
            className="col-12 col-md-6 col-lg-4"
            onClick={() => onCardClick?.(d)}
          >
            <CardBox
              {...d}
              inCollection={inCollection}
              userBoxId={userBoxId}
              successPercentage={successPercentage}
              onAdd={onAdd}
              onRemove={onRemove}
              canCollect={canCollect}
            />
          </div>
        );
      })}
    </div>
  );
}
