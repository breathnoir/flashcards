import { useState } from "react";
import { MDBBtn, MDBTypography } from "mdb-react-ui-kit";
import { useToast } from "./Toast";
import userApi from "../apis/userApi";
import { useUser } from "../context/UserContext";

interface ProfileRowProps {
  label: string;
  value: string;
  name: string;
}

export function ProfileRow({ label, value, name }: ProfileRowProps) {
  const { user, setUser } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const path =
        label === "Email"
          ? "/users/changeEmail"
          : label === "Username"
          ? "/users/changeUsername"
          : "/users/changePassword";

      const res = await userApi.patch(path, draft, {
        headers: { "Content-Type": "text/plain" },
        transformRequest: [(data) => data],
      });
      setUser(res.data.user);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.token !== null) {
        localStorage.setItem("token", res.data.token);
      }
      setIsEditing(false);
      toast.success("Changes saved successfully");
    } catch (e: any) {
      console.error(e);
      const msg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        e.message ||
        "Failed to save changes";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-end mb-4 w-75">
        <div style={{ flexGrow: 1 }}>
          <MDBTypography
            tag="label"
            className="fw-semibold mb-1 fs-5 text-dark-green"
          >
            {label}
          </MDBTypography>
          <input
            type={name === "password" ? "password" : "text"}
            className="form-control border-0 border-bottom px-0 profile-input ps-2 fs-5 text-dark-green"
            value={draft}
            disabled={!isEditing}
            onChange={(e) => setDraft(e.currentTarget.value)}
          />
        </div>

        {isEditing ? (
          <MDBBtn
            //   color="success"
            disabled={saving}
            onClick={handleSave}
            className="ms-2 profile-edit-btn"
          >
            {saving ? "Saving…" : "Save"}
          </MDBBtn>
        ) : (
          <MDBBtn
            onClick={() => setIsEditing(true)}
            className="ms-2 profile-edit-btn profile-edit-btn-edit"
          >
            Edit
          </MDBBtn>
        )}
      </div>
      <div>
        {error && (
          <div className="text-danger mt-2" role="alert">
            {error}
          </div>
        )}
      </div>
    </>
  );
}
