import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Step = { id: string; title: string; body: string };
export default function Walkthrough({
  steps,
  openByDefault = false,
}: { steps: Step[]; openByDefault?: boolean }) {
  const [open, setOpen] = useState(() => {
    const seen = localStorage.getItem("tour_seen");
    return openByDefault && !seen;
  });
  const [idx, setIdx] = useState(0);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    localStorage.setItem("tour_seen", "1");
  }, [open]);

  if (!open) return null;

  const step = steps[idx];
  const target = document.querySelector<HTMLElement>(`[data-tour-id="${step.id}"]`);
  if (!target) return null;

  const rect = target.getBoundingClientRect();
  const top = Math.max(16, rect.top + window.scrollY - 8);
  const left = Math.min(
    window.scrollX + rect.left,
    window.scrollX + window.innerWidth - 360 - 16
  );

  const next = () => setIdx((i) => Math.min(i + 1, steps.length - 1));
  const prev = () => setIdx((i) => Math.max(i - 1, 0));
  const done = () => setOpen(false);

  return createPortal(
    <>
      <div className="tour-backdrop" onClick={done} />
      <div className="tour-popper" ref={boxRef} style={{ top, left }}>
        <div className="tour-title">{step.title}</div>
        <div className="tour-body">{step.body}</div>
        <div className="tour-actions">
          <button className="btn ghost" onClick={done}>Skip</button>
          <div style={{ flex: 1 }} />
          <button className="btn ghost" onClick={prev} disabled={idx === 0}>Back</button>
          {idx < steps.length - 1 ? (
            <button className="btn" onClick={next}>Next</button>
          ) : (
            <button className="btn" onClick={done}>Done</button>
          )}
        </div>
      </div>
      <div className="tour-highlight" style={{
        top: rect.top + window.scrollY - 6,
        left: rect.left + window.scrollX - 6,
        width: rect.width + 12,
        height: rect.height + 12
      }} />
    </>,
    document.body
  );
}
