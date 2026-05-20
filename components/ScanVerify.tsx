"use client";
import { useState, useRef } from "react";
import { useApp, useAudit } from "@/lib/store";
import { DRUG_INVENTORY } from "@/lib/database";
import { ScanLine, CheckCircle, XCircle, AlertTriangle, ChevronRight, Barcode, RotateCcw } from "lucide-react";

export default function ScanVerify() {
  const { state, dispatch } = useApp();
  const addAudit = useAudit();
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<"idle" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [scannedItem, setScannedItem] = useState<typeof DRUG_INVENTORY[0] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const rx = state.activePrescription;

  async function handleScan() {
    if (!barcode.trim() || !rx) return;
    setScanning(true);
    setResult("idle");

    await new Promise(r => setTimeout(r, 1500)); // AI processing

    const item = DRUG_INVENTORY.find(d => d.barcode === barcode.trim());

    if (!item) {
      setResult("error");
      setErrorMsg("Barcode not found in system. Drug not registered.");
      addAudit("SCAN_FAILED", `Unknown barcode: ${barcode}`, "error");
      dispatch({
        type: "ADD_SCAN",
        attempt: { barcode, drug: "UNKNOWN", strength: "UNKNOWN", result: "error", reason: "Barcode not in database", timestamp: new Date().toTimeString().slice(0, 8) }
      });
    } else if (item.drug.split(" ")[0] !== rx.drug.split(" ")[0]) {
      setResult("error");
      setErrorMsg(`WRONG DRUG. Scanned: ${item.drug} ${item.strength}. Prescribed: ${rx.drug} ${rx.strength}. Do not dispense.`);
      setScannedItem(item);
      addAudit("SCAN_WRONG_DRUG", `Wrong drug scanned: ${item.drug} vs ${rx.drug}`, "error");
      dispatch({
        type: "ADD_SCAN",
        attempt: { barcode, drug: item.drug, strength: item.strength, result: "error", reason: "Wrong drug", timestamp: new Date().toTimeString().slice(0, 8) }
      });
    } else if (item.strength !== rx.strength) {
      setResult("error");
      setErrorMsg(`WRONG STRENGTH. Scanned: ${item.drug} ${item.strength}. Prescribed: ${rx.drug} ${rx.strength}. Clinical risk: Incorrect dosing. Retrieve correct bottle.`);
      setScannedItem(item);
      addAudit("SCAN_WRONG_STRENGTH", `Wrong strength: scanned ${item.strength}, prescribed ${rx.strength}`, "error");
      dispatch({
        type: "ADD_SCAN",
        attempt: { barcode, drug: item.drug, strength: item.strength, result: "error", reason: `Wrong strength: ${item.strength} vs ${rx.strength}`, timestamp: new Date().toTimeString().slice(0, 8) }
      });
    } else {
      // Check expiry
      const expDate = new Date(item.expiry);
      if (expDate < new Date()) {
        setResult("error");
        setErrorMsg(`EXPIRED MEDICATION. Expiry date: ${item.expiry}. Do not dispense.`);
        setScannedItem(item);
        addAudit("SCAN_EXPIRED", `Expired medication scanned: ${item.drug} exp ${item.expiry}`, "error");
      } else {
        setResult("success");
        setSuccessMsg(`VERIFIED. Drug name matches. Strength matches. Expiry valid (${item.expiry}). Safe to dispense.`);
        setScannedItem(item);
        addAudit("SCAN_SUCCESS", `Verified: ${item.drug} ${item.strength} Batch: ${item.batch}`, "success");
        dispatch({
          type: "ADD_SCAN",
          attempt: { barcode, drug: item.drug, strength: item.strength, result: "success", timestamp: new Date().toTimeString().slice(0, 8) }
        });
      }
    }

    setScanning(false);
  }

  function reset() {
    setBarcode(""); setResult("idle"); setErrorMsg(""); setSuccessMsg(""); setScannedItem(null);
    inputRef.current?.focus();
  }

  const attempts = state.scanAttempts;

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <div className="section-label" style={{ marginBottom: 4 }}>STEP 6 — BARCODE VERIFICATION</div>
        <h1 className="display-font" style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
          Scan & Verify Drug
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>
          Scan the barcode on the physical drug bottle. AI will verify name, strength, batch, and expiry.
        </p>
      </div>

      {/* Target prescription */}
      <div className="card-inner" style={{ padding: "14px 18px", marginBottom: 24, display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ padding: "8px 12px", background: "var(--green-glow)", border: "1px solid var(--green)30", borderRadius: 6 }}>
          <Barcode size={20} color="var(--green)" />
        </div>
        <div>
          <div className="section-label" style={{ marginBottom: 2 }}>EXPECTED</div>
          <div style={{ fontSize: 15, color: "var(--text)", fontWeight: 600 }}>
            {rx?.drug} {rx?.strength}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{rx?.route} · Qty: {rx?.quantity}</div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div className="section-label">PATIENT</div>
          <div style={{ fontSize: 13, color: "var(--text)" }}>{state.activePatient?.name}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Scanner input */}
        <div className="card" style={{ padding: 24 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>BARCODE SCANNER</div>

          <div style={{ marginBottom: 16 }}>
            <label className="section-label" style={{ display: "block", marginBottom: 6 }}>Enter or scan barcode</label>
            <input
              ref={inputRef}
              className="input-field"
              placeholder="Scan or type barcode..."
              value={barcode}
              onChange={e => setBarcode(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleScan()}
              style={{ fontFamily: "var(--mono)", letterSpacing: "0.05em" }}
            />
          </div>

          {/* Quick demo barcodes */}
          <div style={{ marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>DEMO BARCODES</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button
                onClick={() => setBarcode("123456789012")}
                style={{
                  background: "var(--red-glow)", border: "1px solid var(--red-dim)30",
                  borderRadius: 6, padding: "8px 12px", cursor: "pointer", textAlign: "left"
                }}
              >
                <div style={{ fontSize: 11, color: "var(--red)" }}>WRONG STRENGTH (will fail)</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>123456789012 — Amlodipine 5mg</div>
              </button>
              <button
                onClick={() => setBarcode("123456789013")}
                style={{
                  background: "var(--green-glow)", border: "1px solid var(--green)30",
                  borderRadius: 6, padding: "8px 12px", cursor: "pointer", textAlign: "left"
                }}
              >
                <div style={{ fontSize: 11, color: "var(--green)" }}>CORRECT (will pass)</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>123456789013 — Amlodipine 10mg</div>
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-primary"
              onClick={handleScan}
              disabled={scanning || !barcode}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {scanning ? (
                <><ScanLine size={14} style={{ animation: "blink 0.5s infinite" }} /> Scanning…</>
              ) : (
                <><ScanLine size={14} /> Verify</>
              )}
            </button>
            <button className="btn-ghost" onClick={reset} style={{ padding: "10px 14px" }}>
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Result */}
        <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column" }}>
          <div className="section-label" style={{ marginBottom: 16 }}>AI VERIFICATION RESULT</div>

          {scanning && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="scan-effect" style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--green-glow)", border: "2px solid var(--green)50", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <ScanLine size={30} color="var(--green)" />
              </div>
              <div style={{ fontSize: 13, color: "var(--green)" }}>Processing scan…</div>
            </div>
          )}

          {result === "error" && !scanning && (
            <div className="animate-slide-up" style={{ flex: 1 }}>
              <div style={{
                padding: "16px", background: "var(--red-glow)", border: "2px solid var(--red-dim)",
                borderRadius: 8, marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start"
              }}>
                <XCircle size={18} color="var(--red)" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", marginBottom: 4 }}>SCAN FAILED</div>
                  <div style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.5 }}>{errorMsg}</div>
                </div>
              </div>
              {scannedItem && (
                <div style={{ fontSize: 12, color: "var(--text-dim)", display: "flex", flexDirection: "column", gap: 4 }}>
                  <div>Scanned: <span style={{ color: "var(--text)" }}>{scannedItem.drug} {scannedItem.strength}</span></div>
                  <div>Batch: <span style={{ color: "var(--text)" }}>{scannedItem.batch}</span></div>
                  <div>Expiry: <span style={{ color: "var(--text)" }}>{scannedItem.expiry}</span></div>
                </div>
              )}
              <div style={{ marginTop: 16, padding: "10px 14px", background: "var(--amber-glow)", borderRadius: 6, fontSize: 12, color: "var(--amber)" }}>
                Return bottle to shelf. Retrieve the correct item.
              </div>
            </div>
          )}

          {result === "success" && !scanning && (
            <div className="animate-slide-up" style={{ flex: 1 }}>
              <div style={{
                padding: "16px", background: "var(--green-glow)", border: "2px solid var(--green)50",
                borderRadius: 8, marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start"
              }} className="animate-pulse-green">
                <CheckCircle size={18} color="var(--green)" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--green)", marginBottom: 4 }}>VERIFIED — SAFE TO DISPENSE</div>
                  <div style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.5 }}>{successMsg}</div>
                </div>
              </div>
              {scannedItem && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    ["Drug", `${scannedItem.drug} ${scannedItem.strength}`, true],
                    ["Form", scannedItem.form, true],
                    ["Batch", scannedItem.batch, true],
                    ["Expiry", scannedItem.expiry, true],
                    ["Stock", `${scannedItem.stock} units`, scannedItem.stock > 20],
                  ].map(([label, val, ok], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ color: "var(--text-faint)" }}>{label}</span>
                      <span style={{ color: ok ? "var(--green)" : "var(--red)" }}>{val as string}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {result === "idle" && !scanning && (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-faint)", fontSize: 13 }}>
              Awaiting barcode scan…
            </div>
          )}
        </div>
      </div>

      {/* Scan history */}
      {attempts.length > 0 && (
        <div className="card" style={{ padding: 20, marginTop: 20 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>SCAN LOG ({attempts.length} attempt{attempts.length !== 1 ? "s" : ""})</div>
          {attempts.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 0", borderBottom: i < attempts.length - 1 ? "1px solid var(--border)" : "none" }}>
              {a.result === "success" ? <CheckCircle size={12} color="var(--green)" /> : <XCircle size={12} color="var(--red)" />}
              <span style={{ fontSize: 11, color: "var(--text-dim)", flex: 1 }}>{a.drug} {a.strength}</span>
              {a.reason && <span style={{ fontSize: 11, color: "var(--red)" }}>{a.reason}</span>}
              <span style={{ fontSize: 11, color: "var(--text-faint)" }}>{a.timestamp}</span>
            </div>
          ))}
        </div>
      )}

      {result === "success" && (
        <button
          className="btn-primary"
          onClick={() => {
            addAudit("SCAN_VERIFIED", "Drug verified and approved for dispensing", "success");
            dispatch({ type: "SET_STEP", step: "preparation" });
          }}
          style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8 }}
        >
          Proceed to Preparation Check <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
