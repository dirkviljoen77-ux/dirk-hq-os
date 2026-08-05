import ActivityTimeline from "./ActivityTimeline";

type Props = {
  projectId: string;
  projectName: string;
  owner: string;
  progress: number;
  status: string;
};

export default function ExecutiveDashboard({
  projectId,
  projectName,
  owner,
  progress,
  status,
}: Props) {
  return (
    <>
      <h2 style={{ marginTop: 0 }}>
        Project overview
      </h2>

      <p>
        <strong>Project:</strong> {projectName}
      </p>

      <p>
        <strong>Owner:</strong> {owner}
      </p>

      <p>
        <strong>Status:</strong> {status}
      </p>

      <p>
        <strong>Progress:</strong> {progress}%
      </p>

      <hr style={{ margin: "24px 0" }} />
      <ActivityTimeline projectId={projectId} />
    </>
  );
}
