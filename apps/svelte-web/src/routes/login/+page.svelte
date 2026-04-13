<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import * as InputOTP from "$lib/components/ui/input-otp";

  // ─── State ───────────────────────────────────────────────────────────────
  type Step = "email" | "code";

  let step = $state<Step>("email");
  let email = $state("");
  let code = $state("");
  let error = $state("");
  let loading = $state(false);
  let cooldown = $state(0);

  // Cooldown timer
  $effect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => cooldown--, 1000);
    return () => clearTimeout(timer);
  });

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const backendUrl = "";   // same-origin proxy (SvelteKit handles /auth/*)

  async function sendCode(e?: Event) {
    e?.preventDefault();
    if (!email) { error = "Email is required"; return; }
    loading = true;
    error = "";
    try {
      const res = await fetch(`${backendUrl}/auth/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(await res.text());
      step = "code";
      code = "";
      cooldown = 10;
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to send code. Make sure the server is running.";
    } finally {
      loading = false;
    }
  }

  async function verifyCode(value: string) {
    if (value.length !== 6) return;
    loading = true;
    error = "";
    try {
      const res = await fetch(`${backendUrl}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: value }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json() as { token: string };

      // Store token and set cookie via server action
      localStorage.setItem("multica_token", data.token);
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/login?/setToken";
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "token";
      input.value = data.token;
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      error = err instanceof Error ? err.message : "Invalid or expired code";
      code = "";
      loading = false;
    }
  }

  async function resend() {
    if (cooldown > 0) return;
    error = "";
    try {
      const res = await fetch(`${backendUrl}/auth/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(await res.text());
      cooldown = 10;
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to resend code";
    }
  }

  $effect(() => {
    if (code.length === 6) verifyCode(code);
  });
</script>

<div class="flex min-h-svh items-center justify-center">
  {#if step === "email"}
    <!-- ── Step 1: Email ─────────────────────────────────────────── -->
    <Card.Root class="w-full max-w-sm">
      <Card.Header class="text-center">
        <Card.Title class="text-2xl">Sign in to Multica</Card.Title>
        <Card.Description>Enter your email to get a login code</Card.Description>
      </Card.Header>
      <Card.Content>
        <form id="login-form" onsubmit={sendCode} class="space-y-4">
          <div class="space-y-2">
            <label for="login-email" class="text-sm font-medium">Email</label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              bind:value={email}
              autofocus
              required
            />
          </div>
          {#if error}
            <p class="text-sm text-destructive">{error}</p>
          {/if}
        </form>
      </Card.Content>
      <Card.Footer class="flex flex-col gap-3">
        <Button
          type="submit"
          form="login-form"
          class="w-full"
          size="lg"
          disabled={!email || loading}
        >
          {loading ? "Sending code..." : "Continue"}
        </Button>
      </Card.Footer>
    </Card.Root>

  {:else}
    <!-- ── Step 2: OTP Code ──────────────────────────────────────── -->
    <Card.Root class="w-full max-w-sm">
      <Card.Header class="text-center">
        <Card.Title class="text-2xl">Check your email</Card.Title>
        <Card.Description>
          We sent a verification code to
          <span class="font-medium text-foreground">{email}</span>
        </Card.Description>
      </Card.Header>
      <Card.Content class="flex flex-col items-center gap-4">
        <InputOTP.Root
          maxlength={6}
          bind:value={code}
          disabled={loading}
        >
          {#snippet children({ cells })}
            <InputOTP.Group>
              {#each cells as cell}
                <InputOTP.Slot {cell} />
              {/each}
            </InputOTP.Group>
          {/snippet}
        </InputOTP.Root>

        {#if error}
          <p class="text-sm text-destructive">{error}</p>
        {/if}

        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            type="button"
            onclick={resend}
            disabled={cooldown > 0}
            class="text-primary underline-offset-4 hover:underline disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
        </div>
      </Card.Content>
      <Card.Footer>
        <Button
          type="button"
          variant="ghost"
          class="w-full"
          onclick={() => { step = "email"; code = ""; error = ""; }}
        >
          Back
        </Button>
      </Card.Footer>
    </Card.Root>
  {/if}
</div>
