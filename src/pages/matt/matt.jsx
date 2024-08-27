import React from "react";
import logoWorkcation from "../../assets/images/logoWorkcation.svg";
import beachWork from "../../assets/images/beach-work.jpg";
import popularDestination from "../../data/popularDestinations.js";
import DestinationCard from "../../components/DestinationCard.jsx";
import toronto from '../../assets/images/toronto.jpg'

export default function Matt() {
  return (
    <div className="bg-gray-300 min-h-screen">
      <div className="bg-gray-100 grid lg:grid-cols-2 2xl:grid-cols-5">
        {/* Left Section */}
        <div className="px-8 py-12 max-w-md mx-auto sm:max-w-xl lg:px-12 lg:py-24 lg:max-w-full xl:mr-0 2xl:col-span-2">
          <div className="xl:max-w-xl">
            <img className="h-10" src={logoWorkcation} alt="logoWorkcation" />
            <img
              className="mt-6 rounded-lg shadow-xl sm:h-64 sm:w-full sm:object-cover sm:object-center lg:hidden"
              src={beachWork}
              alt="beachWork"
            />
            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:mt-8 sm:text-4xl lg:text-3xl xl:text-4xl">
              You can work from anywhere.
              <br />
              <span className="text-indigo-500">Take advantage of it.</span>
            </h1>
            <p className="mt-2 text-gray-600 sm:mt-4 sm:text-xl">
              Workcation helps you find work-friendly rentals in beautiful
              locations so you can enjoy some nice weather even when you're not
              on vacation.
            </p>
            <div className="mt-4 sm:mt-6 space-x-1">
              <a
                className="btn btn-primary shadow-lg transform transition hover:-translate-y-0.5"
                href="#"
              >
                Book your space
              </a>
              <a className="btn btn-secondary" href="#">
                Learn More
              </a>
            </div>
          </div>
        </div>
        {/* Right Section */}
        <div className="hidden relative lg:block 2xl:col-span-3">
          <img
            className="absolute inset-0 w-full h-full object-cover object-center"
            src={beachWork}
            alt="beachWork"
          />
        </div>
      </div>

      {/* Popular Destinations Section */}
      <div className="max-w-md sm:max-w-xl lg:max-w-6xl mx-auto px-8 lg:px-12 py-8">
        <h2 className="text-xl text-gray-900">Popular destinations</h2>
        <p className="mt-2 text-gray-600">
          A selection of great work-friendly cities with lots to see and
          explore.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {popularDestination.map((b) => (
            <DestinationCard key={b.city} place={b} />
          ))}

          {popularDestination.map((a)=>( <DestinationCard key={a.city} place={a} />))}
          

        </div>
        
      </div>
    </div>
  );
}
