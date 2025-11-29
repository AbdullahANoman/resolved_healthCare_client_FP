import { authKey } from "@/contants/authkey";
import { deleteCookies } from "./deleteCookies";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const logoutUser = (router: AppRouterInstance) => {
  localStorage.removeItem(authKey);
  deleteCookies([authKey, "refreshToken", "accessToken"]);
  router.push("/");
  setTimeout(() => {
    window.location.reload();
  }, 100);
};
