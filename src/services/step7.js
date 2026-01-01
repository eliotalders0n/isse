/**
 * Layer 7: Biblical Alignment Evaluation (deterministic, pure)
 * Drop-in function for your Semantic Engine.
 *
 * Expected minimal message shape (post Layer 2 + keyword hits):
 * {
 *   timestamp: Date | number | string,
 *   sender: string,
 *   lexical?: { intent?: "A"|"R"|"Q"|"U"|"D"|"C" },  // or message.intent
 *   intent?: "A"|"R"|"Q"|"U"|"D"|"C",
 *   hits?: { toxicity?: number, affection?: number, apology?: number, secrecy?: number, fidelity?: number }
 * }
 *
 * Output:
 * {
 *   version, timestamp, score,
 *   principleBreakdown, strengths, concerns,
 *   alerts, recommendations,
 *   debug: { vars, intermediate }
 * }
 */

export function evaluateBiblicalAlignmentLayer7(input, userName = null, cfgOverrides = {}) {
  const cfg = { ...DEFAULT_BIBLICAL_CFG, ...cfgOverrides };

  // Accept either chatData (engine output) or plain messages array
  const messagesRaw = Array.isArray(input) ? input : (input?.messages || []);
  const messages = normalizeMessages(messagesRaw);

  const N = messages.length;
  if (N === 0) return emptyResult(cfg);

  // ---------- 1) Intent proportions with Laplace smoothing ----------
  const intentCounts = { A: 0, R: 0, Q: 0, U: 0, D: 0, C: 0 };
  for (const m of messages) {
    if (intentCounts[m.intent] !== undefined) intentCounts[m.intent] += 1;
  }
  const A = laplaceProp(intentCounts.A, N, cfg.alpha);
  const R = laplaceProp(intentCounts.R, N, cfg.alpha);
  const Q = laplaceProp(intentCounts.Q, N, cfg.alpha);
  const U = laplaceProp(intentCounts.U, N, cfg.alpha);
  const D = laplaceProp(intentCounts.D, N, cfg.alpha);
  const C = laplaceProp(intentCounts.C, N, cfg.alpha);

  // ---------- 2) Keyword-based indices ----------
  const sums = sumHits(messages);
  const T = clamp01(sums.toxicity / (N * cfg.tCap));   // toxicity index
  const I = clamp01(sums.affection / (N * cfg.iCap));  // intimacy index
  const Se = clamp01(sums.secrecy / (N * cfg.sCap));   // secrecy score (risk)
  const Frisk = clamp01(sums.fidelity / (N * cfg.fCap));
  const F = clamp01(1 - Frisk);                        // fidelity goodness
  const ApBin = sums.apology > 0 ? 1 : 0;              // apology presence

  // ---------- 3) Behavioral metrics (derived from timestamps/senders) ----------
  const Rec = reciprocityBalance(messages, userName);  // 0..1
  const L = latencyLogScore(messages, cfg.rtMin, cfg.rtMax); // 0..1 (slow=1)
  const Burst = burstiness(messages, cfg.burstWindowSec, cfg.burstCap); // 0..1
  const Silence = silenceCountNorm(messages, cfg.silenceThrSec, cfg.silenceCap); // 0..1 (more silence=1)

  // ---------- 4) Conflict / Repair events ----------
  const events = deriveConflictEvents(messages, cfg);
  const ReconcileRate = events.conflictCount > 0
    ? events.reconciledCount / events.conflictCount
    : 1;

  const SilenceAfterConflict = events.conflictCount > 0
    ? events.silenceAfterCount / events.conflictCount
    : 0;

  const EscalationSlope = events.conflictCount > 0
    ? events.escalationCount / events.conflictCount
    : 0;

  // ConflictIndex + DramaIntensity (optional but useful)
  const ConflictFreq = conflictFreqNorm(events.conflictCount, N, cfg.conflictPerMessagesCap);
  const ConflictIntensity = conflictIntensityNorm(events, cfg.peakToxCap);
  const ConflictIndex = clamp01(0.55 * ConflictFreq + 0.45 * ConflictIntensity);
  const DramaIntensity = clamp01(0.35 * U + 0.35 * R + 0.30 * Burst);

  // ---------- 5) Principle scores (0..1) ----------
  const LoveScore = clamp01(
    0.35 * A +
    0.25 * I +
    0.20 * Rec +
    0.20 * (1 - T)
  );

  const FaithfulnessScore = clamp01(
    0.55 * F +
    0.15 * (1 - R) +
    0.15 * (1 - Se) +
    0.15 * (1 - T)
  );

  const PeaceScore = cfg.useEscalation
    ? clamp01(
        0.30 * (1 - R) +
        0.20 * (1 - U) +
        0.20 * (1 - T) +
        0.15 * (1 - Burst) +
        0.15 * (1 - EscalationSlope)
      )
    : clamp01(
        0.35 * (1 - R) +
        0.25 * (1 - U) +
        0.20 * (1 - T) +
        0.20 * (1 - Burst)
      );

  const HonestyScore = clamp01(
    0.50 * (1 - T) +
    0.30 * C +
    0.20 * (1 - Se)
  );

  const PatienceScore = clamp01(
    0.50 * (1 - L) +
    0.30 * (1 - U) +
    0.20 * Rec
  );

  const ForgivenessScore = clamp01(
    0.60 * ReconcileRate +
    0.20 * (1 - SilenceAfterConflict) +
    0.20 * ApBin
  );

  // ---------- 6) Composite (0..100) ----------
  const composite01 =
    0.25 * LoveScore +
    0.20 * FaithfulnessScore +
    0.15 * PeaceScore +
    0.15 * HonestyScore +
    0.10 * PatienceScore +
    0.15 * ForgivenessScore;

  const score = round2(100 * clamp01(composite01));

  // ---------- 7) Threshold interpretation ----------
  const breakdown100 = {
    Love: round1(100 * LoveScore),
    Faithfulness: round1(100 * FaithfulnessScore),
    Peace: round1(100 * PeaceScore),
    Honesty: round1(100 * HonestyScore),
    Patience: round1(100 * PatienceScore),
    Forgiveness: round1(100 * ForgivenessScore),
  };

  const strengths = Object.entries(breakdown100)
    .filter(([, v]) => v >= cfg.strengthThr)
    .map(([k]) => k);

  const concerns = Object.entries(breakdown100)
    .filter(([, v]) => v <= cfg.concernThr)
    .map(([k]) => k);

  // ---------- 8) Alerts (deterministic) ----------
  const alerts = [];
  if (T >= cfg.alerts.toxicityThr) {
    alerts.push({
      code: "TOXICITY_PRESENT",
      severity: T >= 0.55 ? "high" : (T >= 0.35 ? "medium" : "low"),
      triggered: true,
      evidence: { T },
      explain: "Toxicity density exceeds threshold."
    });
  }
  if ((R - A) >= cfg.alerts.escalationDeltaThr && U >= cfg.alerts.urgencyThr) {
    alerts.push({
      code: "ESCALATION_RISK",
      severity: "medium",
      triggered: true,
      evidence: { R, A, U },
      explain: "Resistance exceeds alignment and urgency is elevated."
    });
  }
  if (F <= cfg.alerts.fidelityThr) {
    alerts.push({
      code: "FIDELITY_RISK",
      severity: "high",
      triggered: true,
      evidence: { F },
      explain: "Fidelity index indicates elevated risk (evidence hidden)."
    });
  }
  if (ConflictIndex >= cfg.alerts.conflictIndexThr && ReconcileRate <= cfg.alerts.reconcileLowThr) {
    alerts.push({
      code: "REPAIR_DEFICIT",
      severity: "medium",
      triggered: true,
      evidence: { ConflictIndex, ReconcileRate },
      explain: "Conflicts are elevated and reconciliation is low."
    });
  }

  // ---------- 9) Deterministic coaching (1–2 sentences, warm, non-scriptural) ----------
  const recommendations = buildRecommendations(breakdown100, {
    T, R, A, U, Rec, L, Burst, ReconcileRate, Se, F, SilenceAfterConflict, ConflictIndex
  });

  return {
    version: cfg.version,
    timestamp: Date.now(),
    score,
    principleBreakdown: breakdown100,
    strengths,
    concerns,
    alerts,
    recommendations,
    debug: {
      vars: {
        N, A, R, Q, U, D, C,
        T, I, Se, F,
        Rec, L, Burst, Silence,
        ReconcileRate, SilenceAfterConflict, EscalationSlope,
        ConflictIndex, DramaIntensity
      },
      intermediate: {
        LoveScore, FaithfulnessScore, PeaceScore,
        HonestyScore, PatienceScore, ForgivenessScore,
        composite01
      }
    }
  };
}

