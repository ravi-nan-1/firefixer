import type { SVGProps } from 'react';
import { Wrench, File } from 'lucide-react';

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://wwwQFm.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Ultimate File Tools Logo</title>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      <path d="M6 12a1 1 0 0 0 1.4 0l1.6-1.6a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0l-1.6 1.6a1 1 0 0 0 0 1.4l1.6 1.6z" />
      <path d="M22 12a1 1 0 0 0-1.4 0l-1.6 1.6a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l1.6-1.6a1 1 0 0 0 0-1.4l-1.6-1.6z" />
      <path d="M15 6.3a1 1 0 0 0-1.4 0l-1.6 1.6a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l1.6-1.6a1 1 0 0 0 0-1.4l-1.6-1.6z" />
    </svg>
  );
}
