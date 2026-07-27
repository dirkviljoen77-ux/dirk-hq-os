"use client";

import { useProject } from "../store/ProjectContext";

type Props = {
  projectName: string;
  owner: string;
  progress: number;
  status: string;
};

export default function ExecutiveDashboard({
  projectName,
  owner,
  progress,
  status,
}: Props) {
  const { project } = useProject();

  const completed = project.tasks.filter(
    (t) => t.completed
  ).length;

  const open = project.tasks.length - completed;

  const nextMeeting = project.meetings[0];

  return (
    <>
      <h2 style={{ marginTop: 0 }}>
        Executive Command Centre
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 24,
        }}
      >
        <div>

          <DashboardCard title="Project Health">

            <h1 style={{ margin: 0 }}>
              {progress}%
            </h1>

            <p>{status}</p>

            <p>
              Open Tasks: {open}
            </p>

            <p>
              Completed Tasks: {completed}
            </p>

          </DashboardCard>

          <DashboardCard title="Executive Priorities">

            {open === 0 ? (
              <p>No outstanding tasks.</p>
            ) : (
              project.tasks
                .filter((t) => !t.completed)
                .slice(0,5)
                .map((t) => (
                  <div
                    key={t.id}
                    style={{
                      padding: "6px 0",
                    }}
                  >
                    □ {t.title}
                  </div>
                ))
            )}

          </DashboardCard>

        </div>

        <div>

          <DashboardCard title="Next Meeting">

            {nextMeeting ? (
              <>
                <strong>
                  {nextMeeting.title}
                </strong>

                <p>{nextMeeting.date}</p>

                <p>
                  {nextMeeting.attendees}
                </p>
              </>
            ) : (
              <p>No meetings scheduled.</p>
            )}

          </DashboardCard>

          <DashboardCard title="Recent Activity">

            {project.timeline
              .slice(0,5)
              .map((event)=>(
                <div
                  key={event.id}
                  style={{
                    paddingBottom:10,
                  }}
                >
                  {event.description}
                </div>
              ))}

          </DashboardCard>

        </div>

      </div>
    </>
  );
}

function DashboardCard({
  title,
  children,
}:{
  title:string;
  children:React.ReactNode;
}){

  return(

    <div
      style={{
        background:"#0F172A",
        border:"1px solid #334155",
        borderRadius:12,
        padding:20,
        marginBottom:20,
      }}
    >

      <h3>{title}</h3>

      {children}

    </div>

  )

}