/* ---------------------------- CONFIG ---------------------------- */

const DEFAULT_BIBLICAL_CFG = {
  version: "biblical_alignment_v1.1",

  // Smoothing
  alpha: 1,

  // Caps for density normalization (hits per message)
  tCap: 1.5, // toxicity
  iCap: 1.0, // affection
  sCap: 0.5, // secrecy
  fCap: 0.3, // fidelity risk

  // Latency mapping (minutes)
  rtMin: 1,
  rtMax: 720,

  // Burst
  burstWindowSec: 10 * 60,
  burstCap: 12,

  // Silence
  silenceThrSec: 12 * 60 * 60,
  silenceCap: 6,

  // Conflict derivation
  toxCapMsg: 2,
  confTheta: 0.7,
  conflictGapAllowance: 2,  // max non-conflict messages allowed inside a conflict event
  reconcileWindowMsgs: 12,  // window after conflict for reconciliation
  alignReturnEta: 0.40,     // fraction of alignment intents in window
  escalationWindowM: 3,
  escalationDelta: 0.34,    // ~1 urgent msg increase out of 3
  peakToxCap: 3,
  conflictPerMessagesCap: 500, // normalization: 1 conflict per 500 messages "caps" frequency

  // Peace formula switch
  useEscalation: true,

  // Strength/concern thresholds (0..100)
  strengthThr: 75,
  concernThr: 55,

  // Alerts
  alerts: {
    toxicityThr: 0.20,
    escalationDeltaThr: 0.10,
    urgencyThr: 0.15,
    fidelityThr: 0.60,
    conflictIndexThr: 0.50,
    reconcileLowThr: 0.30,
  }
};

