import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const rl = readline.createInterface({ input: stdin, output: stdout });

// Lee una línea del usuario y la devuelve sin espacios sobrantes
export async function ask(question: string): Promise<string> {
  const answer = await rl.question(question);
  return answer.trim();
}

export function closePrompt(): void {
  rl.close();
}
