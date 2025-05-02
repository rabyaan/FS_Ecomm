"use client";

import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import StarRating from "@/components/custom/StarRating";
import { Eye } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link";

interface Product {
    image?: string | null;
    id: number;
    name: string;
    description: string;
    price: string;
    rating: string;
    tags: string[];
    availabilityStatus: boolean;
    brand: {
        name: string;
    };
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="bg-white rounded-4xl border-[1px] p-2 border-gray-200 flex justify-between flex-col">
            <AspectRatio ratio={16 / 9}>
                {product.image && (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="rounded-3xl object-cover"
                        unoptimized
                    />
                )}
            </AspectRatio>
            <div className=" px-3 pb-4">


                <h2 className="text-lg font-semibold mt-4">{product.name}</h2>
                <p className="text-sm text-gray-500 mb-1">{product.description}</p>

                <div className="flex items-center justify-between mt-2">
                    <span className="text-base font-bold text-black">${product.price}</span>
                    <StarRating rating={parseFloat(product.rating)} />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                        <span
                            key={tag}
                            className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-4 text-sm text-gray-600">
                    <p>
                        Status:{" "}
                        <span
                            className={
                                product.availabilityStatus
                                    ? "text-green-600 font-medium"
                                    : "text-red-500 font-medium"
                            }
                        >
                            {product.availabilityStatus ? "Available" : "Out of Stock"}
                        </span>
                    </p>
                    <p>
                        Brand: <span className="font-medium">{product.brand.name}</span>
                    </p>
                </div>
            </div>
            <div className="flex justify-center mt-4 w-full gap-2">
                <button className="bg-black text-white px-4 py-3 rounded-full w-full">
                    Add to Cart
                </button>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Link
                                href={`/product/${product.id}`}
                                key={product.id}
                                className="group pointer cursor-pointer"
                            >
                                <button className="bg-gray-200 cursor-pointer text-gray-600 p-3 rounded-full hover:bg-gray-300">
                                    <Eye className="w-5 h-5" />
                                </button>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>View Product</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>
        </div>
    )
}
