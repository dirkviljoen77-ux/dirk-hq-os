import { notFound } from "next/navigation";

import AppShell from "../../../components/layout/AppShell";
import MeetingForm from "../../../components/meetings/MeetingForm";

import { getMeeting } from "@/lib/actions/meeting.actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MeetingPage({
  params,
}: Props) {
  const { id } = await params;

  const meeting = await getMeeting(id);

  if (!meeting) {
    notFound();
  }

  return (
    <AppShell>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "24px 0",
        }}
      >
        <MeetingForm
          meeting={{
            id: meeting.id,
            title: meeting.title,
            description: meeting.description,
            location: meeting.location,
            meetingDate: meeting.meetingDate,
            status: meeting.status,
          }}
        />
      </div>
    </AppShell>
  );
}