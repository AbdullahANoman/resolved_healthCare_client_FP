import { axiosBaseQuery } from "@/helpers/axios/axiosBaseQuery";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "../tag-types";

// Define a service using a base URL and expected endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: API_BASE_URL as string }),
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});
