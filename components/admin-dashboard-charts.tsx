"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const applicantData = [
  { month: "Jan", count: 45 },
  { month: "Feb", count: 52 },
  { month: "Mar", count: 48 },
  { month: "Apr", count: 61 },
  { month: "May", count: 55 },
  { month: "Jun", count: 67 },
  { month: "Jul", count: 78 },
  { month: "Aug", count: 87 },
  { month: "Sep", count: 93 },
  { month: "Oct", count: 85 },
  { month: "Nov", count: 102 },
  { month: "Dec", count: 98 },
]

const jobCategoryData = [
  { name: "IT & Software", value: 35 },
  { name: "Administrative", value: 25 },
  { name: "Customer Service", value: 18 },
  { name: "Marketing", value: 15 },
  { name: "Others", value: 7 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

const matchingData = [
  { name: "Education", matched: 68, unmatched: 32 },
  { name: "Experience", matched: 72, unmatched: 28 },
  { name: "Eligibility", matched: 58, unmatched: 42 },
  { name: "Skills", matched: 76, unmatched: 24 },
]

export function AdminDashboardCharts() {
  return (
    <Tabs defaultValue="applicants" className="space-y-4">
      <TabsList>
        <TabsTrigger value="applicants">Applicants</TabsTrigger>
        <TabsTrigger value="jobs">Job Categories</TabsTrigger>
        <TabsTrigger value="matching">Matching Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="applicants" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Applicant Trends</CardTitle>
            <CardDescription>Monthly applicant registration over the past year</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                count: {
                  label: "Applicants",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={applicantData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-count)"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="jobs" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Job Categories Distribution</CardTitle>
            <CardDescription>Distribution of job postings by category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={jobCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {jobCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="matching" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Matching Analytics</CardTitle>
            <CardDescription>Applicant matching statistics by criteria</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                matched: {
                  label: "Matched",
                  color: "hsl(var(--chart-1))",
                },
                unmatched: {
                  label: "Unmatched",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={matchingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="matched" stackId="a" fill="var(--color-matched)" />
                  <Bar dataKey="unmatched" stackId="a" fill="var(--color-unmatched)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
