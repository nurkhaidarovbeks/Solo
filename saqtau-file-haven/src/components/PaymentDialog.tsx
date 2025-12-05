import { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard } from 'lucide-react';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => Promise<void>; // Callback after "successful" payment
  planName: string;
  planPrice: string; // e.g., "$9.00"
}

const PaymentDialog = ({ isOpen, onClose, onPaymentSuccess, planName, planPrice }: PaymentDialogProps) => {
  const [fullName, setFullName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePaymentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    // Basic validation (in a real app, this would be much more robust)
    if (!fullName || !cardNumber || !expiryDate || !cvc) {
      setError("Please fill in all card details.");
      return;
    }
    // Simulate card number format for demo
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        setError("Card number must be 16 digits.");
        return;
    }
    // Simulate expiry format MM/YY
     if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        setError("Expiry date must be in MM/YY format.");
        return;
    }
    // Simulate CVC
    if (!/^\d{3,4}$/.test(cvc)) {
        setError("CVC must be 3 or 4 digits.");
        return;
    }

    setIsProcessing(true);
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, here you would integrate with a payment gateway.
    // For this simulation, we'll assume payment is always successful.
    
    await onPaymentSuccess(); // Call the passed success handler (which will call the upgrade API)
    setIsProcessing(false);
    onClose(); // Close dialog on success
  };
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || '';
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setExpiryDate(value);
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Upgrade to {planName}</DialogTitle>
          <DialogDescription>
            Complete your payment to unlock premium features. You will be charged {planPrice}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePaymentSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                placeholder="John Doe" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input 
                  id="cardNumber" 
                  placeholder="0000 0000 0000 0000" 
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  required 
                />
                <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input 
                  id="expiryDate" 
                  placeholder="MM/YY" 
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  maxLength={5}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input 
                  id="cvc" 
                  placeholder="123" 
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0,4))}
                  maxLength={4}
                  required 
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700">
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isProcessing ? 'Processing...' : `Pay ${planPrice}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
