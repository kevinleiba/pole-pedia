
export default function EyeIcon({ className }: { className: string }) {
  return (
    <svg
      width={32}
      height={32}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1.333 16S6.667 5.333 16 5.333 30.667 16 30.667 16 25.333 26.667 16 26.667 1.333 16 1.333 16Z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
