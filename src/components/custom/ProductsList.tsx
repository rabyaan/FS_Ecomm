import { getProducts } from "@/app/actions/products";
import ProductCard from "@/components/custom/ProductCard";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/custom/StarRating";


export default async function Home() {
  const products = await getProducts();

  return (
    <div className="p-8 max-w-[1400px] m-auto ">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
                    <ProductCard key={product.id} product={product} />

        ))}
      </div>

    </div>
  );
}
