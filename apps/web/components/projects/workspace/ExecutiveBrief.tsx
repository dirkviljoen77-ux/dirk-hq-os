import { Project } from "../types";

type Props = {
  project: Project;
};

export default function ExecutiveBrief({ project }: Props) {
  return (
    <div
      style={{
        background: "#1E293B",
        border: "1px solid #334155",
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
      }}
    >
      <h2
        style={{
          color: "white",
          marginTop: 0,
        }}
      >
        Executive Brief
      </h2>

      <p
        style={{
          color: "#CBD5E1",
          lineHeight: 1.8,
          marginBottom: 0,
        }}
      >
        {project.executiveBrief}
      </p>
    </div>
  );
}