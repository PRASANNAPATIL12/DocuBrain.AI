import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M12 12a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
      <path d="M12 12a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Z" />
      <path d="M12 14.5c-1.5 0-3.5 1-3.5 3" />
      <path d="M12 14.5c1.5 0 3.5 1 3.5 3" />
      <path d="M9.5 12c-1.5 0-2.5 1.5-2.5 3" />
      <path d="M14.5 12c1.5 0 2.5 1.5 2.5 3" />
    </svg>
  );
}
