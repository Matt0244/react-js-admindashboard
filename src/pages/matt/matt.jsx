import { Fragment, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/20/solid";
import logoWorkcation from "../../assets/images/logoWorkcation.svg";
import beachWork from "../../assets/images/beach-work.jpg";

export default function Matt() {
  return (
    <div className="bg-gray-300 min-h-screen  ">
      <div className="bg-gray-100 grid lg:grid-cols-2 2xl:grid-cols-5 ">
        {/* 左面 */}
        <div className=" px-8 py-12   max-w-md mx-auto sm:max-w-xl lg:px-12 lg:py-24 lg:max-w-full  xl:mr-0  2xl:col-span-2 ">
          <div className="xl:max-w-xl">
            <img
              className="h-10   "
              src={logoWorkcation}
              alt="logoWorkcation"
            />
            <img
              className="mt-6  rounded-lg shadow-xl sm:h-64 sm:w-full sm:object-cover sm:object-center lg:hidden"
              src={beachWork}
              alt="beachWork"
            />

            <h1 className=" mt-6 text-2xl font-bold text-gray-900 sm:mt-8 sm:text-4xl lg:text-3xl xl:text-4xl">
              You can work from anywhere.
              <br />
              <span className="text-indigo-500 ">Take advatage of it.</span>
            </h1>
            <p className="mt-2 text-gray-600 sm:mt-4 sm:text-xl">
              Workcation helps you find work-friendly rentals in beautiful
              locations so you can enjoy some nice weather even when you're not
              on vacation.
            </p>
            <div className="mt-4 sm:mt-6 space-x-1">
              <a className="btn btn-primary shadow-lg transform transition hover:-translate-y-0.5" href="#">
                Book you space
              </a>
              <a className="btn btn-secondary" href="#">
                Learn More
              </a>
            </div>
          </div>
        </div>
        {/* 右面 */}
        <div className="hidden relative lg:block 2xl:col-span-3">
          <img
            className="absolute inset-0 w-full h-full object-cover object-center"
            src={beachWork}
            alt="beachWork"
          />
        </div>
      </div>
    </div>
  );
}
