import { siteConfig } from "./site";

const hoursLd = Object.entries(siteConfig.hours).map(([day, hours]) => ({
  "@type": "OpeningHoursSpecification",
  dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
  opens: hours.split(" - ")[0],
  closes: hours.split(" - ")[1],
}));

export const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": siteConfig.url,
  name: siteConfig.name,
  image: `${siteConfig.url}/api/og`,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address,
    addressLocality: "Calauag",
    addressRegion: "Quezon",
    addressCountry: "PH",
  },
  url: siteConfig.url,
  openingHoursSpecification: hoursLd,
  priceRange: "₱₱",
  sameDayDelivery: false,
  areaServed: "Calauag, Quezon",
  hasMap: "https://maps.google.com/?q=Karen+Manicures+Calauag",
};
