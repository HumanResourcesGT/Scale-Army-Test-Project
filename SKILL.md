---
name: scale-army-data-refresh
description: >
  Use this skill whenever a new Scale Army Excel or CSV file arrives and needs to be
  processed into clean, validated data ready for the dashboard. Triggers on phrases like
  "new data arrived", "process this week's file", "update with this xlsx", "refresh the
  data", or when the HR Manager uploads a new spreadsheet. Always use this skill before
  running scale-army-dashboard-update — it is step 1 of the weekly refresh workflow.
---

# Scale Army — Data Refresh Skill

Transforms a new weekly Scale Army Excel file (All Sales sheet) into a validated,
dashboard-ready JSON dataset. Always run this skill first, before updating the dashboard
or generating the monthly report.

---

## Input

A Scale Army Excel file (.xlsx) uploaded by the HR Manager.
Primary sheet: **All Sales**

---

## Step 1 — Read the file

Use the `file-reading` skill to open the xlsx. Read only the **All Sales** sheet.
Load all rows. Do not skip any columns.

Refer to `references/column_definitions.md` for the full column name list, expected
data types, and known quirks before proceeding.

---

## Step 2 — Validate

Check every row for the following. Log all issues — do not silently drop rows.

**Required fields (flag if missing):**
- `All Sales Talent` — talent name must not be null
- `All Sales Company` — client company must not be null
- `All Sales Status` — must be one of: Active, Lost, Buyout, Active "EOR", Lost "EOR"
- `All Sales Pod` — must match a known pod name (see pod list below)

**Date fields (flag if missing or unparseable):**
- `All Sales Start Date` — required for tenure calculation
- `All Sales End Date` — required for Lost/Buyout records; may be null for Active

**Known pod names (exact match required):**
- `Pod 1 - Revenue Drivers`
- `Pod 2  - Growth & Brand` ← note the double space, match exactly
- `Pod 3 - Product Builders`
- `Pod 4 - Bulk Hiring`

**Status normalisation:**
- `Active "EOR"` → treat as `Active` in all calculations
- `Lost "EOR"` → treat as `Lost` in all calculations

**After validation, report:**
- Total rows read
- Rows with missing start date (excluded from tenure calc)
- Rows with unknown pod (flag for HR review)
- Rows with unrecognised status (flag for HR review)

---

## Step 3 — Transform

Calculate the following for each row where data permits.

**Tenure (days):**
```
tenure_days = All Sales End Date − All Sales Start Date
```
Only calculate when both dates are present and status is Lost or Buyout.

**Tenure bucket:**
```
months = tenure_days / 30
0–3 months  → bucket = "0–3mo"
3–6 months  → bucket = "3–6mo"
6–12 months → bucket = "6–12mo"
12+ months  → bucket = "12mo+"
```

**Loss rate (per group):**
```
loss_rate = (Lost count / Total count) × 100
Round to 1 decimal place.
```

**Average tenure (per group, months):**
```
avg_tenure = mean(tenure_days for Lost records with valid dates) / 30
Round to 1 decimal place.
```

---

## Step 4 — Aggregate

Produce four aggregation groups: **by pod**, **by role**, **by recruiter**, and **overall**.

### By pod
For each of the four pods:
- `active` count
- `lost` count
- `buyout` count
- `total` count
- `lossRate` (%)
- `avgTenure` (months, Lost records only)
- `buckets` object: `{ "0–3mo": N, "3–6mo": N, "6–12mo": N, "12mo+": N }`

### By role (top 15 by exit count)
For each role (`All Sales Job`):
- `exits` count (Lost)
- `active` count
- `lossRate` (%)

### By recruiter (all recruiters with ≥ 10 total placements)
For each recruiter (`All Sales Recruiter`):
- `total` count
- `active`, `lost`, `buyout` counts
- `lossRate` (%)

### Overall summary
- Total placements
- Total active, lost, buyout
- Overall loss rate (%)
- Overall average tenure (months)

---

## Step 5 — Outlier check

After aggregating, apply these automatic flags:

| Condition | Flag |
|-----------|------|
| Any role with loss rate ≥ 90% | `"outlier": true` on that role |
| Any pod with loss rate ≥ 85% | `"highRisk": true` on that pod |
| Any recruiter with loss rate ≥ 85% AND total ≥ 20 | `"reviewNeeded": true` on that recruiter |

Always note in the output summary whether Bulk Hiring (Pod 4) is included or excluded
from the overall figures, since it can skew the aggregate significantly.

---

## Step 6 — Output

Return a JSON object with this structure:

```json
{
  "generatedAt": "YYYY-MM-DD",
  "sourceFile": "<filename>",
  "summary": {
    "totalPlacements": 0,
    "active": 0,
    "lost": 0,
    "buyout": 0,
    "overallLossRate": 0.0,
    "overallAvgTenureMonths": 0.0,
    "bulkHiringIncluded": true,
    "validationWarnings": []
  },
  "pods": [ /* one object per pod */ ],
  "roles": [ /* top 15 by exits */ ],
  "recruiters": [ /* all with >= 10 placements */ ]
}
```

Save the JSON as `data/scale_army_clean_YYYY-MM-DD.json`.

---

## Reference files

- `references/column_definitions.md` — full column list, types, and quirks
- Read this before Step 1 on every run.
