# Research Intelligence Workflow

> Purpose: This file documents the publication-intelligence workflow used to crawl, enrich, classify, and report VinUniversity / CHS publication data.  
> Place this file in: `public/assets/workflows/research-intelligence/README.md` or `public/assets/research-intelligence/README.md`.

---

## 1. Overview

This workflow builds a lightweight publication-intelligence database for VinUniversity and CHS using Scopus, Crossref, OpenAlex, PubMed, SCImago/SJR, and optional SDG/collaboration mapping.

The main output is an Excel workbook used as a structured database:

```text
VinUni_Publication_DB.xlsx
```

The workflow is written in R and organized as modular scripts:

```text
00_config.R
01_af_monthly_ingest.R
02_chs_author_historical_ingest.R
03_report.R
04_run_all.R
05_sdg_mapping.R
06_collaboration_mapping.R
dim_flag.csv
```

---

## 2. Recommended folder structure

```text
public/
└── assets/
    └── workflows/
        └── research-intelligence/
            ├── README.md
            ├── workflow-overview.png
            ├── scripts/
            │   ├── 00_config.R
            │   ├── 01_af_monthly_ingest.R
            │   ├── 02_chs_author_historical_ingest.R
            │   ├── 03_report.R
            │   ├── 04_run_all.R
            │   ├── 05_sdg_mapping.R
            │   └── 06_collaboration_mapping.R
            ├── screenshots/
            │   ├── dashboard-overview.png
            │   ├── publication-tracker.png
            │   ├── sdg-mapping.png
            │   └── collaboration-map.png
            ├── outputs/
            │   ├── VinUni_Publication_DB_sample.xlsx
            │   └── dim_flag.csv
            └── notes/
                ├── data-dictionary.md
                ├── api-notes.md
                └── maintenance-log.md
```

If the public website should not expose raw scripts, keep only screenshots and this README under `public/`, and store the actual R scripts in a private repository.

---

## 3. Workflow summary

### Script 00 — Shared configuration and helpers

```text
00_config.R
```

Role:

- Stores global constants such as VinUniversity Scopus Affiliation ID.
- Loads API keys from environment variables.
- Defines shared helper functions for Scopus, Crossref, OpenAlex, SJR, Excel writing, date cleaning, ISSN normalization, and academic-year calculation.
- Prevents Excel write errors by truncating long cell values before export.
- Provides quota-checking utilities for Elsevier APIs.

Main helper groups:

```text
Core utilities
Academic-year helpers
ISSN normalization
Crossref publication-date retrieval
Scopus Search API
Scopus Abstract Retrieval
OpenAlex enrichment
SJR yearly matching
Excel workbook helpers
```

Important security note:

Do not hard-code API keys in this file. Use environment variables instead:

```r
Sys.setenv(Elsevier_API = "your_key_here")
Sys.setenv(ELS_INSTTOKEN = "your_institution_token_here")
Sys.setenv(OPENALEX_MAILTO = "your.email@institution.edu")
```

Recommended public website wording:

> Shared R configuration file that standardizes API access, date parsing, metadata enrichment, SJR matching, Excel output safety, and reusable functions across the publication-intelligence pipeline.

---

### Script 01 — VinUniversity affiliation-based monthly ingest

```text
01_af_monthly_ingest.R
```

Role:

- Crawls Scopus Search API using VinUniversity Affiliation ID:

```text
AF-ID(60251038)
```

- Retrieves VinUniversity publications at institutional level.
- Adds only new EIDs to the database.
- Refreshes dynamic fields for existing records, especially citation count.
- Enriches new records with:
  - Crossref publication date
  - OpenAlex author and institutional information
  - Scopus affiliation and country information
  - SJR metrics and journal quartiles
  - Academic year

Main output sheets:

```text
vinuni_work
dim_sjr_year
state
```

Recommended website wording:

