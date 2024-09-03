import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import StarRating from './star-rating';


interface TenderCompletionButtonProps {
  companyProfileId: string;
  tenderId: string;
  onComplete: (rating: {
    companyProfileId: string;
    tenderId: string;
    quality: number;
    communication: number;
    experience: number;
    deadline: number;
    comment: string;
    isAnonymous: boolean;
  }) => Promise<void>;
}

const TenderCompletionButton: React.FC<TenderCompletionButtonProps> = ({ 
  companyProfileId, 
  tenderId, 
  onComplete 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState({
    quality: 0,
    communication: 0,
    experience: 0,
    deadline: 0,
  });
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRatingChange = (category: keyof typeof rating) => (value: number) => {
    setRating(prev => ({ ...prev, [category]: value }));
    setError(null);
  };

  const isValid = useMemo(() => {
    return Object.values(rating).some(value => value > 0);
  }, [rating]);

  const handleSubmit = async () => {
    if (!isValid) {
      setError("Please provide at least one rating.");
      return;
    }

    try {
      await onComplete({ 
        companyProfileId, 
        tenderId, 
        ...rating, 
        comment, 
        isAnonymous 
      });
      setIsOpen(false);
      toast({
        title: "Rating Submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Mark as Done</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Rate the Tender bid</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {Object.entries(rating).map(([key, value]) => (
            <div key={key} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={key} className="text-right capitalize">
                {key}
              </Label>
              <div className="col-span-3">
                <StarRating
                  rating={value}
                  onRatingChange={handleRatingChange(key as keyof typeof rating)}
                />
              </div>
            </div>
          ))}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="comment" className="text-right">
              Comment
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous-mode"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <Label htmlFor="anonymous-mode">Submit anonymously</Label>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <Button onClick={handleSubmit} disabled={!isValid}>Submit Rating</Button>
      </DialogContent>
    </Dialog>
  );
};

export default TenderCompletionButton;