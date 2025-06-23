import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Slash } from "lucide-react";

interface TransactionStatusBadgeProps {
  status: string;
}

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case "success":
      return (
        <Badge variant="secondary" className="bg-blue-50 text-green-700 hover:bg-blue-50 text-xs">
          <CheckCircle className="h-3 w-3 mr-1" />
          Success
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="secondary" className="bg-blue-50 text-red-700 hover:bg-blue-50 text-xs">
          <XCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="secondary" className="bg-blue-50 text-yellow-700 hover:bg-blue-50 text-xs">
          <Slash className="h-3 w-3 mr-1" />
          Cancelled
        </Badge>
      );
    default:
      return <span>{status}</span>;
  }
}
