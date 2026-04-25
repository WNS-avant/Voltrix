const BASE_URL = "http://localhost:8000";

export async function parseJD(jdText: string) {
  const res = await fetch(`${BASE_URL}/jd/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: jdText }),
  });

  return res.json();
}

export async function matchCandidates(jdText: string) {
  const res = await fetch(`${BASE_URL}/candidates/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ jd_text: jdText }),
  });

  // 🛑 MANUAL STOP: Fetch won't trigger the catch block automatically for 400s
  if (!res.ok) {
    const errorData = await res.json();
    // We throw an error here so that index.tsx actually jumps to its 'catch' block
    throw {
        status: res.status,
        message: errorData.detail || "Invalid Request"
    };
  }

  return res.json();
}

export async function evaluateInterest(payload: any) {
  const res = await fetch(`${BASE_URL}/chat/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
}

export async function getShortlist(payload: any) {
  const res = await fetch(`${BASE_URL}/rank/shortlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
}