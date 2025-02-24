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
import Link from "next/link"

export default function BusinessSettings() {
  const [isEditMode, setIsEditMode] = useState(false)
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
    productCategories: ["Smartphones", "Laptops", "Accessories", "Smart Home"],
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
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Business Details</h1>
        <div className="space-x-2">
          <Button onClick={() => (isEditMode ? handleSave() : setIsEditMode(true))}>
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
          <Button variant="outline" asChild>
            <Link href="/business">View Public Page</Link>
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={businessInfo.logo || "/placeholder.svg"}
                    alt="Business Logo"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  {isEditMode && (
                    <Label
                      htmlFor="logo-upload"
                      className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
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
                <div className="flex-1">
                  <Label htmlFor="business-name">Business Name</Label>
                  {isEditMode ? (
                    <Input
                      id="business-name"
                      value={businessInfo.name}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
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
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {isEditMode ? (
                  <Input
                    value={businessInfo.website}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                  />
                ) : (
                  <a
                    href={businessInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {businessInfo.website}
                  </a>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {isEditMode ? (
                  <Input
                    value={businessInfo.email}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                  />
                ) : (
                  <span>{businessInfo.email}</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {isEditMode ? (
                  <Input
                    value={businessInfo.phone}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                  />
                ) : (
                  <span>{businessInfo.phone}</span>
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
            <h2 className="text-xl font-semibold mb-4">Operating Hours</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(businessInfo.operatingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between">
                  <span className="capitalize">{day}:</span>
                  {isEditMode ? (
                    <Input
                      value={hours}
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
                    <span>{hours}</span>
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
              <Textarea
                value={businessInfo.productCategories.join(", ")}
                onChange={(e) =>
                  setBusinessInfo({
                    ...businessInfo,
                    productCategories: e.target.value.split(",").map((cat) => cat.trim()),
                  })
                }
                placeholder="Enter categories separated by commas"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {businessInfo.productCategories.map((category, index) => (
                  <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Business Performance */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Business Performance</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="average-rating">Average Rating</Label>
                {isEditMode ? (
                  <Input
                    id="average-rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={businessInfo.averageRating}
                    onChange={(e) =>
                      setBusinessInfo({ ...businessInfo, averageRating: Number.parseFloat(e.target.value) })
                    }
                  />
                ) : (
                  <p className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {businessInfo.averageRating} ({businessInfo.totalReviews} reviews)
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="total-reviews">Total Reviews</Label>
                {isEditMode ? (
                  <Input
                    id="total-reviews"
                    type="number"
                    min="0"
                    value={businessInfo.totalReviews}
                    onChange={(e) =>
                      setBusinessInfo({ ...businessInfo, totalReviews: Number.parseInt(e.target.value) })
                    }
                  />
                ) : (
                  <p>{businessInfo.totalReviews}</p>
                )}
              </div>
              <div>
                <Label htmlFor="response-rate">Response Rate</Label>
                {isEditMode ? (
                  <Input
                    id="response-rate"
                    value={businessInfo.responseRate}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, responseRate: e.target.value })}
                  />
                ) : (
                  <p>{businessInfo.responseRate}</p>
                )}
              </div>
              <div>
                <Label htmlFor="response-time">Response Time</Label>
                {isEditMode ? (
                  <Input
                    id="response-time"
                    value={businessInfo.responseTime}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, responseTime: e.target.value })}
                  />
                ) : (
                  <p>{businessInfo.responseTime}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Verification Status */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Verification Status</h2>
              <p className="text-sm text-muted-foreground">
                {businessInfo.isVerified ? "Your business is verified" : "Your business is not verified"}
              </p>
            </div>
            <Switch
              checked={businessInfo.isVerified}
              onCheckedChange={(checked) => setBusinessInfo({ ...businessInfo, isVerified: checked })}
              disabled={!isEditMode}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

