"use client";

import { useEffect, useState } from "react";
import { getProjectReport } from "@/lib/actions/report.actions";

type Props = {
  projectId: string;
};

export default function ReportsPanel({
  projectId,
}: Props) {
  const [report, setReport] = useState<any>();

  useEffect(() => {
    async function load() {
      const data =
        await getProjectReport(projectId);

      setReport(data);
    }

    load();
  }, [projectId]);

  if (!report) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2>Project Report</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
    <tbody>
  <tr>
    <td>Tasks</td>
    <td>{report.tasks.length}</td>
  </tr>

  <tr>
    <td>Meetings</td>
    <td>{report.meetings.length}</td>
  </tr>

  <tr>
    <td>Documents</td>
    <td>{report.documents.length}</td>
  </tr>

  <tr>
    <td>Activity</td>
    <td>{report.activity.length}</td>
  </tr>
</tbody>    
      </table>
    </>
  );
}