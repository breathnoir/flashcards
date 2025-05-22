import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBIcon,
} from "mdb-react-ui-kit";
import Tag from "./Tag";
import { useState } from "react";
import { useToast } from "./Toast";
import { CardBoxDTO } from "../types";

interface CardBoxProps extends CardBoxDTO {
  inCollection: boolean;
  userBoxId: number | undefined;
  successPercentage?: number;
  onAdd?: (boxId: number) => void;
  onRemove?: (userBoxId: number, boxId: number) => void;
  canCollect: boolean;
}

export default function CardBox({
  id,
  title,
  ownerUsername,
  tags,
  inCollection,
  userBoxId,
  successPercentage,
  onAdd,
  onRemove,
  canCollect,
}: CardBoxProps) {
  const MAX_VISIBLE_TAGS = 4;

  const toast = useToast();

  const [busy, setBusy] = useState(false);

  const handleToggle = async () => {
    if (!canCollect) {
      toast.error("You need to be logged in to add decks to your collection.");
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      if (inCollection) {
        await onRemove!(userBoxId!, id);
      } else {
        await onAdd!(id);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <MDBCard className="card-box border-2 rounded-8">
      <MDBCardBody className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start">
          <MDBCardTitle className="h4 text-dark-green mb-0 truncate-2 text-capitalize">
            {title}
          </MDBCardTitle>

          <MDBIcon
            fas={inCollection}
            far={!inCollection}
            icon="heart"
            size="2x"
            className={`text-dark-green ${
              busy ? "opacity-50" : "cursor-pointer"
            }`}
            role="button"
            onClick={handleToggle}
          />
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <MDBCardText className="text-muted mt-2 d-inline">
            {ownerUsername}
          </MDBCardText>
          {successPercentage != null && (
            <MDBCardText className="text-dark-green fs-5 fw-bold d-inline">
              {Math.round(successPercentage) + "%"}
            </MDBCardText>
          )}
        </div>

        <div className="mt-auto d-flex flex-wrap gap-2">
          {tags.slice(0, MAX_VISIBLE_TAGS).map((t) => (
            <Tag
              key={t.id}
              tagName={t.tagName}
              color={t.color}
              textColor={t.textColor}
            />
          ))}
          {tags.length > MAX_VISIBLE_TAGS && (
            <span
              className="tag-pill py-1 px-3 rounded-pill bg-light text-dark-green"
              style={{ maxWidth: "12ch", whiteSpace: "nowrap" }}
              title={tags
                .slice(MAX_VISIBLE_TAGS)
                .map((t) => t.tagName)
                .join(", ")}
            >
              +{tags.length - MAX_VISIBLE_TAGS}
            </span>
          )}
        </div>
      </MDBCardBody>
    </MDBCard>
  );
}
