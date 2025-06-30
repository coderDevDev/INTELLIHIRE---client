import type React from "react"
import { ApplicantSidebar } from "@/components/applicant-sidebar"

export default function ApplicantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <ApplicantSidebar />
      <div className="flex-1">{children}</div>
    </div>
  )
}
