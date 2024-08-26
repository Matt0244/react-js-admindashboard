import { useState } from "react";
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
    <div className="bg-gray-100">
      <div className="px-8 py-12 ">
        <img className="h-10" src={logoWorkcation} alt="logoWorkcation" />
        <img
          className="mt-6  rounded-lg shadow-xl"
          src={beachWork}
          alt="beachWork"
        />
        <h1 className=" mt-6 text-2xl font-bold text-gray-900">
          You can work from anywhere. <br />
          <span className="text-indigo-500">Take advatage of it.</span>
        </h1>
        <p className="mt-2 text-gray-600">Workcation helps you find work-friendly rentals in beautiful locations so you can enjoy some
        nice weather even when you're not on vacation.</p>
        <div className="mt-4"> 
          <a className="inline-block px-5 py-3 rounded-lg bg-indigo-500 text-white  uppercase tracking-wider font-semibol text-sm"  href="#">Book you space </a>
        </div>
      </div>
    </div>
  );
}
