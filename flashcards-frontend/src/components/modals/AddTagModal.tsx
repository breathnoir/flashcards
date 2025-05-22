import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBBtn,
  MDBInputGroup,
  MDBIcon,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { TagDTO } from "../../types";
import { useState, useRef, useEffect } from "react";
import cardsApi from "../../apis/cardsApi";
import SearchDropDown from "../SearchDropDown";

interface AddTagModalProps {
  open: boolean;
  onClose: () => void;
  onCreateNew: () => void;
  onTagPicked: (tag: TagDTO) => void;
}

export default function AddTagModal({
  open,
  onClose,
  onCreateNew,
  onTagPicked,
}: AddTagModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TagDTO[]>([]);
  const [selected, setSelected] = useState<TagDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<number>();

  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (selected && query === selected.tagName) {
      return;
    }
    if (!query.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await cardsApi.get<TagDTO[]>("/tags/search", {
          params: { name: query.trim() },
        });
        setResults(res.data);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function handleSelect(t: TagDTO) {
    setSelected(t);
    setQuery(t.tagName);
    setResults([]);
  }

  const handleAdd = () => {
    if (selected) {
      onTagPicked(selected);
      setQuery("");
      setResults([]);
      setSelected(null);
      onClose();
    }
  };

  return (
    <MDBModal tabIndex="-1" open={open} onClose={onClose} staticBackdrop>
      <MDBModalDialog centered size="sm">
        <MDBModalContent className="p-3 rounded-8">
          <MDBModalHeader className="border-0 pb-0">
            <MDBModalTitle className="fw-bold fs-4 text-dark-green">
              Add tag
            </MDBModalTitle>
            <MDBBtn className="btn-close" color="none" onClick={onClose} />
          </MDBModalHeader>

          <MDBModalBody>
            <div className="position-relative w-100 mb-4">
              <MDBInputGroup
                onSubmit={(e) => e.preventDefault()}
                textAfter={
                  <MDBBtn
                    color="tertiary"
                    className="d-flex justify-content-center align-items-center p-0"
                    style={{ width: "1rem", height: "2.5rem" }}
                  >
                    {loading ? (
                      <MDBSpinner
                        size="sm"
                        style={{ width: "1rem", height: "1rem" }}
                      />
                    ) : (
                      <MDBIcon fas icon="search" style={{ color: "#3a5b22" }} />
                    )}
                  </MDBBtn>
                }
              >
                <input
                  className="form-control"
                  placeholder="Search tags"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelected(null);
                  }}
                />
              </MDBInputGroup>
              <SearchDropDown<TagDTO>
                query={query}
                results={results}
                selected={selected}
                onSelect={handleSelect}
                getKey={(t) => t.id}
                renderItem={(t) => t.tagName}
                notFoundText="No tags match"
              />
            </div>

            <div className="d-flex align-items-center justify-content-around">
              <MDBBtn disabled={!selected} onClick={handleAdd} size="lg">
                Add
              </MDBBtn>
              <MDBBtn size="lg" onClick={onCreateNew}>
                Create new
              </MDBBtn>
            </div>
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
