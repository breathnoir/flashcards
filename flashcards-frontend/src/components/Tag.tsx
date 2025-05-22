import { TagDTO } from "../types";

type TagProps = Omit<TagDTO, "id">;

export default function Tag({ tagName, color, textColor }: TagProps) {
  const MAX_NAME_LENGTH = 9;
  const display =
    tagName.length > MAX_NAME_LENGTH
      ? tagName.slice(0, MAX_NAME_LENGTH - 1) + "…"
      : tagName;

  return (
    <span
      className="tag-pill py-1 px-3 rounded-pill text-lowercase"
      style={{ backgroundColor: color, color: textColor }}
      title={tagName}
    >
      {display}
    </span>
  );
}
