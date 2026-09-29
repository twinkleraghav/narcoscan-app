# NarcoScan AI — SIH 2026 Presentation & Prototype Alignment Guide

**Team:** ElevateX_  
**Problem Statement:** SIH26231 (NCB / Ministry of Home Affairs)  
**System:** NarcoScan AI — Optical Presumptive Drug Testing & Digital Chain-of-Custody Engine  
**Local Prototype URL:** `http://localhost:5173/`

---

## 1. Slide-by-Slide Presentation Alignment

| Slide | Presentation Topic & Feature | Implementation in Working Prototype | Location in App |
|---|---|---|---|
| **Slide 1** | **Problem & Operational Reality**<br>Field subjectivity, lighting variation, adulterated samples, legal admissibility challenges. | Restrained institutional forensic UI (`#F6F7F5`, `#285943`, `JetBrains Mono`), clear presumptive disclaimer, CIELAB colour metrics. | Global layout, [App.tsx](file:///c:/Users/LENOVO/OneDrive/Desktop/durg%20detection/narcoscan-app/src/App.tsx), [Dashboard.tsx](file:///c:/Users/LENOVO/OneDrive/Desktop/durg%20detection/narcoscan-app/src/pages/Dashboard.tsx) |
| **Slide 2** | **Guided SOP & Safety Workflow**<br>Mandatory hazard PPE alerts (Fentanyl dermal absorption, corrosive acids, gloves/mask protocols). | **Reagent Hazard Advisory Banner** appears dynamically upon reagent selection with explicit safety PPE warnings before test initiation. | [NewTest.tsx (Step 1)](file:///c:/Users/LENOVO/OneDrive/Desktop/durg%20detection/narcoscan-app/src/pages/NewTest.tsx#L341-L370), [reagents.ts](file:///c:/Users/LENOVO/OneDrive/Desktop/durg%20detection/narcoscan-app/src/data/reagents.ts) |
| **Slide 3** | **Reaction Kinetic Timing**<br>Spot chemical reactions have kinetic windows (15s–60s) before over-oxidation or degradation. | **Interactive Reaction Kinetic Stopwatch** with live countdown, progress bar, audio/visual completion alert, and calibrated capture trigger. | [NewTest.tsx (Step 2)](file:///c:/Users/LENOVO/OneDrive/Desktop/durg%20detection/narcoscan-app/src/pages/NewTest.tsx#L415-L480) |
| **Slide 4** | **Optical Normalization**<br>Illumination compensation via passive reference target cards (ArUco marker #42, CIELAB ΔE < 1.2). | **Calibration Target Badge** (`Passive Calibration Card Detected (ArUco #42) • CIELAB ΔE Normalized`) on image analysis. | [NewTest.tsx (Step 2 & 4)](file:///c:/Users/LENOVO/OneDrive/Desktop/durg%20detection/narcoscan-app/src/pages/NewTest.tsx#L529-L534) |
| **Slide 5** | **Secondary Confirmatory Protocol**<br>Inconclusive / adulterated samples must not be discarded; mandatory secondary orthogonal screening (NCB SI 1/88). | **Mandatory Secondary Confirmatory Protocol Banner** displays automatically on Inconclusive findings with specific reagent pairing (e.g. Marquis → Simon's/Mandelin). | [NewTest.tsx (Step 4)](file:///c:/Users/LENOVO/OneDrive/Desktop/durg%20detection/narcoscan-app/src/pages/NewTest.tsx#L632-L658) |
| **Slide 6** | **Digital Chain-of-Custody & Court Admissibility**<br>Compliance with **Section 63 Bharatiya Sakshya Adhiniyam (BSA), 2023** and **Section 52A NDPS Act, 1985**. | **Digital Seizure Docket & Certificate** containing FIPS 180-4 SHA-256 hash, hardware GPS fix (`28.6139° N, 77.2090° E`), statutory attestation, and one-click PDF print export. | [NewTest.tsx (Step 4)](file:///c:/Users/LENOVO/OneDrive/Desktop/durg%20detection/narcoscan-app/src/pages/NewTest.tsx#L740-L835), [History.tsx](file:///c:/Users/LENOVO/OneDrive/Desktop/durg%20detection/narcoscan-app/src/pages/History.tsx#L120-L195) |

---

## 2. Walkthrough Guide for Hackathon Judges & Evaluators

### Step 1: Initiating a Guided Field Test
1. Navigate to **New Field Test** (`http://localhost:5173/new-test`).
2. Point out the **Hardware GPS Lock** tag (`28.6139° N, 77.2090° E`) at the bottom of the Location input.
3. Select **Marquis Reagent** or **Froehde Reagent**:
   - Highlight the **Hazard Alert Banner**:  
     *"HAZARD WARNING: Contains concentrated Sulfuric Acid (98%). Potential synthetic opioid/Fentanyl hazard. Nitrile gloves and N95/FFP2 respirator mandatory."*
   - Highlight the **Kinetic Development Time** estimate (`~30 seconds`).
4. Enter Case details (e.g., `CASE-2026-SIH01`, `OFC-NCB-88`, `Cargo Terminal 3, IGI Airport`) and click **Continue**.

### Step 2: Reaction Kinetic Stopwatch & Calibrated Capture
1. Explain to the judges: *"Judges in court often challenge chemical presumptive tests because officers read them too early or too late after over-oxidation. NarcoScan introduces an SOP kinetic timer."*
2. Click **Start Timer** — watch the countdown progress from 30s to 0s.
3. When complete, the badge turns green: *"✓ Peak Reaction Window Reached — Ready for Calibrated Capture"*.
4. Upload or select a reaction image (using the pre-generated test images or sample generator).
5. Point out the **Passive Calibration Card Detected (ArUco #42)** verification badge on the preview.
6. Click **Analyze Reaction**.

### Step 3: CIELAB Optical Extraction Pipeline
1. Watch the 4-step forensic pipeline execute in real-time:
   - Reading image data
   - Extracting colour features
   - Converting to CIELAB colour space (L\*, a\*, b\*, Chroma, Hue)
   - Evaluating presumptive decision rules

### Step 4: Digital Seizure Docket & Statutory Certificate
1. Review the result:
   - If **Positive**: Shows clear drug class indication, CIELAB metrics, and orthogonal cross-validation advisory.
   - If **Inconclusive**: Demonstrates the **Mandatory Secondary Confirmatory Protocol (NCB SI 1/88)** banner instructing the officer on exact next steps (e.g., run Simon's or Mandelin reagent).
2. Click **Save Evidence Record**.
3. Point out the **Digital Seizure Docket & Chain-of-Custody Certificate**:
   - **Statutory Authority:** *Section 63 Bharatiya Sakshya Adhiniyam, 2023 & Section 52A NDPS Act, 1985*
   - **Hardware GPS Fix:** Exact geo-tagging at the moment of seizure.
   - **Cryptographic Digest:** 256-bit SHA-256 hash ensuring zero post-seizure data manipulation.
   - **Digital Attestation Clause:** Legal declaration conforming to Indian forensic standards.
4. Click **Print / Export Legal Docket (PDF)**:
   - The application automatically invokes the print stylesheet, formatting the docket into an official, clean, monochrome court seizure form ready for submission to the Judicial Magistrate under Section 52A NDPS Act.

---

## 3. Key Legal & Technical Talking Points for Q&A

1. **Why Section 63 BSA 2023 instead of Section 65B Indian Evidence Act?**  
   *The Bharatiya Sakshya Adhiniyam (BSA), 2023 completely repealed and replaced the Indian Evidence Act of 1872 on July 1, 2024. Section 63 of BSA 2023 governs electronic records and digital certificates in Indian courts.*

2. **How does the system eliminate false positives from ambient lighting?**  
   *Through passive colour matrix calibration cards placed in the field of view. The system normalizes RGB sensor readings into device-independent CIELAB space using ΔE CIE2000 calculations.*

3. **Does NarcoScan claim to replace the Forensic Science Laboratory (FSL)?**  
   *No. As clearly stated in the application's disclaimers and dockets, NarcoScan is a field presumptive decision-support and chain-of-custody engine. It enforces standardized field testing, prevents arbitrary arrests, and guarantees legal integrity of digital evidence submitted under Section 52A NDPS Act.*
