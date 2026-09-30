import React, { useEffect, useRef, useState } from "react";

import products from "./Plantify_Products/data";
import Card from "../Card/Cards.jsx";
import Pagination from "../../../../ReusedComponents/Pagination/Pagination.jsx";

import "./Collection.css";

function ProductsCollection({ filters }) {
  const [currentPage, setCurrentPage] = useState(1);

  const collectionRef = useRef(null);

  const itemsPerPage = 8;

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category);

    const careMatch =
      filters.careLevels.length === 0 ||
      filters.careLevels.includes(product.careLevel);

    const priceMatch =
      Number(product.price) <= Number(filters.maxPrice);

    const potColorMatch =
      !filters.potColor ||
      product.potColor === filters.potColor;

    return (
      categoryMatch &&
      careMatch &&
      priceMatch &&
      potColorMatch
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.categories,
    filters.careLevels,
    filters.maxPrice,
    filters.potColor,
  ]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(
    filteredProducts.length / itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);

    if (collectionRef.current) {
      const yOffset = -100;

      const y =
        collectionRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className="products-collection"
      ref={collectionRef}
    >
      {currentProducts.length > 0 ? (
        <div className="products-grid">
          {currentProducts.map((product) => (
            <Card
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <h3>No plants found</h3>
          <p>
            Try changing your filters to see more plants.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
}

export default ProductsCollection;

