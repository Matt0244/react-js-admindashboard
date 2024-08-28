import React from "react";

export default function DestinationCard({ place }) {
  if (!place) {
    return null; // 或者返回一个默认的占位符组件
  }

  return (
    <div className="flex items-center rounded-lg bg-white shadow-lg overflow-hidden">
      <img className="h-32 w-32 flex-shrink-0" src={place.imageUrl} alt={place.imageAlt} />
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800">{place.city}</h3>

        <p className="text-gray-600">${place.averagePrice} / night average</p>
        <div className="mt-4">
          <a href="#" className="text-brand hover:text-brand-light font-semibold text-sm">
            Explore {place.propertyCount} properties
          </a>
        </div>
      </div>
    </div>
  );
}