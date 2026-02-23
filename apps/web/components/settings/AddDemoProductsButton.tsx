'use client';

import { useMutation } from 'convex/react';
import { Database, Loader2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { api } from 'backend/convex/_generated/api';

export function AddDemoProductsButton() {
  const [isLoading, setIsLoading] = React.useState(false);
  const addDemoProducts = useMutation(api.populate.addDemoProducts);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const result = await addDemoProducts({});
      if (result.success) {
        toast.success(`Successfully added ${result.count} demo products!`, {
          description: 'Your store now has sample products for testing.',
        });
      }
    } catch (error: any) {
      console.error('Error adding demo products:', error);
      toast.error('Failed to add demo products', {
        description: error.message || 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 transition-all duration-300 hover:rounded-xl hover:bg-gray-100 hover:p-3">
      <Database className="text-gray-800" size={30} />
      <div className="z-10 flex flex-1 flex-col text-sm">
        <span className="font-medium text-base">Add Demo Products</span>
        <span className="text-muted-foreground text-sm leading-tight">
          Populate your store with 14 sample products
        </span>
      </div>
      <Button
        className="ml-auto"
        disabled={isLoading}
        onClick={handleClick}
        size="sm"
        variant="outline"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          'Add'
        )}
      </Button>
    </div>
  );
}
