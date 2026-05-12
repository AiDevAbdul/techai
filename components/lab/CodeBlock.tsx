"use client";

import { useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

/*
 * CodeBlock — Lab Notes code block override (spec §7.7).
 *
 * JetBrains Mono 14px on `--code-bg`. Copy button in the corner.
 * No line numbers, no syntax highlighting in v1 — the bar is "easy to read
 * and easy to copy," not IDE parity. Adding Shiki/Prism is v2 if it's worth
 * the bundle weight.
 *
 * MDX wires this in via:
 *   <MDXRemote source={body} components={{ pre: CodeBlock }} />
 * The runtime element is `<pre><code>...</code></pre>`. We unwrap the
 * inner `<code>` to read its text for the clipboard.
 */

function readText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(readText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    if (props && "children" in props) return readText(props.children);
  }
  return "";
}

export default function CodeBlock(props: { children?: ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = preRef.current?.innerText ?? readText(props.children);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard may be blocked; surface nothing — copy is a convenience
    }
  }

  return (
    <div className="not-prose group relative my-8">
      <pre
        ref={preRef}
        className="border-separator bg-[var(--code-bg)] text-[var(--code-ink)] overflow-x-auto rounded-2xl border p-5 font-[var(--font-mono)] text-[14px] leading-[1.6]"
      >
        {props.children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="text-ink-secondary hover:text-ink focus-visible:outline-accent absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--code-bg)]/80 opacity-0 backdrop-blur transition-opacity duration-[var(--dur-fast)] group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {copied ? (
          <Check size={14} strokeWidth={1.75} aria-hidden />
        ) : (
          <Copy size={14} strokeWidth={1.75} aria-hidden />
        )}
      </button>
    </div>
  );
}
