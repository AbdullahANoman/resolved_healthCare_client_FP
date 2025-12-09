import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

export const BASE_STUDENT_SEMESTER_PAYMENT = "/student-semester-payments";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    initialPayment: build.mutation({
      query: (id: string) => ({
        url: `/payment/init-payment/${id}`,
        method: "GET",
      }),
      invalidatesTags: [tagTypes.payment],
    }),
    validPayment: build.mutation({
      query: () => ({
        url: `/payment/pnr`,
        method: "GET",
      }),
      invalidatesTags: [tagTypes.payment],
    }),
    getAllPayments: build.query({
      query: (params) => ({
        url: "/ssl/all-payments",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.payment],
    }),
  }),
});

export const {
  useInitialPaymentMutation,
  useValidPaymentMutation,
  useGetAllPaymentsQuery,
} = paymentApi;

export default paymentApi;
