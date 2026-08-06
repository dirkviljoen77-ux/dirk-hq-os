import AppShell from "@/components/layout/AppShell";
import InboxWorkspace from "@/components/inbox/InboxWorkspace";
import { getInboxItems } from "@/lib/actions/inbox.actions";
import { getProjects } from "@/lib/actions/project.actions";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const [items, projects] = await Promise.all([getInboxItems(), getProjects()]);
  return <AppShell title="Inbox"><InboxWorkspace items={items} projects={projects} /></AppShell>;
}
