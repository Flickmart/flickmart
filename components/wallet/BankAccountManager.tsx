import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Building2, CreditCard, Star, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function BankAccountManager() {
  const bankAccounts = useQuery(api.bankAccounts.getUserBankAccounts);
  const setDefaultAccount = useMutation(api.bankAccounts.setDefaultBankAccount);
  const deleteAccount = useMutation(api.bankAccounts.deleteBankAccount);

  const [isDeleting, setIsDeleting] = useState<Id<"bankAccounts"> | null>(null);
  const [isSettingDefault, setIsSettingDefault] =
    useState<Id<"bankAccounts"> | null>(null);
  const handleSetDefault = async (bankAccountId: Id<"bankAccounts">) => {
    try {
      setIsSettingDefault(bankAccountId);
      await setDefaultAccount({ bankAccountId });
      toast.success("Default account updated");
    } catch (error) {
      toast.error("Failed to set default account");
    } finally {
      setIsSettingDefault(null);
    }
  };

  const handleDelete = async (bankAccountId: Id<"bankAccounts">) => {
    try {
      setIsDeleting(bankAccountId);
      await deleteAccount({ bankAccountId });
      toast.success("Bank account deleted");
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(null);
    }
  };

  if (!bankAccounts) {
    return <div>Loading bank accounts...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Saved Bank Accounts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bankAccounts.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No saved bank accounts</p>
            <p className="text-sm text-gray-400">
              Add a bank account during withdrawal to save it for future use
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bankAccounts.map((account) => (
              <div
                key={account._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{account.bankName}</div>
                    <div className="text-sm text-gray-500">
                      {account.accountName} • ****
                      {account.accountNumber.slice(-4)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {account.isDefault && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                      {account.isVerified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!account.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(account._id)}
                      disabled={isSettingDefault === account._id}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Set Default
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(account._id)}
                    disabled={isDeleting === account._id}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
