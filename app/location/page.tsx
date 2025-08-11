"use client";
import React from "react";

export default function Location() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-primary mb-4">
        Visit Our Center
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Find us at our convenient location. We're here to serve you with all your digital service needs.
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-10">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Location Details
          </h2>

          <div className="mb-4 border-b pb-2">
            <span className="font-semibold">Address</span>
            <div>
              Jansevakendra
              <br />
              Karjan, Vadodara, Gujarat
              <br />
              India
            </div>
          </div>

          <div className="mb-4 border-b pb-2">
            <span className="font-semibold">Contact Numbers</span>
            <div>
              +91 63553 90372
              <br />
              +91 97272 02545
            </div>
          </div>

          <div className="mb-4 border-b pb-2">
            <span className="font-semibold">Email</span>
            <div>jansevakarkarjan@gmail.com</div>
          </div>

          <div className="mb-4">
            <span className="font-semibold">Business Hours</span>
            <div>
              Monday - Saturday: 9:00 AM - 6:00 PM
              <br />
              Sunday: Closed
            </div>
          </div>

          <a
            href="https://maps.app.goo.gl/ELth6WYj5mgSDTVo8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/80 transition"
          >
            View on Google Maps
          </a>
        </div>
        {/* Local Static Map Image */}
        <div className="flex flex-col items-center w-full max-w-xl">
          <a
            href="https://maps.app.goo.gl/ELth6WYj5mgSDTVo8"
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full"
          >
            <img
              src="/Screenshot 2025-07-03 152236.png"
              alt="Janseva Kendra Location"
              className="rounded-xl border-2 border-blue-200 shadow-xl w-full transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl"
            />
          </a>
          <span className="mt-3 text-gray-500 text-sm italic">Our center's exact location on the map</span>
        </div>
      </div>
    </div>
  );
}

