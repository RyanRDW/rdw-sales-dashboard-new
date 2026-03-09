"use client"

import * as React from "react"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

interface LineChartProps {
  data: { date: string; calls: number }[]
}

export function LineChart({ data }: LineChartProps) {
  return (
    <RechartsLineChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="calls" stroke="#3b82f6" />
    </RechartsLineChart>
  )
}