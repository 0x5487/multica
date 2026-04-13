import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

/**
 * Supports both GET (direct navigation) and POST (form action) logout.
 */
export const load: PageServerLoad = async ({ cookies }) => {
  cookies.delete("multica_token", { path: "/" });
  throw redirect(303, "/login");
};

export const actions: Actions = {
  default: async ({ cookies }) => {
    cookies.delete("multica_token", { path: "/" });
    throw redirect(303, "/login");
  },
};
