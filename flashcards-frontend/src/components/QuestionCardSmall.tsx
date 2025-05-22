import { MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import FitText from "./FitText";

interface Props {
  text: string;
}

export default function QuestionCard({ text }: Props) {
  return (
    <MDBCard
      className="rounded-8 shadow-md notebook-background "
      style={{ height: 150 }}
    >
      <MDBCardBody className="d-flex align-items-center justify-content-center p-3 card-body-truncate">
        <FitText text={text} min={12} max={18} />
      </MDBCardBody>
    </MDBCard>
  );
}
