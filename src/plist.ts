// Minimal XML property-list writer. Shortcuts and `shortcuts sign` read XML plists;
// `Shortcut.write` converts to binary with plutil when available for parity with Apple's files.
export type PlistValue = string | number | boolean | PlistValue[] | { [key: string]: PlistValue };

function escape(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function node(value: PlistValue, indent: string): string {
  if (typeof value === "string") return `${indent}<string>${escape(value)}</string>\n`;
  if (typeof value === "boolean") return `${indent}<${value ? "true" : "false"}/>\n`;
  if (typeof value === "number") {
    return Number.isInteger(value) ? `${indent}<integer>${value}</integer>\n` : `${indent}<real>${value}</real>\n`;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return `${indent}<array/>\n`;
    return `${indent}<array>\n${value.map((v) => node(v, indent + "\t")).join("")}${indent}</array>\n`;
  }
  const keys = Object.keys(value);
  if (keys.length === 0) return `${indent}<dict/>\n`;
  const body = keys.map((k) => `${indent}\t<key>${escape(k)}</key>\n${node(value[k]!, indent + "\t")}`).join("");
  return `${indent}<dict>\n${body}${indent}</dict>\n`;
}

export function toXmlPlist(root: PlistValue): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n${node(root, "")}</plist>\n`;
}
