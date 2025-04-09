
import { useEffect, useRef } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Bug } from '@/types';

interface BugStatsProps {
  bugs: Bug[];
}

export function BugStats({ bugs }: BugStatsProps) {
  // Process data for the chart
  const data = [
    {
      name: 'High',
      Fixed: bugs.filter(bug => bug.priority === 'high' && bug.status === 'fixed').length,
      Pending: bugs.filter(bug => bug.priority === 'high' && bug.status === 'pending').length,
      Declined: bugs.filter(bug => bug.priority === 'high' && bug.status === 'declined').length,
    },
    {
      name: 'Medium',
      Fixed: bugs.filter(bug => bug.priority === 'medium' && bug.status === 'fixed').length,
      Pending: bugs.filter(bug => bug.priority === 'medium' && bug.status === 'pending').length,
      Declined: bugs.filter(bug => bug.priority === 'medium' && bug.status === 'declined').length,
    },
    {
      name: 'Low',
      Fixed: bugs.filter(bug => bug.priority === 'low' && bug.status === 'fixed').length,
      Pending: bugs.filter(bug => bug.priority === 'low' && bug.status === 'pending').length,
      Declined: bugs.filter(bug => bug.priority === 'low' && bug.status === 'declined').length,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <Tooltip />
        <Legend />
        <Bar dataKey="Fixed" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Declined" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
