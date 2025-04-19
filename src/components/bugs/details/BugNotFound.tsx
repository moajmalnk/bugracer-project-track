
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const BugNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">Bug not found</h1>
      <Button asChild>
        <Link to="/bugs">Back to Bugs</Link>
      </Button>
    </div>
  );
};
