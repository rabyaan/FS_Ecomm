import { getProducts } from "./actions/products";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star, StarHalf, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/custom/StarRating";
import ProductsList from "@/components/custom/ProductsList";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="bg-">
      <ProductsList />
    </div>
  );
}
