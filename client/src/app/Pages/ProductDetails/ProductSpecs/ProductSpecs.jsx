import { DropletsIcon, LeafIcon, ShieldCheckIcon, SunDimIcon } from 'lucide-react'
import React from 'react'
import "./ProductSpecs.css"

function ProductSpecs({ product }) {
  const specs = [
    { label: "Light", value: product.light, Icon: SunDimIcon },
    { label: "Water", value: product.watering, Icon: DropletsIcon },
    { label: "Care", value: `${product.careLevel} care`, Icon: LeafIcon },
    {
      label: "Pets",
      value: product.petFriendly ? "Pet friendly" : "Keep away from pets",
      Icon: ShieldCheckIcon,
    },
  ];

  return (
    <div className="pd-specs">
      {specs.map(({ label, value, Icon }) => (
        <div className="specs-container" key={label}>
            <div className="spec-logo">
                <Icon />
            </div>
            <p className="logo-name">{label}</p>
            <h3 className="spec-des">{value}</h3>
        </div>
      ))}
    </div>
  )
}

export default ProductSpecs
