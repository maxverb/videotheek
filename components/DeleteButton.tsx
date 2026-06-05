"use client";

import { useRef } from "react";
import { IconTrash } from "@/components/icons";

// Verwijderknop met bevestiging. Plaatst verborgen velden in een form dat de
// meegegeven server-action aanroept.
// - variant "danger": opvallende rode knop (voor hoofdacties).
// - variant "subtle": rustige tekstknop met prullenbak-icoon (voor losse
//   credits/media/afbeeldingen), rood bij hover.
export function DeleteButton({
  action,
  velden,
  label = "Verwijderen",
  bevestiging = "Weet je het zeker? Dit kan niet ongedaan worden gemaakt.",
  klein = false,
  variant = "danger",
}: {
  action: (fd: FormData) => void | Promise<void>;
  velden: Record<string, string | number>;
  label?: string;
  bevestiging?: string;
  klein?: boolean;
  variant?: "danger" | "subtle";
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const klasse =
    variant === "subtle"
      ? "inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted transition hover:bg-panel2 hover:text-danger"
      : klein
        ? "btn-danger px-2 py-1 text-xs"
        : "btn-danger";

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
      <button type="submit" className={klasse}>
        <IconTrash size={variant === "subtle" ? 14 : 16} />
        {label && <span>{label}</span>}
      </button>
    </form>
  );
}
