import { env, stdout } from "node:process";

const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const BOLD = "\x1b[1m";

// Colores solo si la salida es un TTY y NO_COLOR no está definido
const enabled = stdout.isTTY === true && env.NO_COLOR === undefined;

function colorize(code: string, text: string): string {
  return enabled ? `${code}${text}${RESET}` : text;
}

export function cyan(text: string): string {
  return colorize(CYAN, text);
}

export function yellow(text: string): string {
  return colorize(YELLOW, text);
}

export function green(text: string): string {
  return colorize(GREEN, text);
}

export function red(text: string): string {
  return colorize(RED, text);
}

export function bold(text: string): string {
  return colorize(BOLD, text);
}
