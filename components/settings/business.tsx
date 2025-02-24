"use client"

import { useState, type ChangeEvent } from "react"
import { Mail, MapPin, Phone, Edit2, Check, Globe, Camera, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultipleSelect } from "@/components/ui/multiple-select"
import Link from "next/link"

export default function BusinessSettings() {
  const [isEditMode, setIsEditMode] = useState(false)
  const PRODUCT_CATEGORIES = [
    { key: 'smartphones', name: 'Smartphones' },
    { key: 'laptops', name: 'Laptops' },
    { key: 'accessories', name: 'Accessories' },
    { key: 'smart-home', name: 'Smart Home' },
    { key: 'tablets', name: 'Tablets' },
    { key: 'wearables', name: 'Wearables' },
    { key: 'cameras', name: 'Cameras' },
    { key: 'audio', name: 'Audio' },
    { key: 'housing', name: 'Housing' },
    { key: 'real-estate', name: 'Real Estate' },
    { key: 'rentals', name: 'Rentals' },
    { key: 'apartments', name: 'Apartments' },
    { key: 'condos', name: 'Condominiums' },
    { key: 'gaming', name: 'Gaming' },
    { key: 'networking', name: 'Networking' },
  ]

  const [businessInfo, setBusinessInfo] = useState({
    name: "TechGadgets Inc.",
    logo: `${process.env.NEXT_PUBLIC_ASSETS_URL}/placeholder.svg`,
    description: "We specialize in selling high-quality tech gadgets and accessories.",
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
    productCategories: [
      { key: 'smartphones', name: 'Smartphones' },
      { key: 'laptops', name: 'Laptops' },
      { key: 'accessories', name: 'Accessories' },
      { key: 'smart-home', name: 'Smart Home' }
    ],
    averageRating: 4.7,
    totalReviews: 128,
    responseRate: "98%",
    responseTime: "Within 1 hour",
  })

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBusinessInfo({ ...businessInfo, logo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setIsEditMode(false)
    // Here you would typically save the changes to your backend
    console.log("Saving business info:", businessInfo)
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:py-8 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Business Details</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button className="w-full sm:w-auto" onClick={() => (isEditMode ? handleSave() : setIsEditMode(true))}>
            {isEditMode ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Details
              </>
            )}
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/business">View Public Page</Link>
          </Button>
        </div>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="space-y-6 sm:space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-auto flex justify-center sm:justify-start">
                  <img
                    src={businessInfo.logo || "/placeholder.svg"}
                    alt="Business Logo"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                  />
                  {isEditMode && (
                    <Label
                      htmlFor="logo-upload"
                      className="absolute bottom-0 right-1/2 sm:right-0 translate-x-10 sm:translate-x-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <Camera className="h-4 w-4" />
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleLogoChange}
                      />
                    </Label>
                  )}
                </div>
                <div className=" w-full">
                  <Label htmlFor="business-name" className="block mb-1">Business Name</Label>
                  {isEditMode ? (
                    <Input
                      id="business-name"
                      value={businessInfo.name}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                      className="w-full"
                    />
                  ) : (
                    <p className="font-medium">{businessInfo.name}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="business-category">Business Category</Label>
                {isEditMode ? (
                  <Select
                    value={businessInfo.category}
                    onValueChange={(value) => setBusinessInfo({ ...businessInfo, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics & Gadgets">Electronics & Gadgets</SelectItem>
                      <SelectItem value="Fashion & Apparel">Fashion & Apparel</SelectItem>
                      <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                      <SelectItem value="Automotive">Automotive</SelectItem>
                      <SelectItem value="Health & Beauty">Health & Beauty</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p>{businessInfo.category}</p>
                )}
              </div>
              <div>
                <Label htmlFor="business-description">Description</Label>
                {isEditMode ? (
                  <Textarea
                    id="business-description"
                    value={businessInfo.description}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
                    rows={4}
                  />
                ) : (
                  <p>{businessInfo.description}</p>
                )}
              </div>
              <div>
                <Label htmlFor="business-established">Year Established</Label>
                {isEditMode ? (
                  <Input
                    id="business-established"
                    value={businessInfo.established}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, established: e.target.value })}
                  />
                ) : (
                  <p>{businessInfo.established}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 w-full">
                <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                {isEditMode ? (
                  <Input
                    value={businessInfo.website}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                    className="w-full"
                    placeholder="Enter website URL"
                  />
                ) : (
                  <a
                    href={businessInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {businessInfo.website}
                  </a>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Location */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              {isEditMode ? (
                <Input
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                />
              ) : (
                <p>{businessInfo.address}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Operating Hours */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Operating Hours</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {Object.entries(businessInfo.operatingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between gap-2 w-full">
                  <span className="capitalize min-w-[60px] sm:min-w-[100px]">{day}:</span>
                  {isEditMode ? (
                    <Input
                      value={hours}
                      className=" w-max"
                      placeholder="e.g. 9:00 AM - 6:00 PM"
                      onChange={(e) =>
                        setBusinessInfo({
                          ...businessInfo,
                          operatingHours: {
                            ...businessInfo.operatingHours,
                            [day]: e.target.value,
                          },
                        })
                      }
                    />
                  ) : (
                    <span className="">{hours}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Product Categories */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Product Categories</h2>
            {isEditMode ? (
              <MultipleSelect
                tags={PRODUCT_CATEGORIES}
                onChange={(items) => setBusinessInfo({ ...businessInfo, productCategories: items })}
                defaultValue={businessInfo.productCategories}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {businessInfo.productCategories.map((category) => (
                  <span key={category.key} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                    {category.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Business Performance */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Business Performance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4">
              <div className="space-y-1">
                <Label htmlFor="average-rating">Average Rating</Label>
                <p className="flex items-center text-lg">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  {businessInfo.averageRating} ({businessInfo.totalReviews} reviews)
                </p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="total-reviews">Total Reviews</Label>
                <p className="text-lg">{businessInfo.totalReviews}</p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="response-rate">Response Rate</Label>
                <p className="text-lg">{businessInfo.responseRate}</p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="response-time">Response Time</Label>
                <p className="text-lg">{businessInfo.responseTime}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Verification Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">Verification Status</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {businessInfo.isVerified ? "Your business is verified" : "Your business is not verified"}
              </p>
            </div>
            <Switch
              checked={businessInfo.isVerified}
              onCheckedChange={(checked) => setBusinessInfo({ ...businessInfo, isVerified: checked })}
              disabled={!isEditMode}
              className="mt-2 sm:mt-0"
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

