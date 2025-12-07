import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { DoctorSchedule } from "@/types/doctorSchedules";
import { IMeta } from "@/types";

export const doctorScheduleApi = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    createDoctorSchedule: build.mutation({
      query: (data: any) => ({
        url: "/doctor-schedule",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.doctorSchedule],
    }),
    getAllDoctorSchedules: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: "/doctor-schedule",
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: any) => {
        return {
          doctorSchedules: response.data,
          meta: response.data.meta,
        };
      },
      providesTags: [tagTypes.doctorSchedule],
    }),
    getDoctorSchedule: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `/doctor-schedule/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.doctorSchedule],
    }),
    getMySchedule: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/doctor-schedule/my-schedule",
        method: "GET",
        params: arg,
      }),
      transformResponse: (
        response: {
          data: any;
          meta: any;
        },
      ) => {
        return {
          data: response?.data,
          meta: response.meta,
        };
      },
      providesTags: [tagTypes.doctorSchedule],
    }),

    deleteDoctorSchedule: build.mutation({
      query: (id: string) => ({
        url: `/doctor-schedule/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.doctorSchedule],
    }),
  }),
});

export const {
  useCreateDoctorScheduleMutation,
  useGetAllDoctorSchedulesQuery,
  useGetDoctorScheduleQuery,
  useGetMyScheduleQuery,
  useDeleteDoctorScheduleMutation,
} = doctorScheduleApi;
