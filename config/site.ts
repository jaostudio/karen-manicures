export const siteConfig = {
  name: "Karen Manicures",
  tagline: "Beautiful Nails for Every Occasion",
  description:
    "Professional manicure and pedicure services in Calauag, Quezon. Book online or via Messenger.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  messengerUrl:
    process.env.NEXT_PUBLIC_MESSENGER_URL || "https://m.me/karen.manicures",
  phone: "+63 9XX XXX XXXX",
  email: "karen@example.com",
  address: "123 Rizal St, Calauag, Quezon, Philippines",
  hours: {
    Monday: "9:00 AM – 6:00 PM",
    Tuesday: "9:00 AM – 6:00 PM",
    Wednesday: "9:00 AM – 6:00 PM",
    Thursday: "9:00 AM – 6:00 PM",
    Friday: "9:00 AM – 6:00 PM",
    Saturday: "9:00 AM – 6:00 PM",
    Sunday: "Closed",
  },
  openTime: "09:00",
  closeTime: "18:00",
  openDays: [1, 2, 3, 4, 5, 6],
  social: {
    messenger: "https://m.me/karen.manicures",
  },
  navItems: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};