> Institutional Scopus crawler that tracks VinUniversity publications by affiliation ID, enriches records with Crossref/OpenAlex/SJR metadata, and maintains an incremental Excel-based publication database.

---

### Script 02 — CHS author historical ingest

```text
02_chs_author_historical_ingest.R
```

Role:

- Reads CHS member information from:

```text
Member Information.csv
```

- Cleans names and Scopus Author IDs.
- Builds a person-to-author-ID mapping.
- Performs full historical crawl for new Scopus Author IDs.
- Performs recent refresh for existing authors from a defined date.
- Flags whether each publication is associated with:
  - CHS / VinUniversity
  - Vinmec
  - Other affiliations
- Adds publication dates, SJR fields, affiliation-country cache, and author-level crawl state.

Main output sheets:

```text
chs_info_clean
chs_author_ids_long
chs_author_state
chs_author_works
eid_country_cache
eid_country_long
eid_affiliation_long
chs_sjr_log
chs_state_run
chs_recent_refresh_log
chs_recent_refresh_author_log
```

Recommended website wording:

> Author-level crawler that links CHS faculty and researchers to Scopus Author IDs, retrieves historical and recent publications, and identifies CHS/VinUni/Vinmec-linked outputs using affiliation metadata.

---

### Script 03 — Non-CHS report

```text
03_report.R
```

Role:

- Compares institutional VinUniversity publications from `vinuni_work` with CHS author-level coverage from `chs_author_works`.
- Identifies VinUniversity papers not yet mapped to CHS authors.
- Extracts VinUni/Vinmec people appearing in those papers using OpenAlex author-affiliation display fields.
- Produces people-level and paper-level reports for data-cleaning and author-mapping review.

Main output objects/sheets:

```text
report_non_chs_papers
report_non_chs_long
report_non_chs_people
non_chs_area_long
non_chs_area_wide
```

Recommended website wording:

> Gap-analysis module that identifies VinUniversity publications not yet captured by the CHS author registry and supports manual correction of author mappings.

---

### Script 04 — One-click runner

```text
04_run_all.R
```

Role:

- Runs the full publication-intelligence pipeline in sequence.
- Checks Elsevier Search and Abstract Retrieval quota before execution.
- Switches to report-only mode when API quota is exhausted.
- Creates the database workbook if missing.
- Prints before/after row counts for major tables.
- Runs optional SDG and collaboration modules.

Default run order:

```text
00_config.R
01_af_monthly_ingest.R
02_chs_author_historical_ingest.R
03_report.R
05_sdg_mapping.R
06_collaboration_mapping.R
```

Recommended website wording:

> Orchestration script that runs the full publication-intelligence workflow, performs quota-aware execution, preserves existing database sheets, and logs pipeline-level row-count changes.

---

### Script 05 — SDG mapping

```text
05_sdg_mapping.R
```

Role:

- Runs SDG mapping only for distinct EIDs where `CHS_flag == 1`.
- Builds best available publication text using:
  - Scopus metadata
  - PubMed abstract and MeSH terms
  - Crossref metadata
  - OpenAlex abstract and keywords
- Uses staged `text2sdg` mapping:
  - Ensemble
  - Document-level systems
  - Feature-level explanation when needed
- Generates reviewable SDG classification results with confidence labels.

Main output sheets:

```text
chs_sdg_final
sdg_summary
sdg_state_run
```

Recommended website wording:

> SDG-classification module that enriches CHS publication text from multiple bibliographic sources and maps papers to Sustainable Development Goals using a staged, reviewable text2sdg pipeline.

---

### Script 06 — Collaboration mapping

```text
06_collaboration_mapping.R
```

Role:

- Maps institutional and international collaborations from CHS-linked publications.
- Uses OpenAlex and Scopus affiliation data where available.
- Produces affiliation-level and paper-level collaboration outputs.
- Supports collaboration dashboards, country maps, and institutional partnership analysis.

Expected output sheets:

