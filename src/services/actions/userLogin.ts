// "use server";

import { FieldValues } from 'react-hook-form';
// Removed server-side redirect; handle redirect in client login page

export const userLogin = async (data: FieldValues) => {
   const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`,
      {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
         credentials: 'include',
      }
   );
   const userInfo = await res.json();
   return userInfo;
};
