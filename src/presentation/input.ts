import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const rl = readline.createInterface({ input: stdin, output: stdout });

// Lee una línea del usuario y la devuelve sin espacios sobrantes
export async function ask(question: string): Promise<string> {
  const answer = await rl.question(question);
  return answer.trim();
}

// Lee un número entero; null si el input está vacío o no es válido
export async function askNumber(question: string): Promise<number | null> {
  const answer = await ask(question);
  if (answer === "") return null;
  const value = Number(answer);
  return Number.isInteger(value) ? value : null;
}

export function closePrompt(): void {
  rl.close();
}
