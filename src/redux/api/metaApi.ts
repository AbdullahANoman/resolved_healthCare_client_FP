import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { IMeta } from "@/types/common";

export const metaApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMeta: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: "/meta",
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (
        response: {
          appointmentCount: number;
          patientCount: number;
          doctorCount: number;
          patientCoount: number;
          reviewCount: number;
          formattedAppointmentStatusDistribution:[];
          totalRevenue: {
            _sum: {
              amount: number;
            };
          };
        },
        meta: IMeta
      ) => {
        return {
          response,
        };
      },
      providesTags: [tagTypes.meta],
    }),
  }),
});

export const { useGetMetaQuery } = metaApi;
