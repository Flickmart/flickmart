import { toast } from 'sonner';
import type { Doc, Id } from '@/convex/_generated/dataModel';

interface ChatParams {
  user: Doc<'users'> | null;
  userId: Id<'users'>;
  onNavigate: (path: string) => void;
  productId?: Id<'product'>;
}
interface ShareParams {
  title: string;
  description: string;
  productId?: Id<'product'>;
  url?: string;
}

export const initialChat = async ({
  user,
  userId,
  onNavigate,
  productId,
}: ChatParams) => {
  if (!user) {
    toast.error('Please login to chat with vendor');
    return;
  }
  console.log('chat vendor clicked');

  // Navigate to chat page with vendor ID as query parameter
  onNavigate(`/chat?vendorId=${userId}&productId=${productId}`);

  toast.success('Starting chat with vendor');
};

export async function shareProduct({
  title,
  description,
  productId,
  url,
}: ShareParams) {
  const shareData = {
    title: title || 'Check out this product',
    text:
      description?.substring(0, 200) + '...\n' ||
      'Check out this product on Flickmart',
    url: url || `https://flickmart.app/product/${productId}`,
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
    }
  } catch (err) {
    console.log(err);
  }
}
