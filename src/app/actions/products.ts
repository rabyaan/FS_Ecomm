// app/actions/products.ts (updated version)
'use server'

import prisma from '@/lib/prisma'
import { Product } from '@/app/generated/prisma'

export async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      brand: true,
    },
  })

  return products
}

export async function getProductById(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
      },
    })
    return product
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    return null
  }
}

export async function getBrands() {
  // Updated to include product count
  return await prisma.brand.findMany({
    include: {
      products: {
        select: {
          id: true,
        },
      },
    },
  })
}

export async function getBrandById(id: number) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        products: true,
      },
    })
    return brand
  } catch (error) {
    console.error('Error fetching brand by ID:', error)
    return null
  }
}

export async function getProductsByBrandId(brandId: number) {
  try {
    const products = await prisma.product.findMany({
      where: {
        brandId,
      },
      include: {
        brand: true,
      },
    })
    return products
  } catch (error) {
    console.error('Error fetching products by brand ID:', error)
    return []
  }
}

type CreateProductInput = {
  name: string
  image?: string 
  description: string
  longDescription?: string
  price: string
  rating: string
  availabilityStatus?: boolean
  tags: string[]
  brandId: number
}

export async function createProduct(data: CreateProductInput) {
  try {
    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        image: data.image,
        description: data.description,
        longDescription: data.longDescription,
        price: data.price,
        rating: data.rating,
        availabilityStatus: data.availabilityStatus ?? true,
        tags: data.tags,
        brandId: data.brandId,
      },
    })

    return { success: true, product: newProduct }
  } catch (error) {
    console.error('Create Product Error:', error)
    return { success: false, message: 'Failed to create product' }
  }
}

type CreateBrandInput = {
  name: string
  description: string
}

export async function createBrand(data: CreateBrandInput) {
  try {
    const newBrand = await prisma.brand.create({
      data: {
        name: data.name,
        description: data.description,
      },
    })

    return { success: true, brand: newBrand }
  } catch (error) {
    console.error('Create Brand Error:', error)
    return { success: false, message: 'Failed to create brand' }
  }
}