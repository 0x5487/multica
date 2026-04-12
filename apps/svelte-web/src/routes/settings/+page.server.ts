import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ cookies, request }) => {
    const token = cookies.get("multica_token");
    if (!token) {
      return fail(401, { saved: false, error: "Unauthorized" });
    }

    const data = await request.formData();
    const workspaceId = String(data.get("workspace_id") ?? "");
    const name = String(data.get("name") ?? "").trim();

    if (!workspaceId || !name) {
      return fail(400, { saved: false, error: "Missing workspace data" });
    }

    const backendUrl = process.env.REMOTE_API_URL || "http://localhost:8080";
    const response = await fetch(`${backendUrl}/api/workspaces/${workspaceId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Workspace-ID": workspaceId,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      return fail(response.status, { saved: false, error: "Failed to save workspace" });
    }

    const workspace = await response.json();
    return {
      saved: true,
      workspace,
    };
  },
};
