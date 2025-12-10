import { ConvexHttpClient } from 'convex/browser';
import { NextResponse } from 'next/server';
import { requests } from 'recombee-api-client';
import { api } from '@/convex/_generated/api';
import { client as recombeeClient } from '@/utils/recombee';

export const dynamic = 'force-dynamic'; // an Next.js optimization

export async function GET(request: Request) {
  // 1. SECURE THE ROUTE
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      {
        status: 401,
      }
    );
  }

  // 2. RUN THE SYNC LOGIC
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error('Missing NEXT_PUBLIC_CONVEX_URL environment variable.');
  }

  try {
    const convex = new ConvexHttpClient(convexUrl);

    // Fetch all users
    const users = await convex.query(api.users.getAllUsers);

    // Upload users to Recombee
    const userUploadRequests = users.map((user) => {
      return new requests.SetUserValues(
        user._id,
        {
          location: user.contact?.address,
          role: user.role,
          verified: user.verified,
        },
        { cascadeCreate: true }
      );
    });
    await recombeeClient.send(new requests.Batch(userUploadRequests));

    // Fetch all products
    const products = await convex.query(api.product.getAll, {});

    // Upload products to Recombee
    const productUploadRequests = products.map((product) => {
      return new requests.SetItemValues(
        product._id,
        {
          aiEnabled: product.aiEnabled,
          dislikes: product?.dislikes ?? 0,
          image: product.images[0] ?? '',
          likes: product?.likes ?? 0,
          location: product.location,
          description: product.description,
          plan: product.plan,
          subcategory: product.subcategory,
          title: product.title,
          category: product.category,
          timestamp: product.timeStamp,
          price: product.price,
          views: product?.views ?? 0,
        },
        { cascadeCreate: true }
      );
    });
    await recombeeClient.send(new requests.Batch(productUploadRequests));

    return NextResponse.json({
      success: true,
      users: users.length,
      products: products.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
