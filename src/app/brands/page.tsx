// app/brands/page.tsx
import Link from 'next/link'
import { getBrands } from '@/app/actions/products'
import { ArrowRight } from 'lucide-react'

export default async function BrandsPage() {
  const brands = await getBrands()

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-16 text-center">Our Brands</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <Link 
            href={`/brands/${brand.id}`} 
            key={brand.id}
            className="group"
          >
            <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden hover:shadow transition duration-300">              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{brand.name}</h2>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-black transition-colors">
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{brand.description}</p>
                
                <div className="text-xs text-gray-400">
                  {brand.products.length} Products
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}