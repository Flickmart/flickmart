"use client";

import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Globe,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

export default function BusinessProfile() {
  const [showAllPositive, setShowAllPositive] = useState(false);
  const [showAllNegative, setShowAllNegative] = useState(false);

  // Mock reviews data - In a real app, this would come from an API
  const reviews = {
    positive: [
      {
        id: 1,
        rating: 5,
        reviewer: "John Smith",
        date: "2024-01-15",
        content:
          "Excellent service and high-quality products. The staff was very helpful and knowledgeable.",
        helpful: 45,
        unhelpful: 2,
      },
      {
        id: 2,
        rating: 5,
        reviewer: "Sarah Johnson",
        date: "2024-01-10",
        content:
          "Best tech store in the area. They have everything you need and prices are competitive.",
        helpful: 38,
        unhelpful: 1,
      },
      {
        id: 3,
        rating: 4,
        reviewer: "Mike Wilson",
        date: "2024-01-05",
        content:
          "Great selection of products and friendly staff. Slightly on the expensive side.",
        helpful: 30,
        unhelpful: 3,
      },
      {
        id: 4,
        rating: 5,
        reviewer: "Emily Brown",
        date: "2023-12-28",
        content:
          "Amazing customer service! They went above and beyond to help me find the right laptop.",
        helpful: 25,
        unhelpful: 0,
      },
      {
        id: 5,
        rating: 4,
        reviewer: "David Lee",
        date: "2023-12-20",
        content:
          "Very professional and helpful staff. Good after-sales service.",
        helpful: 20,
        unhelpful: 1,
      },
      // Additional positive reviews that will be shown when expanded
      {
        id: 6,
        rating: 5,
        reviewer: "Lisa Anderson",
        date: "2023-12-15",
        content:
          "Outstanding experience from start to finish. Will definitely shop here again!",
        helpful: 18,
        unhelpful: 1,
      },
      {
        id: 7,
        rating: 4,
        reviewer: "Robert Taylor",
        date: "2023-12-10",
        content: "Good range of products and competitive prices. Recommended!",
        helpful: 15,
        unhelpful: 2,
      },
    ],
    negative: [
      {
        id: 8,
        rating: 2,
        reviewer: "Tom Harris",
        date: "2024-01-12",
        content:
          "Prices are higher than online retailers. Limited stock for some items.",
        helpful: 12,
        unhelpful: 5,
      },
      {
        id: 9,
        rating: 1,
        reviewer: "Karen White",
        date: "2024-01-08",
        content:
          "Poor customer service. Had to wait for a long time to get assistance.",
        helpful: 10,
        unhelpful: 8,
      },
      {
        id: 10,
        rating: 2,
        reviewer: "James Miller",
        date: "2023-12-25",
        content: "Product arrived damaged and return process was complicated.",
        helpful: 8,
        unhelpful: 4,
      },
      {
        id: 11,
        rating: 2,
        reviewer: "Amy Chen",
        date: "2023-12-18",
        content: "Website showed in-stock but item was unavailable in store.",
        helpful: 6,
        unhelpful: 3,
      },
      {
        id: 12,
        rating: 1,
        reviewer: "Peter Wright",
        date: "2023-12-12",
        content: "Overpriced products and unfriendly staff.",
        helpful: 5,
        unhelpful: 7,
      },
      // Additional negative reviews that will be shown when expanded
      {
        id: 13,
        rating: 2,
        reviewer: "Sophie Turner",
        date: "2023-12-05",
        content:
          "Long waiting times for technical support. Need to improve service.",
        helpful: 4,
        unhelpful: 2,
      },
      {
        id: 14,
        rating: 1,
        reviewer: "Mark Johnson",
        date: "2023-12-01",
        content: "Disappointing experience. Products not as described.",
        helpful: 3,
        unhelpful: 4,
      },
    ],
  };

  // In a real application, you would fetch this data based on the businessname parameter
  const businessInfo = {
    name: "TechGadgets Inc.",
    logo: `/placeholder.svg`,
    description:
      "We specialize in selling high-quality tech gadgets and accessories.",
    established: "2015",
    website: "https://techgadgets.com",
    email: "contact@techgadgets.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, Silicon Valley, CA 94000",
    isVerified: true,
    category: "Electronics & Gadgets",
    operatingHours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed",
    },
    productCategories: ["Smartphones", "Laptops", "Accessories", "Smart Home"],
    averageRating: 4.7,
    totalReviews: 128,
    responseRate: "98%",
    responseTime: "Within 1 hour",
  };

  const displayedPositiveReviews = showAllPositive
    ? reviews.positive
    : reviews.positive.slice(0, 5);
  const displayedNegativeReviews = showAllNegative
    ? reviews.negative
    : reviews.negative.slice(0, 5);

  const ReviewCard = ({
    review,
  }: {
    review: {
      id: number;
      rating: number;
      reviewer: string;
      date: string;
      content: string;
      helpful: number;
      unhelpful: number;
    };
  }) => (
    <Card className="p-4 mb-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-1 mb-2">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${index < review.rating ? "text-yellow-400" : "text-gray-200"}`}
                fill={index < review.rating ? "currentColor" : "none"}
              />
            ))}
          </div>
          <h3 className="font-semibold">{review.reviewer}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(review.date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <p className="mt-2">{review.content}</p>
      <div className="flex items-center space-x-4 mt-3">
        <div className="flex items-center space-x-1">
          <ThumbsUp className="h-4 w-4" />
          <span className="text-sm">{review.helpful}</span>
        </div>
        <div className="flex items-center space-x-1">
          <ThumbsDown className="h-4 w-4" />
          <span className="text-sm">{review.unhelpful}</span>
        </div>
      </div>
    </Card>
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8">
        <Card className="p-6">
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="flex items-start space-x-6">
              <img
                src={businessInfo.logo || "/placeholder.svg"}
                alt="Business Logo"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-3xl font-bold">{businessInfo.name}</h1>
                  {businessInfo.isVerified && (
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mt-1">
                  {businessInfo.category}
                </p>
                <p className="mt-2">{businessInfo.description}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Established {businessInfo.established}
                </p>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={businessInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {businessInfo.website}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${businessInfo.email}`}
                    className="hover:underline"
                  >
                    {businessInfo.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${businessInfo.phone}`}
                    className="hover:underline"
                  >
                    {businessInfo.phone}
                  </a>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <span>{businessInfo.address}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Operating Hours */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Operating Hours</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(businessInfo.operatingHours).map(
                  ([day, hours]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between"
                    >
                      <span className="capitalize">{day}:</span>
                      <span>{hours}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <Separator />

            {/* Product Categories */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Product Categories</h2>
              <div className="flex flex-wrap gap-2">
                {businessInfo.productCategories.map((category, index) => (
                  <span
                    key={index}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <Separator />

            {/* Business Performance */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Business Performance
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-1" />
                    <span className="font-semibold text-lg">
                      {businessInfo.averageRating}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      ({businessInfo.totalReviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Response Rate
                    </p>
                    <p className="font-medium">{businessInfo.responseRate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Response Time
                    </p>
                    <p className="font-medium">{businessInfo.responseTime}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Reviews Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
              <Tabs defaultValue="positive" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="positive">Positive Reviews</TabsTrigger>
                  <TabsTrigger value="negative">Critical Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="positive" className="mt-4">
                  {displayedPositiveReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                  {reviews.positive.length > 5 && (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => setShowAllPositive(!showAllPositive)}
                    >
                      {showAllPositive
                        ? "Show Less"
                        : `Show More (${reviews.positive.length - 5} more)`}
                    </Button>
                  )}
                </TabsContent>
                <TabsContent value="negative" className="mt-4">
                  {displayedNegativeReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                  {reviews.negative.length > 5 && (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => setShowAllNegative(!showAllNegative)}
                    >
                      {showAllNegative
                        ? "Show Less"
                        : `Show More (${reviews.negative.length - 5} more)`}
                    </Button>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
