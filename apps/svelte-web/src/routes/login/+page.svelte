<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
</script>

<div class="flex h-screen items-center justify-center bg-background">
  <Card.Root class="w-full max-w-sm">
    <Card.Header>
      <Card.Title class="text-2xl">Multica Login</Card.Title>
      <Card.Description>Enter your email below to login to your account.</Card.Description>
    </Card.Header>
    <Card.Content>
      <form method="POST" class="grid gap-4">
        <div class="grid gap-2">
          <Input name="email" type="email" placeholder="m@example.com" required />
        </div>
        <div class="grid gap-2">
          <Input name="password" type="password" required />
        </div>
        <Button type="submit" class="w-full">Sign in</Button>
      </form>
    </Card.Content>
  </Card.Root>
</div>
