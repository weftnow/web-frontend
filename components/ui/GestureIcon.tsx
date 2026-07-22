export function GestureIcon({
  gesture = "point",
  className = "",
}: {
  gesture?: "point" | "peace";
  className?: string;
}) {
  if (gesture === "peace") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        viewBox="0 0 32 32"
      >
        <path
          d="M12.4 14.2 9.7 7.1a2.1 2.1 0 0 1 3.9-1.5l2.6 6.8.3-.1-.2-8.1a2.15 2.15 0 0 1 4.3-.1l.3 8.4 1.5-4.7a2.1 2.1 0 0 1 4 1.3l-2.6 8.1c3.8 5.7.7 11.8-5.2 12.5-5.1.6-9-1.7-10.7-6.7l-1.2-3.6a2.2 2.2 0 0 1 4.1-1.5l1.3 3.2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M13.1 19.1c2.2-1.2 4.6-.8 6.1.9"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 32 32"
    >
      <path
        d="M12.2 15.8V7.1a2.2 2.2 0 0 1 4.4 0v6.5h.5V4.7a2.2 2.2 0 1 1 4.4 0v8.9h.5V7.4a2.15 2.15 0 0 1 4.3 0v9.1c0 7.2-3.7 11.5-9.7 11.5-4.2 0-7-2.1-8.6-6.3l-1.3-3.3a2.3 2.3 0 0 1 4.2-1.8l1.3 2.7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m6.4 13.5-2.8.1M7.2 10.5l-2.4-1.6M9.5 8.5 8.4 5.9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
