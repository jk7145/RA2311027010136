import { NextResponse } from "next/server";
import { Log } from "@campus/logging-middleware";

export const runtime = "nodejs";

// Mock notification data for local development
const mockNotifications = [
  {
    ID: "1",
    Type: "Placement",
    Message: "Google Campus Placement Drive: Google is conducting on-campus interviews for Software Engineer roles on Dec 15th. Register by Dec 10th.",
    Timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    ID: "2",
    Type: "Result",
    Message: "Semester Results Published: Fall 2024 semester results are now available on the student portal. Check your grades.",
    Timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    ID: "3",
    Type: "Event",
    Message: "Tech Fest 2024: Annual technical festival starts next week. Participate in hackathons, coding competitions, and workshops.",
    Timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    ID: "4",
    Type: "Placement",
    Message: "Microsoft Internship Opportunities: Microsoft is hiring summer interns. Apply before the deadline with your updated resume.",
    Timestamp: new Date(Date.now() - 86400000 * 0.5).toISOString(),
  },
  {
    ID: "5",
    Type: "Result",
    Message: "Mid-term Exam Schedule: Mid-term examination schedule has been released. Check the academic calendar for details.",
    Timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    ID: "6",
    Type: "Event",
    Message: "Career Fair 2024: Annual career fair with 50+ companies. Bring your resume and dress professionally.",
    Timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    ID: "7",
    Type: "Placement",
    Message: "Amazon SDE Recruitment: Amazon is hiring Software Development Engineers. Eligibility: CGPA 7.5+",
    Timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
  },
  {
    ID: "8",
    Type: "Result",
    Message: "Project Submission Deadline: Final project submissions are due by end of week. Submit via the online portal.",
    Timestamp: new Date(Date.now() - 86400000 * 0.2).toISOString(),
  },
  {
    ID: "9",
    Type: "Event",
    Message: "Guest Lecture: AI/ML: Join us for a guest lecture on Advances in AI/ML by Dr. Smith from MIT.",
    Timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    ID: "10",
    Type: "Placement",
    Message: "Deloitte Consulting Drive: Deloitte is recruiting for Business Technology Analyst positions. Apply now!",
    Timestamp: new Date(Date.now() - 86400000 * 0.8).toISOString(),
  },
  {
    ID: "11",
    Type: "Event",
    Message: "Winter Break Schedule: Winter break starts from Dec 20th. Campus will remain closed until Jan 2nd.",
    Timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    ID: "12",
    Type: "Result",
    Message: "Re-evaluation Results: Re-evaluation results for last semester are now published.",
    Timestamp: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];


export async function GET(req: Request): Promise<NextResponse> {
  const incoming = new URL(req.url);
  const limit = parseInt(incoming.searchParams.get("limit") ?? "10");
  const page = parseInt(incoming.searchParams.get("page") ?? "1");
  const notificationType = incoming.searchParams.get("notification_type") ?? "";

  await Log(
    "frontend",
    "info",
    "api",
    `Mock notifications request limit=${limit} page=${page} type=${notificationType || "all"}`
  );

  let filtered = [...mockNotifications];
  
  if (notificationType) {
    filtered = filtered.filter(n => n.Type === notificationType);
  }

  // Sort by newest first
  filtered.sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());


  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    notifications: paginated,
    total: filtered.length,
    page,
    limit,
  });
}
