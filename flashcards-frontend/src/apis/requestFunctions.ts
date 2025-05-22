import cardsApi from "./cardsApi";

export const uploadImage = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return cardsApi.post<{ id: number }>("/images", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
