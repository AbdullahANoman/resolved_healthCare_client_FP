// redux/api/doctorApi.ts
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { IMeta } from "@/types/common";

export const patientApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get all doctors with optional specialties filter
    getAllPatients: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: "/patient",
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: any, meta: IMeta) => {
        // Handle different response structures
        if (response?.data && response?.meta) {
          return {
            patients: response.data,
            meta: response.meta,
          };
        } else if (Array.isArray(response)) {
          return {
            patients: response,
            meta,
          };
        } else if (response?.data) {
          return {
            patients: response.data,
            meta: response.meta || meta,
          };
        } else {
          // Fallback: assume response is the data array
          return {
            patients: response,
            meta,
          };
        }
      },
      providesTags: [tagTypes.patient],
    }),

    // Get single doctor by ID
    getSinglePatient: build.query({
      query: (id: string) => ({
        url: `/patient/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.patient],
    }),

    // Update doctor
    // updateDoctor: build.mutation({
    //   query: (data) => ({
    //     url: `/doctor/${data.id}`,
    //     method: "PATCH",
    //     data: data.body,
    //   }),
    //   invalidatesTags: [tagTypes.doctor],
    // }),

    // Delete doctor
    softDeletePatient: build.mutation({
      query: (id) => ({
        url: `/patient/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.patient],
    }),
  }),
});

export const {
  useGetAllPatientsQuery,
  useGetSinglePatientQuery,
  useSoftDeletePatientMutation,
} = patientApi;
