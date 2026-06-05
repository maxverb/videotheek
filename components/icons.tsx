// Dunne lijn-iconen in één stijl (stroke, currentColor). Vervangt de emoji.
import type { SVGProps } from "react";

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

function Svg({ children, size = 16, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} aria-hidden {...base} {...props}>
      {children}
    </svg>
  );
}

export const IconSearch = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </Svg>
);

export const IconPlay = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Svg {...p}>
    <path d="M6 4.5v15l13-7.5z" />
  </Svg>
);

export const IconCopy = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Svg {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h8" />
  </Svg>
);

export const IconFilm = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4" />
  </Svg>
);

export const IconPerson = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </Svg>
);

export const IconTrash = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Svg {...p}>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
  </Svg>
);

export const IconPlus = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const IconMinus = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);

export const IconSettings = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.4 13a7.8 7.8 0 0 0 0-2l1.7-1.3-1.8-3.1-2 .8a7.6 7.6 0 0 0-1.8-1l-.3-2.1H9.6l-.3 2.1a7.6 7.6 0 0 0-1.8 1l-2-.8L3.7 9.7 5.4 11a7.8 7.8 0 0 0 0 2l-1.7 1.3 1.8 3.1 2-.8a7.6 7.6 0 0 0 1.8 1l.3 2.1h4.8l.3-2.1a7.6 7.6 0 0 0 1.8-1l2 .8 1.8-3.1z" />
  </Svg>
);