/* ---------------------------- HELPERS ---------------------------- */

function normalizeMessages(messages) {
  const out = messages
    .map((m) => {
      const ts = toTs(m.timestamp ?? m.ts ?? m.time ?? m.date);
      const sender = String(m.sender ?? m.from ?? "").trim();
      const intent = (m.intent ?? m.lexical?.intent ?? m.lexical?.primaryIntent ?? null);
      const hits = m.hits || m.keywordHits || m.lexical?.hits || {};

      return {
        ts,
        sender,
        intent: normalizeIntent(intent),
        hits: {
          toxicity: num(hits.toxicity ?? hits.tox ?? m.toxicityHits ?? 0),
          affection: num(hits.affection ?? hits.aff ?? m.affectionHits ?? 0),
          apology: num(hits.apology ?? hits.apo ?? m.apologyHits ?? 0),
          secrecy: num(hits.secrecy ?? hits.sec ?? m.secrecyHits ?? 0),
          fidelity: num(hits.fidelity ?? hits.fid ?? m.fidelityHits ?? 0),
        }
      };
    })
    .filter((m) => Number.isFinite(m.ts))
    .sort((a, b) => a.ts - b.ts);

  // If intent missing, default to Q (uncertainty) to avoid biasing to A/R
  for (const m of out) if (!m.intent) m.intent = "Q";
  return out;
}

function emptyResult(cfg) {
  return {
    version: cfg.version,
    timestamp: Date.now(),
    score: 0,
    principleBreakdown: { Love: 0, Faithfulness: 0, Peace: 0, Honesty: 0, Patience: 0, Forgiveness: 0 },
    strengths: [],
    concerns: ["Love", "Faithfulness", "Peace", "Honesty", "Patience", "Forgiveness"],
    alerts: [],
    recommendations: [],
    debug: { vars: {}, intermediate: {} }
  };
}

function sumHits(messages) {
  return messages.reduce((acc, m) => {
    acc.toxicity += m.hits.toxicity;
    acc.affection += m.hits.affection;
    acc.apology += m.hits.apology;
    acc.secrecy += m.hits.secrecy;
    acc.fidelity += m.hits.fidelity;
    return acc;
  }, { toxicity: 0, affection: 0, apology: 0, secrecy: 0, fidelity: 0 });
}

function laplaceProp(count, N, alpha) {
  return (count + alpha) / (N + 6 * alpha);
}

function reciprocityBalance(messages, userName) {
  // If userName provided, use that. Otherwise approximate: treat first sender as "user".
  const firstSender = messages[0]?.sender || "";
  const userKey = userName ? userName.trim() : firstSender;

  let Nu = 0;
  for (const m of messages) if (m.sender === userKey) Nu += 1;
  const N = messages.length;
  if (N === 0) return 0;

  const sentShare = Nu / N;
  return clamp01(1 - 2 * Math.abs(sentShare - 0.5));
}