```text
chs_collab_affiliation_long
chs_collab_paper
```

Recommended website wording:

> Collaboration-mapping module that converts publication affiliation metadata into institution- and country-level collaboration tables for dashboarding and strategic reporting.

---

### `dim_flag.csv`

Role:

- Creates a country-flag dimension table using ISO2 country codes.
- Generates flag URLs from:

```text
https://hatscripts.github.io/circle-flags/
```

Output columns:

```text
country_name
country_iso2
flag_url
```

Recommended website wording:

> Country-dimension helper table used to display country flags in publication and collaboration dashboards.

---

## 4. Database design

The Excel workbook functions as a lightweight relational database.

### Core institutional table

```text
vinuni_work
```

Typical fields:

```text
EID
DOI
Title
publication_name
source_id
cover_date_scopus
published_date_crossref
publication_date_used
pub_year
ingest_month
AY
cited_by
authors_openalex_display
institutions_display
affiliations_display
countries_affil
sjr
sjr_best_quartile
h_index
areas
categories
journal_country
journal_region
retrieved_at
```

### CHS author-level table

```text
chs_author_works
```

Typical fields:

```text
author_id
EID
DOI
Title
publication_name
publication_date_used
AY
CHS_flag
VinUni_flag
Vinmec_flag
CHS_flag_source
VinUni_flag_source
Vinmec_flag_source
cited_by
sjr
sjr_best_quartile
journal_country
journal_region
```

### Author registry tables

```text
chs_info_clean
chs_author_ids_long
chs_author_state
```

Purpose:

- Store cleaned CHS member names.
- Store one-to-many mapping between people and Scopus Author IDs.
- Track crawl state and refresh history.

### Enrichment and reporting tables

```text
dim_sjr_year
eid_country_cache
eid_country_long
eid_affiliation_long
report_non_chs_people
report_non_chs_long
chs_sdg_final
sdg_summary
chs_collab_affiliation_long
chs_collab_paper
```

---

## 5. Data flow

```text
CHS member list
      ↓
Clean names and Scopus Author IDs
      ↓
Scopus Author-ID crawl
      ↓
CHS author works table
      ↓
Crossref / OpenAlex / Scopus Abstract / SJR enrichment
      ↓
CHS flags, VinUni flags, Vinmec flags
      ↓
Reports, SDG mapping, collaboration mapping
```

Institution-level flow:

```text
VinUni Scopus AF-ID
      ↓
Institutional publication crawl
      ↓
Crossref / OpenAlex / SJR enrichment
      ↓
vinuni_work
      ↓
Compare with CHS author mapping
      ↓
Non-CHS gap report
```

---

## 6. Public website presentation

Suggested page title:

```text
Research Intelligence & Publication Analytics
```

Suggested short description:

> I developed a publication-intelligence workflow to track, enrich, and analyze VinUniversity and CHS research outputs using Scopus, Crossref, OpenAlex, PubMed, SJR, and SDG/collaboration mapping. The workflow supports institutional reporting, author-mapping quality control, publication dashboards, collaboration analysis, and strategic research monitoring.

Suggested card text:

```text
Research Intelligence Pipeline
R / Scopus API / Crossref / OpenAlex / PubMed / SJR / text2sdg / Excel DB

A modular R workflow for crawling institutional and author-level publication data, enriching metadata, mapping CHS/VinUni/Vinmec outputs, classifying SDGs, and preparing publication dashboards.
```

Suggested tags:

```text
R
Scopus API
OpenAlex
Crossref
PubMed
SJR
Publication Analytics
Research Intelligence
SDG Mapping
Collaboration Mapping
Bibliometrics
```

Suggested metrics to show on website:

```text
- Number of VinUniversity publications tracked
- Number of CHS-linked publications
- Number of CHS authors mapped
- Number of countries/institutions in collaboration network
- Number of SDG-mapped papers
- Q1/Q2 publication share
- Publications by academic year
```

