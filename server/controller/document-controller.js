import document from "../database/schema/documentSchema.js";

export const getDocument = async (id) => {
  if (id === null) return;
  const doc = await document.findById(id);
  if (doc != null) return doc;
  else {
    const res = await document.create({ _id: id, data: "" });
    return res;
  }
};

export const updateDocument = async (id, data) => {
  await document.findByIdAndUpdate(id, { data });
};