function latencyLogScore(messages, rtMin, rtMax) {
  // Median response time between alternating senders
  const rts = [];
  let lastBySender = new Map();

  for (const m of messages) {
    // Find most recent message from the opposite sender by tracking last timestamp per sender
    // Simple approach: keep last message overall and require different sender
    // For robustness, compute based on immediate previous message if different sender.
  }

  for (let i = 1; i < messages.length; i++) {
    if (messages[i].sender !== messages[i - 1].sender) {
      const dtSec = messages[i].ts - messages[i - 1].ts;
      if (dtSec >= 0) rts.push(dtSec / 60); // minutes
    }
  }

  if (rts.length === 0) return 0.5; // neutral when cannot compute
  rts.sort((a, b) => a - b);
  const med = rts.length % 2 === 1
    ? rts[(rts.length - 1) / 2]
    : (rts[rts.length / 2 - 1] + rts[rts.length / 2]) / 2;

  const nume = Math.log(1 + med) - Math.log(1 + rtMin);
  const deno = Math.log(1 + rtMax) - Math.log(1 + rtMin);
  return clamp01(nume / deno);
}

function burstiness(messages, windowSec, burstCap) {
  // max messages in any sliding windowSec
  let maxBurst = 1;
  let j = 0;
  for (let i = 0; i < messages.length; i++) {
    while (messages[i].ts - messages[j].ts > windowSec) j++;
    const count = i - j + 1;
    if (count > maxBurst) maxBurst = count;
  }
  return clamp01(maxBurst / burstCap);
}

function silenceCountNorm(messages, thrSec, cap) {
  let silenceCount = 0;
  for (let i = 0; i < messages.length - 1; i++) {
    const gap = messages[i + 1].ts - messages[i].ts;
    if (gap >= thrSec) silenceCount += 1;
  }
  return clamp01(silenceCount / cap);
}

function deriveConflictEvents(messages, cfg) {
  // Conflict message indicator:
  // conf_i = clamp(0.7*I[intent=R] + 0.3*clamp(tox_i/toxCapMsg,0,1), 0,1)
  // ConfMsg if conf_i >= confTheta
  const confMsg = messages.map((m) => {
    const toxTerm = clamp01(m.hits.toxicity / cfg.toxCapMsg);
    const score = clamp01(0.7 * (m.intent === "R" ? 1 : 0) + 0.3 * toxTerm);
    return score >= cfg.confTheta;
  });

  const events = [];
  let i = 0;

  while (i < messages.length) {
    if (!confMsg[i]) { i++; continue; }

    // start event
    let start = i;
    let end = i;
    let gap = 0;
    i++;

    while (i < messages.length) {
      if (confMsg[i]) {
        end = i;
        gap = 0;
      } else {
        gap++;
        if (gap > cfg.conflictGapAllowance) break;
        end = i; // still include small gap
      }
      i++;
    }

    // Trim trailing non-conflict gap messages beyond last true
    while (end > start && !confMsg[end]) end--;

    events.push({ start, end });
  }

  // Reconciliation metrics
  let reconciledCount = 0;
  let silenceAfterCount = 0;
  let escalationCount = 0;

  for (const e of events) {
    const b = e.end;

    // Silence immediately after conflict
    if (b + 1 < messages.length) {
      const gap = messages[b + 1].ts - messages[b].ts;
      if (gap >= cfg.silenceThrSec) silenceAfterCount++;
    }

    // Reconciliation in next W messages
    const W = cfg.reconcileWindowMsgs;
    const winStart = b + 1;
    const winEnd = Math.min(messages.length - 1, b + W);

    let apologyFound = false;
    let alignCount = 0;

    for (let k = winStart; k <= winEnd; k++) {
      if (messages[k].hits.apology > 0) apologyFound = true;
      if (messages[k].intent === "A") alignCount++;
    }

    const winLen = Math.max(1, winEnd - winStart + 1);
    const alignFrac = alignCount / winLen;

    const reconciled = apologyFound || (alignFrac >= cfg.alignReturnEta);
    if (reconciled) reconciledCount++;

    // Escalation slope based on urgency shift within event
    if (cfg.useEscalation) {
      const m = cfg.escalationWindowM;
      const s0 = e.start;
      const s1 = Math.min(e.end, s0 + m - 1);
      const e0 = Math.max(e.start, e.end - m + 1);
      const e1 = e.end;

      const uStart = fracUrgent(messages, s0, s1);
      const uEnd = fracUrgent(messages, e0, e1);

      if ((uEnd - uStart) >= cfg.escalationDelta) escalationCount++;
    }
  }

  // Conflict intensity: mean peak toxicity per event (based on per-message toxicity hits)
  let meanPeakTox = 0;
  if (events.length > 0) {
    let sumPeaks = 0;
    for (const e of events) {
      let peak = 0;
      for (let k = e.start; k <= e.end; k++) {
        if (messages[k].hits.toxicity > peak) peak = messages[k].hits.toxicity;
      }
      sumPeaks += peak;
    }
    meanPeakTox = sumPeaks / events.length;
  }

  return {
    conflictCount: events.length,
    reconciledCount,
    silenceAfterCount,
    escalationCount,
    meanPeakTox
  };
}

