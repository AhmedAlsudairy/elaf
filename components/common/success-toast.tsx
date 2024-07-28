"use client"
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle } from "lucide-react";

export const useReusableToast = () => {
  const { toast } = useToast();

  const showToast = (variant = 'success', message = 'Operation completed') => {
    const icon = variant === 'success' 
      ? <CheckCircle2 className="w-4 h-4 text-green-500" /> 
      : <XCircle className="w-4 h-4 text-red-500" />;
    
    toast({
      description: (
        <div className="flex items-center gap-2">
          {icon}
          <span>{message}</span>
        </div>
      ),
    });
  };

  return showToast;
};