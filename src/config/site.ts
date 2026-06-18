export interface NavLink {
  label: string;
  to: string;
}

export interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

export const ROUTES = {
  home: "/",
  services: "/services",
  tyres: "/tyres",
  about: "/aboutus",
  contact: "/contactus",
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Home", to: ROUTES.home },
  { label: "Services", to: ROUTES.services },
  { label: "Tyres", to: ROUTES.tyres },
  { label: "About Us", to: ROUTES.about },
  { label: "Contact", to: ROUTES.contact },
];

export const FOOTER_LINKS: NavLink[] = [
  ...NAV_LINKS,
  { label: "FAQ", to: "#" },
];

export const COMPANY = {
  name: "CTS",
  fullName: "CTS — Complete Tyre Solutions",
  tagline:
    "Your trusted partner for tyres across India. Quality brands, expert advice, and fast delivery.",
  phone: "+91 98765 43210",
  phoneHref: "tel:+919876543210",
  email: "info@ctstyres.com",
  address: "Mumbai, Maharashtra",
  hours: "Mon – Sat, 9am – 7pm",
} as const;

export const CONTACT_ITEMS: ContactItem[] = [
  { icon: "📞", label: "Phone", value: COMPANY.phone },
  { icon: "✉", label: "Email", value: COMPANY.email },
  { icon: "📍", label: "Address", value: COMPANY.address },
  { icon: "🕐", label: "Hours", value: COMPANY.hours },
];

export const BRANDS = [
  "MICHELIN",
  "BRIDGESTONE",
  "GOODYEAR",
  "CONTINENTAL",
  "PIRELLI",
  "YOKOHAMA",
  "HANKOOK",
  "MAXXIS",
];