function fracUrgent(messages, a, b) {
  if (a > b) return 0;
  let count = 0;
  let len = 0;
  for (let i = a; i <= b; i++) {
    len++;
    if (messages[i].intent === "U") count++;
  }
  return len > 0 ? count / len : 0;
}

function conflictFreqNorm(conflictCount, N, perMessagesCap) {
  // Frequency normalized: 1 conflict per perMessagesCap messages => 1.0
  const denom = Math.max(1, N / perMessagesCap);
  return clamp01(conflictCount / denom);
}

function conflictIntensityNorm(events, peakToxCap) {
  return clamp01((events.meanPeakTox || 0) / peakToxCap);
}

function buildRecommendations(breakdown100, vars) {
  // Choose 1–2 lowest principles, return warm, actionable guidance
  const entries = Object.entries(breakdown100).sort((a, b) => a[1] - b[1]);
  const picks = entries.slice(0, 2).filter(([, v]) => v <= 65);

  const recs = [];
  for (const [k] of picks) {
    recs.push({ principle: k, text: recommendationFor(k, vars) });
  }
  return recs;
}

function recommendationFor(principle, v) {
  switch (principle) {
    case "Peace":
      return "When things feel tense, try a short pause before replying (10–20 minutes) and return with one clear point and one question. This reduces escalation and keeps the conversation steady.";
    case "Forgiveness":
      return "Use a simple repair format: acknowledge the impact, take responsibility for your part, suggest one concrete change, and invite their response. This makes reconciliation more likely after conflict.";
    case "Love":
      return "Add one intentional warmth marker per day (appreciation, encouragement, or a supportive check-in). Small consistent signals increase connection and reduce misunderstandings.";
    case "Honesty":
      return "Try a clarity check: each person states what they believe is true, what they’re unsure about, and what they need clarified. Keep it factual and brief to avoid spirals.";
    case "Patience":
      return "Slow the pace: one message per point, avoid rapid bursts, and confirm you understood before responding. This improves patience and reduces reactive replies.";
    case "Faithfulness":
      return "Strengthen trust with transparency habits (clear expectations, consistent follow-through, and avoiding secrecy cues). If something feels unclear, raise it directly and calmly.";
    default:
      return "Focus on one small, consistent change this week that improves tone, clarity, and repair after tension.";
  }
}

function normalizeIntent(intent) {
  if (!intent) return null;
  const s = String(intent).toUpperCase();
  if (["A", "R", "Q", "U", "D", "C"].includes(s)) return s;
  // If your engine uses words, map them:
  const map = {
    ALIGNMENT: "A",
    RESISTANCE: "R",
    UNCERTAINTY: "Q",
    URGENCY: "U",
    DELEGATION: "D",
    CLOSURE: "C"
  };
  return map[s] || null;
}

function toTs(x) {
  if (x == null) return NaN;
  if (typeof x === "number") return x > 1e12 ? x : x * 1000; // tolerate seconds
  const d = new Date(x);
  const t = d.getTime();
  return Number.isFinite(t) ? t : NaN;
}

function num(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

function clamp01(x) {
  if (!Number.isFinite(x)) return 0;
  return Math.min(1, Math.max(0, x));
}

function round1(x) {
  return Math.round(x * 10) / 10;
}
function round2(x) {
  return Math.round(x * 100) / 100;
}


//How to plug it in as “Step 7” (minimal wiring)

// After your worker returns Layers 2–5 results (or after you assemble chatData.messages with .lexical.intent and keyword hit counts), run:

// import { evaluateBiblicalAlignmentLayer7 } from "@/services/biblicalAlignment/evaluateBiblicalAlignmentLayer7";

// const biblical = evaluateBiblicalAlignmentLayer7(chatData, selectedParticipantName);

// chatData.moralAlignment = chatData.moralAlignment || {};
// chatData.moralAlignment.biblical = biblical;


// If your messages currently don’t include hits, you can set hits from your existing keyword services (toxicity/affection/apology/secrecy/fidelity) per message and this will work unchanged.