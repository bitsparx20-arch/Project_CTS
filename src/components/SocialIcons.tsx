import type { ReactNode } from "react";

interface SocialLink {
  label: string;
  href: string;
  icon: ReactNode;
}

const FacebookIcon = ({ fill = "#888" }: { fill?: string }) => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill={fill} aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
  </svg>
);

const InstagramIcon = ({ fill = "#888" }: { fill?: string }) => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke={fill} strokeWidth={1.8} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" />
  </svg>
);

const WhatsAppIcon = ({ fill = "#888" }: { fill?: string }) => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill={fill} aria-hidden="true">
    <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-1.4-.7-2.3-1.2-3.3-2.8-.2-.3.2-.3.5-.9.1-.2 0-.3-.1-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9 1-.9 2.3 0 1.3 1 2.6 1.1 2.8.1.2 1.9 3 4.7 4.1 2.3.9 2.8.7 3.3.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.1-1.3-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2z" />
  </svg>
);

const SOCIAL_LINKS: SocialLink[] = [
  { label: "Facebook", href: "#", icon: <FacebookIcon fill="#fff" /> },
  { label: "Instagram", href: "#", icon: <InstagramIcon fill="#fff" /> },
  { label: "WhatsApp", href: "#", icon: <WhatsAppIcon fill="#fff" /> },
];

export default function SocialIcons() {
  return (
    <div className="socials">
      {SOCIAL_LINKS.map((s) => (
        <a key={s.label} href={s.href} aria-label={s.label} className="social-icon">
          {s.icon}
        </a>
      ))}
    </div>
  );
}
