"use client";

import { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className={className}>
      <label className="label">
        {label}
      </label>
      <input
        className={`
          w-full px-3 py-2 text-sm rounded-md border transition-all duration-150
          bg-[var(--control-bg)] border-[var(--border-default)]
          text-[var(--text-primary)] outline-none
          hover:border-cyan-600/50 hover:bg-[var(--surface-raised)]
          focus:border-[var(--electric-cyan)] focus:ring-2 focus:ring-[var(--control-focus-ring)]
          disabled:bg-[var(--control-bg-disabled)] disabled:text-[var(--text-muted)] disabled:opacity-60 disabled:cursor-not-allowed
          ${error ? "input-error" : ""}
        `}
        {...props}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export function Select({ label, options, error, className = "", ...props }: SelectProps) {
  return (
    <div className={className}>
      <label className="label">
        {label}
      </label>
      <select
        className={`
          w-full px-3 py-2 text-sm rounded-md border transition-all duration-150
          bg-[var(--control-bg)] border-[var(--border-default)]
          text-[var(--text-primary)] outline-none
          hover:border-cyan-600/50 hover:bg-[var(--surface-raised)]
          focus:border-[var(--electric-cyan)] focus:ring-2 focus:ring-[var(--control-focus-ring)]
          disabled:bg-[var(--control-bg-disabled)] disabled:text-[var(--text-muted)] disabled:opacity-60 disabled:cursor-not-allowed
          ${error ? "input-error" : ""}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
