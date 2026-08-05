import AppShell from "../../components/layout/AppShell";
import DocumentsWorkspace from "../../components/documents/DocumentsWorkspace";
import { getAllDocuments } from "@/lib/actions/document.actions";
import { getProjects } from "@/lib/actions/project.actions";

export default async function Page() {
  const [documents, projects] = await Promise.all([
    getAllDocuments(),
    getProjects(),
  ]);

  return (
    <AppShell title="Documents">
      <DocumentsWorkspace documents={documents} projects={projects} />
    </AppShell>
  );
}
