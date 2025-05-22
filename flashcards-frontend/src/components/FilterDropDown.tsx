import {
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useState } from "react";

export type FilterOption = "All" | "Added" | "Created";

interface FilterDropdownProps {
  initial?: FilterOption;
  onChange?: (newFilter: FilterOption) => void;
}

export default function FilterDropdown({
  initial = "All",
  onChange,
}: FilterDropdownProps) {
  const options: FilterOption[] = ["All", "Added", "Created"];
  const [selected, setSelected] = useState<FilterOption>(initial);

  const handleSelect = (opt: FilterOption) => {
    setSelected(opt);
    onChange?.(opt);
  };
  return (
    <>
      <MDBDropdown>
        <MDBDropdownToggle
          size="lg"
          color="tretiary"
          className="px-3 py-2 d-flex align-items-center justify-content-between fs-5 text-capitalize"
          style={{ width: "150px" }}
        >
          <span className="text-dark-green fw-semibold">{selected}</span>
          <MDBIcon fas icon="chevron-down" className="text-dark-green" />
        </MDBDropdownToggle>

        <MDBDropdownMenu className="mt-1">
          {options.map((opt) => (
            <MDBDropdownItem
              key={opt}
              link
              onClick={() => handleSelect(opt)}
              className={opt === selected ? "active" : ""}
            >
              {opt}
            </MDBDropdownItem>
          ))}
        </MDBDropdownMenu>
      </MDBDropdown>
    </>
  );
}
