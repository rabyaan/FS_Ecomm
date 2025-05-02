// app/product/[id]/page.tsx
import { getProductById } from '@/app/actions/products'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import StarRating from '@/components/custom/StarRating'
import { Heart, Share2, ChevronRight, Package } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(Number(params.id))

  if (!product) return notFound()

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <nav className="mb-8 flex items-center text-sm text-gray-500">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/brands/${product.brand.id}`}>{product.brand.name}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left column - Image */}
        <div className="space-y-6">
          <AspectRatio ratio={1 / 1} className="bg-gray-50 rounded-3xl overflow-hidden">
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                unoptimized
                priority
              />
            )}
          </AspectRatio>


        </div>

        {/* Right column - Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Brand & Actions */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium uppercase tracking-wider text-gray-500">
                {product.brand.name}
              </span>
              <div className="flex gap-3">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Title & Rating */}
            <h1 className="text-4xl font-bold mb-4 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={parseFloat(product.rating)} />
              <span className="text-sm text-gray-500">
                {parseFloat(product.rating).toFixed(1)} ({Math.floor(Math.random() * 500) + 100} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold mb-6">${product.price}</div>

            {/* Description */}
            <div className="prose text-gray-600 mb-8 ">
              <p className="text-lg mb-4">{product.description}</p>
              {product.longDescription && (
                <p className="text-gray-500">{product.longDescription}</p>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-3 h-3 rounded-full ${product.availabilityStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm ${product.availabilityStatus ? 'text-green-600' : 'text-red-500'}`}>
                {product.availabilityStatus ? 'In Stock' : 'Out of Stock'}
              </span>
              {product.availabilityStatus && (
                <span className="text-sm text-gray-500 ml-2">
                  Usually ships in 1-2 business days
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            <button className="w-full bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-900 transition-colors">
              Add to Cart
            </button>
            <button className="w-full bg-white text-black px-8 py-4 rounded-full border border-gray-300 font-medium hover:bg-gray-50 transition-colors">
              Buy Now
            </button>
          </div>

          {/* Shipping info */}
          <div className="mt-8 flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <Package className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-800">Free delivery on orders over $100</p>
              <p className="text-xs text-gray-500">30-day free returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}