---

## 7. What to show publicly and what to keep private

### Good to show publicly

```text
- Workflow diagram
- Dashboard screenshots
- General architecture
- Description of data sources
- Example output tables with synthetic or anonymized data
- Public-facing publication metrics
- SDG and collaboration visualizations
```

### Keep private

```text
- API keys
- Institution tokens
- Raw member information file
- Full internal author registry
- Unreviewed affiliation-matching reports
- Internal Excel database if it contains staff mapping or incomplete metadata
- Any file containing private notes, manual corrections, or institutional decision-making information
```

### Important security rule

Do not put raw API keys in a website repository or public GitHub repository. Store credentials in environment variables or `.Renviron`.

Recommended `.Renviron` pattern:

```text
Elsevier_API=your_elsevier_key
ELS_INSTTOKEN=your_elsevier_institution_token
OPENALEX_MAILTO=your.email@institution.edu
VINUNI_DB_XLSX=VinUni_Publication_DB.xlsx
SCOPUS_SLEEP=0.25
CROSSREF_SLEEP=0.15
OPENALEX_SLEEP=0.20
```

---

## 8. Suggested website section layout

### Section 1 — Problem

Tracking institutional research outputs is difficult when publication records are distributed across Scopus, Crossref, PubMed, OpenAlex, journal metadata, author profiles, and internal member lists.

### Section 2 — Solution

A modular R workflow was developed to integrate institutional Scopus crawling, CHS author-level mapping, metadata enrichment, SJR matching, SDG classification, and collaboration mapping into one maintainable database.

### Section 3 — Architecture

Show a workflow diagram:

```text
Scopus AF-ID + CHS Author IDs
        ↓
R crawler scripts
        ↓
Crossref / OpenAlex / PubMed / SJR enrichment
        ↓
Excel relational workbook
        ↓
Power BI / R Shiny / website dashboards
```

### Section 4 — Outputs

Show screenshots of:

```text
Publication tracker
SJR/Q-rank dashboard
SDG mapping table
Collaboration country map
Author-mapping gap report
```

### Section 5 — Technical stack

```text
R
httr
jsonlite
dplyr
tidyr
readxl
writexl
OpenAlex API
Crossref API
Elsevier Scopus API
PubMed E-utilities
SCImago/SJR export
text2sdg
Power BI / R Shiny
```

### Section 6 — Impact

Suggested wording:

> The workflow reduces manual tracking burden, improves publication-data completeness, supports CHS reporting, enables research-output dashboards, and provides reusable infrastructure for bibliometric, SDG, and collaboration analysis.

---

## 9. Maintenance checklist

Before running:

```text
[ ] Check `.Renviron` contains valid API keys.
[ ] Confirm `Member Information.csv` is updated.
[ ] Confirm SJR local files are available for required years.
[ ] Check Elsevier Search and Abstract Retrieval quota.
[ ] Back up `VinUni_Publication_DB.xlsx`.
```

After running:

```text
[ ] Check row counts in `vinuni_work`.
[ ] Check new rows appended.
[ ] Check `chs_author_works`.
[ ] Check missing SJR records.
[ ] Review non-CHS gap report.
[ ] Review SDG rows marked as `Review`.
[ ] Update dashboard screenshots if needed.
```

---

## 10. Claude Code prompt for website integration

```text
I have a Research Intelligence workflow documented in:
public/assets/workflows/research-intelligence/README.md

Please create a website project section called "Research Intelligence & Publication Analytics".

Use the README to build:
1. A concise project overview.
2. A workflow architecture diagram.
3. A technical-stack badge section.
4. A screenshot gallery.
5. A short impact section.
6. A "Methods / Pipeline" accordion explaining scripts 00 to 06.

Do not expose API keys, internal staff data, raw Excel databases, or private member information.
Use only public-safe descriptions and screenshots.
The tone should be academic, technical, and credible.
```
