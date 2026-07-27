import { Project } from "../types";

type Props = {
  project: Project;
};

export default function ProjectHeader({ project }: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
      }}
    >
      <div>
        <h1
          style={{
            color: "white",
            margin: 0,
            fontSize: 34,
          }}
        >
          {project.name}
        </h1>

        <div
          style={{
            color: "#CBD5E1",
            marginTop: 8,
            fontSize: 18,
          }}
        >
          {project.status}
        </div>
      </div>

      <div
        style={{
          textAlign: "right",
          color: "#94A3B8",
          lineHeight: 1.8,
        }}
      >
        <div>
          <strong>Owner:</strong> {project.owner}
        </div>

        <div>
          <strong>Progress:</strong> {project.progress}%
        </div>

        <div>
          <strong>Due:</strong> {project.due}
        </div>
      </div>
    </div>
  );
}