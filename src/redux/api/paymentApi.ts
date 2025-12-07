import { baseApi } from './baseApi';
import { tagTypes } from '../tag-types';

export const BASE_STUDENT_SEMESTER_PAYMENT = '/student-semester-payments';

const paymentApi = baseApi.injectEndpoints({
   endpoints: (build) => ({
      initialPayment: build.mutation({
         query: (id: string) => ({
            url: `/payment/init-payment/${id}`,
            method: 'GET',
         }),
         invalidatesTags: [tagTypes.payment],
      }),
   }),
});

export const { useInitialPaymentMutation } = paymentApi;

export default paymentApi;


// payment/init-payment/e52c51ed-50c2-450f-b715-386dc82fcf00