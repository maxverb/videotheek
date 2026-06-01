"use client";

import { useFormStatus } from "react-dom";

export function Veld({
  label,
  name,
  fout,
  children,
  hint,
}: {
  label: string;
  name: string;
  fout?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted/70">{hint}</p>}
      {fout && <p className="mt-1 text-xs text-red-400">{fout}</p>}
    </div>
  );
}

export function Tekst(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`input ${props.className ?? ""}`} />;
}

export function Tekstvlak(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`input ${props.className ?? ""}`} rows={props.rows ?? 4} />;
}

export function Keuze(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`input ${props.className ?? ""}`} />;
}

export function SubmitKnop({ label = "Opslaan" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? "Bezig…" : label}
    </button>
  );
}

export function FormFout({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
      {message}
    </div>
  );
}
