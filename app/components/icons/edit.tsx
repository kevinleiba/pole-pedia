export default function EditIcon({ className }: { className: string }) {
  return (
    <svg
      width={32}
      height={32}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14.667 5.333H5.333A2.667 2.667 0 0 0 2.667 8v18.667a2.667 2.667 0 0 0 2.666 2.666H24a2.667 2.667 0 0 0 2.667-2.666v-9.334"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.667 3.333a2.829 2.829 0 0 1 4 4L16 20l-5.333 1.333L12 16 24.667 3.333Z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
