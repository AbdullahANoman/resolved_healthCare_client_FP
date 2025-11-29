// redux/api/doctorApi.ts
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { IMeta } from "@/types/common";

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get all doctors with optional specialties filter
     getAllDoctors: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: "/doctor",
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: any, meta: IMeta) => {
        // Handle different response structures
        if (response?.data && response?.meta) {
          return {
            doctors: response.data,
            meta: response.meta,
          };
        } else if (Array.isArray(response)) {
          return {
            doctors: response,
            meta,
          };
        } else if (response?.data) {
          return {
            doctors: response.data,
            meta: response.meta || meta,
          };
        } else {
          // Fallback: assume response is the data array
          return {
            doctors: response,
            meta,
          };
        }
      },
      providesTags: [tagTypes.doctor],
    }),

    // Get single doctor by ID
    getDoctor: build.query({
      query: (id: string) => ({
        url: `/doctor/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.doctor],
    }),

    // Get doctor specialties
    getDoctorSpecialties: build.query({
      query: () => ({
        url: "/specialties",
        method: "GET",
      }),
      providesTags: [tagTypes.specialties],
    }),

    // Create doctor (admin only)
    createDoctor: build.mutation({
      query: (data) => ({
        url: "/user/create-doctor",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.doctor],
    }),

    // Update doctor
    updateDoctor: build.mutation({
      query: (data) => ({
        url: `/doctor/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.doctor],
    }),

    // Delete doctor
    deleteDoctor: build.mutation({
      query: (id) => ({
        url: `/doctor/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.doctor],
    }),
  }),
});

export const {
  useGetAllDoctorsQuery,
  useGetDoctorQuery,
  useGetDoctorSpecialtiesQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorApi;