"use client"

import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts"

interface FunnelData {
  name: string
  value: number
  color: string
}

interface FunnelChartProps {
  data: FunnelData[]
}

export function FunnelChart({ data }: FunnelChartProps) {
  return (
    <BarChart
      width={600}
      height={400}
      data={data}
      layout="vertical"
      margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#8884d8">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Bar>
    </BarChart>
  )
}