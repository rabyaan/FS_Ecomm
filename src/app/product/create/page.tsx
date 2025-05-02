"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { ArrowLeft, PackagePlus, Upload, Star, DollarSign, Tag, Building } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createProduct, getBrands } from "@/app/actions/products"
import { Brand, Product } from "@/app/generated/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import RichTextEditor from "@/components/custom/RichTextEditor"

const formSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  image: z.string().url({ message: "Enter a valid image URL." }).optional(),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
  longDescription: z.string().optional(),
  price: z.string().min(1, { message: "Price is required." }),
  tags: z.string().optional(), // comma-separated string
  rating: z
    .string()
    .refine((val) => {
      const num = Number(val)
      return !isNaN(num) && num >= 0 && num <= 5
    }, { message: "Rating must be a number between 0 and 5." })
    .optional(),
  availabilityStatus: z.boolean().optional(),
  brandId: z.coerce.number({ invalid_type_error: "Please select a brand." }),
})

export default function CreateProduct() {
  const router = useRouter()
  const [brands, setBrands] = useState<Brand[]>([])
  const [tagInput, setTagInput] = useState("")
  const [tagList, setTagList] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "",
      description: "",
      longDescription: "",
      price: "",
      tags: "",
      rating: "0",
      availabilityStatus: true,
      brandId: 0,
    },
  })

  useEffect(() => {
    async function fetchBrands() {
      try {
        const brandList = await getBrands()
        setBrands(brandList)
      } catch (error) {
        console.error("Failed to fetch brands:", error)
        toast.error("Failed to load brands.")
      }
    }

    fetchBrands()
  }, [])

  const handleAddTag = () => {
    if (tagInput.trim() && !tagList.includes(tagInput.trim())) {
      const newTags = [...tagList, tagInput.trim()]
      setTagList(newTags)
      form.setValue("tags", newTags.join(","))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    const newTags = tagList.filter(t => t !== tag)
    setTagList(newTags)
    form.setValue("tags", newTags.join(","))
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      const payload = {
        ...values,
        tags: tagList,
      }

      const response = await createProduct(payload as any)

      if (response.success) {
        form.reset()
        setTagList([])
        toast.success("Product added successfully!")
        router.push("/product/list")
      } else {
        toast.error(response.message || "Failed to add product.")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      toast.error("Failed to add product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new product in your catalog</p>
        </div>

        <br/>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="shadow-sm border border-gray-100 rounded-4xl overflow-hidden">
              <CardHeader className="bg-white p-4 px-6 border-b border-gray-100">
                <CardTitle className="text-xl font-semibold">Basic Information</CardTitle>
                <CardDescription>Enter the essential details of your product</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Product Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., iPhone 14 Pro"
                            className="bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition rounded-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brandId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Brand</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(Number(value))}
                            defaultValue={field.value ? String(field.value) : undefined}
                          >
                            <SelectTrigger className="bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition rounded-lg">
                              <SelectValue placeholder="Select a brand" />
                            </SelectTrigger>
                            <SelectContent>
                              {brands.map((brand) => (
                                <SelectItem key={brand.id} value={String(brand.id)}>
                                  {brand.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A brief summary of the product features"
                          className="bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition rounded-lg min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        This will appear in product listings and search results
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              placeholder="299.99"
                              className="bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition rounded-lg pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Rating (0 to 5)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Star className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              placeholder="4.5"
                              className="bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition rounded-lg pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-gray-100 rounded-4xl overflow-hidden">
              <CardHeader className="bg-white px-6 pt-6 pb-4 border-b border-gray-100">
                <CardTitle className="text-xl font-semibold">Product Media</CardTitle>
                <CardDescription>Add visual content for your product</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Product Image URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Upload className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="https://example.com/image.jpg"
                            className="bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition rounded-lg pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Enter a direct URL to your product image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* {field.value && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div className="aspect-square w-40 bg-white rounded-md overflow-hidden border border-gray-200 shadow-sm">
                      <img 
                        src={field.value} 
                        alt="Product preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";
                        }}
                      />
                    </div>
                  </div>
                )} */}
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-gray-100 rounded-4xl overflow-hidden">
              <CardHeader className="bg-white px-6 pt-6 pb-4 border-b border-gray-100">
                <CardTitle className="text-xl font-semibold">Product Details</CardTitle>
                <CardDescription>Add additional information about your product</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white space-y-6">

                <div>
                  <FormLabel className="text-sm font-medium text-gray-700">Product Tags</FormLabel>
                  <div className="flex gap-2 mt-2 mb-3 flex-wrap">
                    {tagList.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Add a tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition rounded-lg pl-9"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddTag}
                      className="border-gray-200 hover:bg-gray-100"
                    >
                      Add
                    </Button>
                  </div>
                  <FormDescription className="text-xs text-gray-500 mt-2">
                    Press Enter to add multiple tags (e.g., electronics, phone, premium)
                  </FormDescription>
                  <input type="hidden" {...form.register("tags")} />
                </div>

                <FormField
                  control={form.control}
                  name="availabilityStatus"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4 bg-gray-50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-medium text-gray-700">Available for Purchase</FormLabel>
                        <FormDescription className="text-xs text-gray-500">
                          Product will be immediately available in the store
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-black"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="border-gray-200 rounded-full py-6 px-12"
              >
                Reset Form
              </Button>

              <Button
                type="submit"
                className="bg-black text-white rounded-full py-6 px-12"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}