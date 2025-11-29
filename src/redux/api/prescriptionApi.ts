// prescriptionApi.ts
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { IMeta } from "@/types/common";

export const prescriptionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createPrescription: build.mutation({
      query: (data) => ({
        url: "/prescription/create-prescription",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.prescription],
    }),
    getAllPrescriptions: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/prescription/my-prescription",
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: any, meta: IMeta) => ({
        prescriptions: response.data || response, // Handle both response structures
        meta,
      }),
      providesTags: [tagTypes.prescription],
    }),
  }),
});

export const {
  useCreatePrescriptionMutation,
  useGetAllPrescriptionsQuery
} = prescriptionApi;