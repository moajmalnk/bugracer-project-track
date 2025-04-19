
import { useEffect, useRef } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Bug } from '@/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';

interface BugStatsProps {
  bugs: Bug[];
}

export function BugStats({ bugs }: BugStatsProps) {
  const isMobile = useIsMobile();
  
  // Process data for the chart
  const data = [
    {
      name: 'High',
      Fixed: bugs.filter(bug => bug.priority === 'high' && bug.status === 'fixed').length,
      Pending: bugs.filter(bug => bug.priority === 'high' && bug.status === 'pending').length,
      Declined: bugs.filter(bug => bug.priority === 'high' && (bug.status === 'declined' || bug.status === 'rejected')).length,
    },
    {
      name: 'Medium',
      Fixed: bugs.filter(bug => bug.priority === 'medium' && bug.status === 'fixed').length,
      Pending: bugs.filter(bug => bug.priority === 'medium' && bug.status === 'pending').length,
      Declined: bugs.filter(bug => bug.priority === 'medium' && (bug.status === 'declined' || bug.status === 'rejected')).length,
    },
    {
      name: 'Low',
      Fixed: bugs.filter(bug => bug.priority === 'low' && bug.status === 'fixed').length,
      Pending: bugs.filter(bug => bug.priority === 'low' && bug.status === 'pending').length,
      Declined: bugs.filter(bug => bug.priority === 'low' && (bug.status === 'declined' || bug.status === 'rejected')).length,
    },
  ];

  return (
    <ChartContainer 
      config={{
        Fixed: { color: "#10b981" },
        Pending: { color: "#f59e0b" },
        Declined: { color: "#ef4444" },
      }} 
      className="aspect-auto h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data}
          layout={isMobile ? "vertical" : "horizontal"}
          margin={{ top: 10, right: 10, left: isMobile ? 40 : 10, bottom: 20 }}
        >
          {!isMobile && (
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
          )}
          {isMobile ? (
            <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
          ) : (
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
          )}
          {isMobile && (
            <YAxis type="category" dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
          )}
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="Fixed" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Declined" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
