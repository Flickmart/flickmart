import { useMutation, useQuery } from 'convex/react';
import { Building2, CreditCard, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

export default function BankAccountManager() {
  const bankAccounts = useQuery(api.bankAccounts.getUserBankAccounts);
  const setDefaultAccount = useMutation(api.bankAccounts.setDefaultBankAccount);
  const deleteAccount = useMutation(api.bankAccounts.deleteBankAccount);

  const [isDeleting, setIsDeleting] = useState<Id<'bankAccounts'> | null>(null);
  const [isSettingDefault, setIsSettingDefault] =
    useState<Id<'bankAccounts'> | null>(null);
  const handleSetDefault = async (bankAccountId: Id<'bankAccounts'>) => {
    try {
      setIsSettingDefault(bankAccountId);
      await setDefaultAccount({ bankAccountId });
      toast.success('Default account updated');
    } catch (_error) {
      toast.error('Failed to set default account');
    } finally {
      setIsSettingDefault(null);
    }
  };

  const handleDelete = async (bankAccountId: Id<'bankAccounts'>) => {
    try {
      setIsDeleting(bankAccountId);
      await deleteAccount({ bankAccountId });
      toast.success('Bank account deleted');
    } catch (_error) {
      toast.error('Failed to delete account');
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
          <div className="py-8 text-center">
            <CreditCard className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="mb-4 text-gray-500">No saved bank accounts</p>
            <p className="text-gray-400 text-sm">
              Add a bank account during withdrawal to save it for future use
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bankAccounts.map((account) => (
              <div
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                key={account._id}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{account.bankName}</div>
                    <div className="text-gray-500 text-sm">
                      {account.accountName} • ****
                      {account.accountNumber.slice(-4)}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      {account.isDefault && (
                        <span className="rounded-full bg-orange-100 px-2 py-1 text-orange-800 text-xs">
                          Default
                        </span>
                      )}
                      {account.isVerified && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-green-800 text-xs">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!account.isDefault && (
                    <Button
                      disabled={isSettingDefault === account._id}
                      onClick={() => handleSetDefault(account._id)}
                      size="sm"
                      variant="outline"
                    >
                      <Star className="mr-1 h-4 w-4" />
                      Set Default
                    </Button>
                  )}

                  <Button
                    className="text-red-600 hover:text-red-700"
                    disabled={isDeleting === account._id}
                    onClick={() => handleDelete(account._id)}
                    size="sm"
                    variant="outline"
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
