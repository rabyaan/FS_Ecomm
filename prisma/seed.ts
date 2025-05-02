import { PrismaClient, Prisma } from '../src/app/generated/prisma';

const prisma = new PrismaClient();

// 1. Create brand
const brandData: Prisma.BrandCreateInput = {
  name: 'Haven Living',
  description: 'Curated modern essentials for a calm and inspired home.',
};

// 2. Product data using that brand
const productData: Omit<Prisma.ProductCreateInput, 'brand'>[] = [
  {
    name: 'Aroma Diffuser Lamp',
    description: 'A minimalist aroma diffuser with soft LED lighting, perfect for relaxation.',
    price: '89',
    tags: ['diffuser', 'aroma', 'lamp', 'minimalist'],
    rating: '4.8',
    availabilityStatus: true,
  },
  {
    name: 'Nordic Wall Clock',
    description: 'A silent, battery-powered wall clock with a clean Scandinavian design.',
    price: '45',
    tags: ['clock', 'wall', 'nordic', 'scandinavian'],
    rating: '4.6',
    availabilityStatus: true,
  },
  {
    name: 'LED Mirror with Touch Sensor',
    description: 'Sleek, frameless LED vanity mirror with adjustable brightness.',
    price: '120',
    tags: ['mirror', 'LED', 'touch', 'bathroom'],
    rating: '4.9',
    availabilityStatus: true,
  },
  {
    name: 'Matte Black Cutlery Set',
    description: 'Modern 16-piece stainless steel cutlery set in matte black finish.',
    price: '60',
    tags: ['cutlery', 'matte', 'black', 'kitchen'],
    rating: '4.7',
    availabilityStatus: true,
  },
  {
    name: 'Handcrafted Ceramic Vase',
    description: 'A hand-glazed ceramic vase with a neutral tone for dried flowers or as a decor piece.',
    price: '39',
    tags: ['vase', 'ceramic', 'decor', 'handcrafted'],
    rating: '4.5',
    availabilityStatus: false,
  },
];

export async function main() {
  const brand = await prisma.brand.create({
    data: brandData,
  });

  for (const p of productData) {
    await prisma.product.create({
      data: {
        ...p,
        brand: {
          connect: {
            id: brand.id,
          },
        },
      },
    });
  }
}

main()
  .then(() => console.log('✅ Seeding complete'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
