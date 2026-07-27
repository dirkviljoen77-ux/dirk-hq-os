"use client";

type Props = {
  activeTab: string;
  onChange: (tab: string) => void;
};

const tabs = [
  "Overview",
  "Tasks",
  "Meetings",
  "People",
  "Documents",
  "Journal",
  "Decisions",
  "Risks",
  "Milestones",
  "Calendar",
  "Timeline",
  "Finance",
  "Reports",
  "AI",
];

export default function WorkspaceTabs({
  activeTab,
  onChange,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        marginBottom: 24,
        flexWrap: "wrap",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            background:
              activeTab === tab
                ? "#2563EB"
                : "#1E293B",
            color: "white",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}