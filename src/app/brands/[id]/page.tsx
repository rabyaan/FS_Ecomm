// app/brands/[id]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBrands, getProducts } from '@/app/actions/products'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { ChevronRight, ArrowRight, Star } from 'lucide-react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
  import ProductCard from "@/components/custom/ProductCard";
  
  

async function getBrandById(id: number) {
  const brands = await getBrands()
  return brands.find(brand => brand.id === id) || null
}

async function getProductsByBrandId(brandId: number) {
  const allProducts = await getProducts()
  return allProducts.filter(product => product.brandId === brandId)
}

interface BrandDetailPageProps {
  params: {
    id: string
  }
}

export default async function BrandDetailPage({ params }: BrandDetailPageProps) {
  const brandId = Number(params.id)
  const brand = await getBrandById(brandId)

  if (!brand) return notFound()

  const products = await getProductsByBrandId(brandId)

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
              <BreadcrumbLink href="/brands">Brands</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{brand.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      <div className="mb-16 border-[1px] border-gray-200 rounded-4xl py-22 p-8 relative bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full absolute top-3 right-3 text-sm font-medium">
            {products.length} Products
          </span>
        <div className="flex  flex-col gap-2 justify-center items-center text-center ">
          <h1 className="text-4xl font-bold">{brand.name}</h1>
          <p className="text-gray-700 max-w-3xl">{brand.description}</p>
        
        </div>

      </div>

      <div>
      
      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
                    <ProductCard key={product.id} product={product} />

        ))}
      </div>
      </div>
    </div>
  )
}