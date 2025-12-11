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
      transformResponse: (response: any) => {
        return {
          ...response,
          paymentUrl: response?.data?.paymentUrl || response?.paymentUrl,
          paymentId: response?.data?.paymentId || response?.paymentId,
        };
      },
    }),
    validPayment: build.mutation({
      query: (arg: Record<string, any>) => ({
        url: `/payment/pnr`,
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: any) => {
        return {
          response,
        };
      },
    }),
    getPaymentStatus: build.query({
      query: (paymentId: string) => ({
        url: `/payment/status/${paymentId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.payment],
    }),
    getAllPayments: build.query({
      query: (params?: any) => ({
        url: "/ssl/all-payments",
        method: "GET",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          ...params,
        },
      }),
      providesTags: [tagTypes.payment],
    }),
    getPaymentHistory: build.query({
      query: (userId: string) => ({
        url: `/payment/history/${userId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.payment],
    }),
    cancelPayment: build.mutation({
      query: (paymentId: string) => ({
        url: `/payment/cancel/${paymentId}`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.payment],
    }),
  }),
});

export const {
  useInitialPaymentMutation,
  useValidPaymentMutation,
  useGetPaymentStatusQuery,
  useGetAllPaymentsQuery,
  useGetPaymentHistoryQuery,
  useCancelPaymentMutation,
} = paymentApi;

export default paymentApi;
