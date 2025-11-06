import { CheckCircle, Clock, Slash, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type TransactionStatusBadgeProps = {
  status: string;
};

export function TransactionStatusBadge({
  status,
}: TransactionStatusBadgeProps) {
  switch (status) {
    case 'pending':
      return (
        <Badge
          className="bg-blue-50 text-blue-700 text-xs hover:bg-blue-50"
          variant="secondary"
        >
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    case 'success':
      return (
        <Badge
          className="bg-blue-50 text-green-700 text-xs hover:bg-blue-50"
          variant="secondary"
        >
          <CheckCircle className="mr-1 h-3 w-3" />
          Success
        </Badge>
      );
    case 'failed':
      return (
        <Badge
          className="bg-blue-50 text-red-700 text-xs hover:bg-blue-50"
          variant="secondary"
        >
          <XCircle className="mr-1 h-3 w-3" />
          Failed
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge
          className="bg-blue-50 text-xs text-yellow-700 hover:bg-blue-50"
          variant="secondary"
        >
          <Slash className="mr-1 h-3 w-3" />
          Cancelled
        </Badge>
      );
    default:
      return <span>{status}</span>;
  }
}
