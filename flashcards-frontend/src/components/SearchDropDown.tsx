import { ReactNode } from "react";

export interface SearchDropdownProps<T> {
  query: string;

  results: T[];

  selected?: T | null;

  onSelect: (item: T) => void;

  getKey: (item: T) => string | number;

  renderItem: (item: T) => ReactNode;

  notFoundText?: string;
}

export default function SearchDropDown<T>({
  query,
  results,
  selected,
  onSelect,
  getKey,
  renderItem,
  notFoundText = "Not found",
}: SearchDropdownProps<T>) {
  if (!query.trim()) return null;
  return (
    <ul
      className="list-group position-absolute w-100"
      style={{
        top: "100%",
        zIndex: 10,
        maxHeight: 200,
        overflowY: "auto",
      }}
    >
      {results.length > 0 || selected ? (
        results.map((item) => (
          <li
            key={getKey(item)}
            className={
              "list-group-item list-group-item-action " +
              (selected && getKey(selected) === getKey(item) ? "active" : "")
            }
            onClick={() => onSelect(item)}
            style={{ cursor: "pointer" }}
          >
            {renderItem(item)}
          </li>
        ))
      ) : (
        <li
          className="list-group-item text-muted"
          style={{ cursor: "default" }}
        >
          {notFoundText}
        </li>
      )}
    </ul>
  );
}
