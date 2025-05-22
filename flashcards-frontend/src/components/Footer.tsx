import { MDBFooter } from "mdb-react-ui-kit";

export default function Footer() {
  return (
    <MDBFooter bgColor="light" className="text-center text-lg-left">
      <div className="text-center p-3" style={{ backgroundColor: "white" }}>
        Nadezhda Zakopailo
        <span className="text-dark ps-5 fw-semibold"> ČVUT FEL 2025 </span>
        <a className="text-dark text-underline ps-5" href="https://">
          GitHub
        </a>
      </div>
    </MDBFooter>
  );
}
