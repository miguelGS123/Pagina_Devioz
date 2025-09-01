import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import type { Product } from "./ProductsPage";

interface Props {
  products: Product[];
  onAddToCart: (p: Product) => void;
}

const ProductsGrid: React.FC<Props> = ({ products, onAddToCart }) => {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.06 }
        }
      }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {products.map((p) => (
        <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          <ProductCard product={p} onAddToCart={() => onAddToCart(p)} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductsGrid;
