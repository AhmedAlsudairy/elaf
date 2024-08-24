import { Button } from "@/components/ui/button";

export const ResendConfirmationCard: React.FC<{
    email: string;
    onResend: () => Promise<void>;
    isLoading: boolean;
  }> = ({ email, onResend, isLoading }) => (
    <div className="mt-4 p-4 border rounded-md shadow-sm">
      <p className="mb-2">Email already exists. Do you want to resend the confirmation email to {email}?</p>
      <Button onClick={onResend} disabled={isLoading}>
        {isLoading ? 'Resending...' : 'Resend Confirmation Email'}
      </Button>
    </div>
  );