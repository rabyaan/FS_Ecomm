"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { ArrowLeft, PackagePlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createProduct, getBrands } from "@/app/actions/products"
import { Brand } from "@/app/generated/prisma"
import { Card } from "@/components/ui/card"

const formSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  image: z.string().url({ message: "Enter a valid image URL." }).optional(),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
  longDescription: z.string().optional(),
  price: z.string().min(1, { message: "Price is required." }),
  tags: z.string().optional(), // comma-separated string
  rating: z.string().optional(),
  availabilityStatus: z.boolean().optional(),
  brandId: z.coerce.number({ invalid_type_error: "Please select a brand." }),
})

export default function CreateProduct() {
  const router = useRouter()
  const [brands, setBrands] = useState<Brand[]>([])

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const tagArray = values.tags
        ? values.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : []

      const payload = {
        ...values,
        tags: tagArray,
      }

      const response = await createProduct(payload as any)

      if (response.success) {
        form.reset()
        toast.success("Product added successfully!")
        router.push("/product/list")
      } else {
        toast.error("Failed to add product.")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      toast.error("Failed to add product.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <PackagePlus className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-sm text-gray-500 mt-1">Create a new product in the catalog</p>
            </div>
          </div>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/product/list" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </Link>
          </Button>
        </div>

        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Short description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Detailed description (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="electronics, phone, new" {...field} />
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
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full p-2 border rounded-lg"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      >
                        <option value="">Select a brand</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                Add Product
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}
