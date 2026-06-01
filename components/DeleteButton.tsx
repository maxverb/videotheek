"use client";

import { useRef } from "react";

// Verwijderknop met bevestiging. Plaatst verborgen velden in een form dat de
// meegegeven server-action aanroept.
export function DeleteButton({
  action,
  velden,
  label = "Verwijderen",
  bevestiging = "Weet je het zeker? Dit kan niet ongedaan worden gemaakt.",
  klein = false,
}: {
  action: (fd: FormData) => void | Promise<void>;
  velden: Record<string, string | number>;
  label?: string;
  bevestiging?: string;
  klein?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={(e) => {
        if (!confirm(bevestiging)) e.preventDefault();
      }}
    >
      {Object.entries(velden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button type="submit" className={klein ? "btn-danger px-2 py-1 text-xs" : "btn-danger"}>
        {label}
      </button>
    </form>
  );
}
