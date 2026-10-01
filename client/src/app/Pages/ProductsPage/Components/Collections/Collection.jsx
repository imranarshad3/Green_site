import React, { useRef, useState } from "react";

import Card from "../Card/Cards.jsx";
import Pagination from "../../../../ReusedComponents/Pagination/Pagination.jsx";

import "./Collection.css";

function ProductsCollection({ products, view = "grid" }) {
  const [currentPage, setCurrentPage] = useState(1);

  const collectionRef = useRef(null);

  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentProducts = products.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(
    products.length / itemsPerPage
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
        <div className={`products-grid ${view === "list" ? "list-view" : ""}`}>
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

