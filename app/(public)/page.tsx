import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { ServicesSection } from "@/components/home/services-section";
import { GallerySection } from "@/components/home/gallery-section";
import { AboutSection } from "@/components/home/about-section";
import { Testimonials } from "@/components/home/testimonials";
import { ContactSection } from "@/components/home/contact-section";

function ServicesSkeleton() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="h-10 w-48 bg-pink-100 rounded-lg mx-auto mb-4 animate-pulse" />
        <div className="h-5 w-72 bg-gray-100 rounded mx-auto mb-10 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-pink-100 p-6 space-y-3">
              <div className="h-12 w-12 bg-pink-100 rounded-full animate-pulse" />
              <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
              <div className="h-6 w-24 bg-pink-100 rounded animate-pulse" />
              <div className="h-7 w-full bg-gray-100 rounded-full animate-pulse mt-4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySkeleton() {
  return (
    <section className="py-16 bg-pink-50">
      <div className="container mx-auto px-4">
        <div className="h-10 w-40 bg-pink-100 rounded-lg mx-auto mb-4 animate-pulse" />
        <div className="h-5 w-64 bg-gray-100 rounded mx-auto mb-10 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-xl bg-gray-100 animate-pulse ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<ServicesSkeleton />}>
        <ServicesSection />
      </Suspense>
      <Suspense fallback={<GallerySkeleton />}>
        <GallerySection />
      </Suspense>
      <AboutSection />
      <Testimonials />
      <ContactSection />
    </>
  );
}
