import { Bug } from '@/types';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, ZoomIn, ZoomOut, X, RotateCw } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BugContentCardsProps {
  bug: Bug;
}

export const BugContentCards = ({ bug }: BugContentCardsProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-sm sm:text-base">{bug.description}</p>
        </CardContent>
      </Card>
      
      {bug.screenshots && bug.screenshots.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Screenshots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {bug.screenshots.map((screenshot, index) => (
                <div 
                  key={index} 
                  className="relative group rounded-md border overflow-hidden aspect-[16/10]"
                >
                  <img 
                    src={screenshot.path} 
                    alt={screenshot.name} 
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 px-3 text-xs"
                      onClick={() => {
                        setSelectedImage(screenshot.path);
                        setScale(1);
                        setRotation(0);
                      }}
                    >
                      View Full Size
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {bug.files?.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Attached Files</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {bug.files.map((file, index) => (
                <li key={index} className="flex items-center gap-2">
                  <a 
                    href={file.path} 
                    className="text-sm sm:text-base text-primary hover:underline" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Image Full View Dialog */}
      <Dialog 
        open={!!selectedImage} 
        onOpenChange={() => {
          setSelectedImage(null);
          setScale(1);
          setRotation(0);
        }}
      >
        <DialogContent 
          className="max-w-[95vw] max-h-[95vh] w-full h-full flex flex-col p-0 gap-0"
        >
          <DialogHeader className="p-3 sm:p-4 flex-shrink-0 border-b">
            <div className="flex items-center justify-between gap-4">
              <DialogTitle className="text-sm sm:text-base">Screenshot Preview</DialogTitle>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8"
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5}
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8"
                  onClick={handleZoomIn}
                  disabled={scale >= 3}
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8"
                  onClick={handleRotate}
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => {
                    setSelectedImage(null);
                    setScale(1);
                    setRotation(0);
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          {selectedImage && (
            <div className="relative flex-1 overflow-auto p-3 sm:p-4">
              <div className="min-h-full flex items-center justify-center">
                <img 
                  src={selectedImage} 
                  alt="Full size screenshot" 
                  className="max-w-full max-h-full object-contain transition-transform duration-200"
                  style={{
                    transform: `scale(${scale}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center'
                  }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
