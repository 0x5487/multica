import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  /**
   * setToken: called client-side after verify-code succeeds.
   * Stores the token in an httpOnly cookie and redirects to /issues.
   */
  setToken: async ({ request, cookies }) => {
    const data = await request.formData();
    const token = data.get("token") as string;
    if (!token) return { error: "No token provided" };

    cookies.set("multica_token", token, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    throw redirect(303, "/issues");
  },
};
