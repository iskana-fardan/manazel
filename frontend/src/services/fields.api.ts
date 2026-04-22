import type { FieldFormValues } from "../admin/features/fields/field.schema";
import api from "./apiClient";

// public
export const getFields = async () => {
    const { data } = await api.get("/fields");
    return data;
}


// admin / dashboard
export const createField = (payload:FieldFormValues) => api.post("/fields", payload);