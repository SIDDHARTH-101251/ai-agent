export async function askBackend(message: string, sessionId?: string) {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ reply: string; session_id: string }>;
}
