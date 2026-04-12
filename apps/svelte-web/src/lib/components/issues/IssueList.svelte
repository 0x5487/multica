<script lang="ts">
  import * as Table from "$lib/components/ui/table";
  import { Badge } from "$lib/components/ui/badge";

  let { issues = [] } = $props();
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Title</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Priority</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each issues as issue (issue.id)}
      <Table.Row>
        <Table.Cell class="font-medium">{issue.title}</Table.Cell>
        <Table.Cell><Badge variant="outline">{issue.status}</Badge></Table.Cell>
        <Table.Cell>{issue.priority}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
