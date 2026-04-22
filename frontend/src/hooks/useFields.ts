import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createField, getFields } from "../services/fields.api";
import type { Field } from "../admin/features/fields/fields.types";

// public
export const useFields = () => {
    return useQuery<Field[]>({
        queryKey: ["fields"],
        queryFn: getFields,
    })
};


// admin / dashboard
export const useCreateField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createField,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fields"] }); 
        }
    });
};

