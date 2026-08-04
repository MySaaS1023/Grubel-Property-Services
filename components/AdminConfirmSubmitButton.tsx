"use client";

export function AdminConfirmSubmitButton({
  children,
  className,
  message,
}: {
  children: string;
  className: string;
  message: string;
}) {
  return (
    <button
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
      type="submit"
    >
      {children}
    </button>
  );
}
