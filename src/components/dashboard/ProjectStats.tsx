
import { useState, useEffect } from 'react';
import { useBugs } from '@/context/BugContext';
import { Project } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { projectStore } from '@/lib/store';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

export function ProjectStats() {
  const { getBugsByProject } = useBugs();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const initialProjects = await projectStore.getProjects();
        setProjects(initialProjects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);
  
  // Process data for the chart
  const data = projects.map((project, index) => {
    const projectBugs = getBugsByProject(project.id);
    const highPriorityBugs = projectBugs.filter(bug => bug.priority === 'high').length;
    const mediumPriorityBugs = projectBugs.filter(bug => bug.priority === 'medium').length;
    const lowPriorityBugs = projectBugs.filter(bug => bug.priority === 'low').length;
    
    return {
      name: project.name,
      high: highPriorityBugs,
      medium: mediumPriorityBugs,
      low: lowPriorityBugs,
      total: projectBugs.length,
      color: `hsl(${(index * 30) % 360}, 70%, 50%)`,
    };
  });

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No projects found.</p>
      </div>
    );
  }

  return (
    <ChartContainer 
      config={{
        high: { color: "#ef4444" },
        medium: { color: "#f59e0b" },
        low: { color: "#10b981" },
      }} 
      className="aspect-auto h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data}
          layout={isMobile ? "vertical" : "horizontal"}
          margin={{ top: 20, right: 30, left: isMobile ? 100 : 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          {!isMobile && (
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          )}
          {isMobile ? (
            <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          ) : (
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          )}
          {isMobile && (
            <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={90} />
          )}
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="high" name="High Priority" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="medium" name="Medium Priority" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="low" name="Low Priority" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
