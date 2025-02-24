import { Mail, MapPin, Star, Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// This would typically come from an API or database
const getUserProfile = (username: string) => ({
  fullName: "Panji Dwi",
  username: "@panjidwi",
  bio: "Passionate about vintage collectibles and tech gadgets. Always on the lookout for unique items!",
  joinDate: "Member since January 2020",
  itemsSold: 152,
  itemsForSale: 23,
  rating: 4.8,
  reviewCount: 98,
  isVerified: true,
  preferredPayments: ["PayPal", "Venmo", "Cash"],
  profilePicture: `/avatar/placeholder.svg`,
  contactInfo: {
    email: "dwipanji@gmail.com",
    facebook: "facebook.com/panjidwi",
    instagram: "instagram.com/panjidwi",
    twitter: "twitter.com/panjidwi",
  },
  address: "Manchester, Kentucky",
  recentListings: [
    { id: 1, title: "Vintage Camera", price: "$120", image: "/placeholder.svg" },
    { id: 2, title: "Mechanical Keyboard", price: "$80", image: "/placeholder.svg" },
    { id: 3, title: "Retro Game Console", price: "$150", image: "/placeholder.svg" },
  ],
})

type PageProps = {
  params: { username: string }
}

export default function PublicProfile({ params }: PageProps) {
  const profile = getUserProfile(params.username)

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <Card className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.profilePicture} alt="Profile picture" />
                <AvatarFallback>
                  {profile.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold">{profile.fullName}</h1>
                  {profile.isVerified && <Badge variant="secondary">Verified</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{profile.username}</p>
                <div className="mt-2 flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{profile.rating}</span>
                  <span className="ml-1 text-sm text-muted-foreground">({profile.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button>Message</Button>
              <p className="text-sm text-muted-foreground">{profile.joinDate}</p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="font-medium">{profile.itemsSold}</span> items sold
            </div>
            <div>
              <span className="font-medium">{profile.itemsForSale}</span> items for sale
            </div>
            <div>Preferred payments: {profile.preferredPayments.join(", ")}</div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* About Me */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold">About Me</h2>
              <Separator className="my-4" />
              <p>{profile.bio}</p>
            </Card>

            {/* Recent Listings */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Listings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {profile.recentListings.map((listing) => (
                  <div key={listing.id} className="border rounded-lg overflow-hidden">
                    <img
                      src={listing.image || "/placeholder.svg"}
                      alt={listing.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                      <h3 className="font-medium">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground">{listing.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Contact Information</h2>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.contactInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={profile.contactInfo.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {profile.contactInfo.facebook}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={profile.contactInfo.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {profile.contactInfo.instagram}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={profile.contactInfo.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {profile.contactInfo.twitter}
                  </a>
                </div>
              </div>
            </Card>

            {/* Location */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Location</h2>
              <Separator className="my-4" />
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <p>{profile.address}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

