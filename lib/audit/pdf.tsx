import "server-only";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { AuditTranscript } from "./types";
import { AUDIT_QUESTIONS } from "./types";

/*
 * Audit hypothesis PDF — react-pdf server-rendered (spec §7.8).
 *
 * Layout: A4, one column, max two pages. Header strip (Abdul Wahab ·
 * abdulwahabai.com), then the streamed hypothesis (rendered as plain paragraphs —
 * we don't parse markdown for v1; the model already structures it with
 * blank lines and ## headings, which we render as bold dividers).
 *
 * Fonts: rely on react-pdf's built-in Helvetica family. Loading Fraunces
 * server-side adds 500KB+ to the function bundle and the brand is carried
 * adequately by layout and rhythm.
 */

const styles = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 56,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#1B1B1F",
    lineHeight: 1.55,
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 36,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#D8D8DA",
  },
  brand: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#15573D",
  },
  brandMeta: {
    fontSize: 9,
    color: "#5C5C66",
  },
  eyebrow: {
    fontSize: 8,
    color: "#5C5C66",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  h1: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#1B1B1F",
    marginBottom: 18,
  },
  h2: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1B1B1F",
    marginTop: 18,
    marginBottom: 6,
  },
  body: {
    fontSize: 10.5,
    color: "#1B1B1F",
    marginBottom: 8,
  },
  meta: {
    fontSize: 9,
    color: "#5C5C66",
    marginBottom: 4,
  },
  inputBlock: {
    backgroundColor: "#F6F6F8",
    padding: 14,
    borderRadius: 6,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 8,
    color: "#5C5C66",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  inputAnswer: {
    fontSize: 10,
    color: "#1B1B1F",
  },
  code: {
    fontFamily: "Courier",
    fontSize: 9,
    backgroundColor: "#F2F2F4",
    padding: 10,
    borderRadius: 6,
    color: "#1B1B1F",
    marginVertical: 8,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 56,
    right: 56,
    fontSize: 8,
    color: "#5C5C66",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

type HypothesisBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "code"; text: string }
  | { kind: "bullet"; text: string };

/*
 * Minimal "markdown" parse: H2 (## ...), fenced code blocks (```), bullet
 * lines (- ...), and everything else as paragraphs. We don't pull in a real
 * MD parser because the model output is constrained and unrendered MD looks
 * worse in a PDF than a clean fallback.
 */
function parseHypothesis(input: string): HypothesisBlock[] {
  const blocks: HypothesisBlock[] = [];
  const lines = input.replace(/\r\n/g, "\n").split("\n");
  let buffer: string[] = [];
  let inCode = false;
  const flushParagraph = () => {
    if (buffer.length === 0) return;
    const text = buffer.join(" ").trim();
    if (text) blocks.push({ kind: "paragraph", text });
    buffer = [];
  };

  for (const rawLine of lines) {
    if (rawLine.startsWith("```")) {
      flushParagraph();
      if (inCode) {
        inCode = false;
      } else {
        inCode = true;
        buffer = [];
      }
      continue;
    }
    if (inCode) {
      blocks.push({ kind: "code", text: rawLine });
      continue;
    }
    if (rawLine.startsWith("## ")) {
      flushParagraph();
      blocks.push({ kind: "heading", text: rawLine.slice(3).trim() });
      continue;
    }
    if (/^\s*[-*]\s+/.test(rawLine)) {
      flushParagraph();
      blocks.push({
        kind: "bullet",
        text: rawLine.replace(/^\s*[-*]\s+/, "").trim(),
      });
      continue;
    }
    if (rawLine.trim() === "") {
      flushParagraph();
      continue;
    }
    buffer.push(rawLine.trim());
  }
  flushParagraph();

  // Collapse consecutive code blocks back into one paragraph-of-code so we
  // render them as a single tinted box instead of 12 stacked rows.
  const collapsed: HypothesisBlock[] = [];
  for (const b of blocks) {
    const last = collapsed[collapsed.length - 1];
    if (b.kind === "code" && last && last.kind === "code") {
      last.text = `${last.text}\n${b.text}`;
    } else {
      collapsed.push({ ...b });
    }
  }
  return collapsed;
}

export type AuditPdfProps = {
  hypothesis: string;
  transcript: AuditTranscript;
  recipient: { name: string; email: string };
  generatedAt: Date;
};

export function AuditPdf({
  hypothesis,
  transcript,
  recipient,
  generatedAt,
}: AuditPdfProps) {
  const blocks = parseHypothesis(hypothesis);
  const dateLabel = generatedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Document
      title={`Workflow Audit — ${recipient.name}`}
      author="Abdul Wahab — abdulwahabai.com"
      creator="abdulwahabai.com"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.brandRow}>
          <Text style={styles.brand}>Abdul Wahab — abdulwahabai.com</Text>
          <Text style={styles.brandMeta}>{dateLabel}</Text>
        </View>

        <Text style={styles.eyebrow}>Workflow audit</Text>
        <Text style={styles.h1}>
          A one-page hypothesis for {recipient.name.split(" ")[0] ?? recipient.name}
        </Text>
        <Text style={styles.meta}>
          Based on the five-question discovery interview at abdulwahabai.com/lab/audit.
        </Text>

        {/* The model's hypothesis output */}
        {blocks.map((block, i) => {
          if (block.kind === "heading") {
            return (
              <Text key={i} style={styles.h2}>
                {block.text}
              </Text>
            );
          }
          if (block.kind === "code") {
            return (
              <Text key={i} style={styles.code}>
                {block.text}
              </Text>
            );
          }
          if (block.kind === "bullet") {
            return (
              <Text key={i} style={styles.body}>
                {"•  "}
                {block.text}
              </Text>
            );
          }
          return (
            <Text key={i} style={styles.body}>
              {block.text}
            </Text>
          );
        })}

        <Text style={styles.footer} fixed>
          <Text>abdulwahabai.com · info@abdulwahabai.com</Text>
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Your inputs</Text>
        <Text style={styles.h1}>What you told the audit bot</Text>
        {AUDIT_QUESTIONS.map((q) => (
          <View key={q.id} style={styles.inputBlock}>
            <Text style={styles.inputLabel}>{q.label}</Text>
            <Text style={styles.inputAnswer}>
              {transcript[q.id] ?? "—"}
            </Text>
          </View>
        ))}
        <Text style={styles.body}>
          Reply to this email if you want to take the next step — a 30-minute
          call, a fuller audit, or a workshop quote. — Abdul
        </Text>
        <Text style={styles.footer} fixed>
          <Text>abdulwahabai.com · info@abdulwahabai.com</Text>
        </Text>
      </Page>
    </Document>
  );
}
