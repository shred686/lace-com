



You said:
help me plan the initial UI for LACE.

Funcitonal requirements, non-functional requirements.

User stories

etc

Let's iterate through this

ChatGPT said:

Thought for a couple of seconds
Awesome—let’s treat the initial LACE UI like an MVP “control room” for the engine you already designed: outline/tree, node-level generation, diffs, provenance, validation, export. Everything else is nice-to-have later. 
lace_architecture_and_schemas_v…


Below is a v0 UI plan with: functional reqs, non-functional reqs, core screens, user stories, and an iteration plan.

1) UI MVP goals
Primary user outcomes (v0):

Create an artifact from a prompt + optional sources.

See a structured outline (tree of nodes).

Generate/regenerate a node (and see progress streaming).

Review what changed (diff), accept/reject.

See validation results (term drift, requirement/CompetencySpec checks).

Export to Markdown + DOCX.

Everything in your architecture supports this cleanly: recursive IR, block patching, provenance, validation, compilation. 
lace_architecture_and_schemas_v…


2) Core screens (v0 information architecture)
A. Artifact Dashboard (list)
“New artifact” CTA

List of artifacts with: status, last run, last modified, type (proposal/spec/etc), validation status

B. Artifact Workspace (main working screen)
A 3-pane layout:

Left: Outline Tree

Node title, status (empty/outlined/generated/edited/needs-review), validation badge

Actions per node: Generate, Regenerate, Expand, Lock, Add child, Rename

Center: Node Editor / Viewer

Render node content (block-based)

“Edit mode” (manual edits) with block-level editing

Block metadata toggles (created by run X, last modified, locked)

Right: Inspector (tabbed)

Run / Provenance: prompt, context summary, sources used, model, token stats

Constraints: inherited + local overrides

Terminology: terms used + drift flags

Validation: checks + evidence

Dependencies: parent/dependency summaries, required nodes

C. Run Console (drawer or bottom panel)
Live streaming logs/events (step-by-step pipeline)

“Stop run”

“View run details”

D. Diff & Review Modal
Before/after diff at block level (and optionally text diff within a block)

Accept/Reject changes

“Accept selected blocks” (later), but in v0 at least accept/reject node patch

E. Export Screen (or button)
Export MD / DOCX

Show compile status + errors

3) Functional requirements (v0)
3.1 Artifact lifecycle
FR-1 Create artifact (type, title, prompt, optional profiles)

FR-2 Upload inputs (docs) and attach to artifact

FR-3 View artifact metadata (type, profiles, requirements, run history)

FR-4 Versioning: artifact has versions / change events

3.2 Outline & navigation
FR-5 View outline tree (nodes, statuses)

FR-6 Add / delete / move nodes (basic outline editing)

FR-7 Node status model visible in UI (outlined/generated/edited/etc.)

3.3 Generation controls
FR-8 Trigger generate/regenerate/expand at node level

FR-9 Show streaming progress (events: ContextBuilder → Strategy → Apply → Validate)

FR-10 Handle propose_split action: show “New children proposed” review step before apply (or apply + mark needs-review)

3.4 Content editing + deterministic patching integration
FR-11 View node content as blocks

FR-12 Manual edit blocks (and mark “user-edited” for conservative regen protection)

FR-13 Show “pending changes” from LLM as patches before committing (or commit then diff—either is fine, but you need a review surface)

3.5 Provenance & audit
FR-14 For any node: view prompt history, context summary, sources used, model settings

FR-15 For any block: show created_by_run, modified_by_run, timestamps

FR-16 Link each patch/change to a ChangeEvent with before/after hashes (visible in UI as history)

3.6 Terminology + requirements
FR-17 View terminology registry entries relevant to node; flag drift

FR-18 View CompetencySpecs status, evidence, target nodes

3.7 Validation
FR-19 Run validation for node or entire artifact

FR-20 Display validation results with “go to offending node” navigation

3.8 Compilation/export
FR-21 Compile artifact to Markdown + DOCX

FR-22 Show compile errors and where they occurred

(Those directly map to your engine modules: IR Store, ContextBuilder, Strategy, Apply, Validation, Compiler. 
lace_architecture_and_schemas_v…

)

4) Non-functional requirements (v0)
4.1 Performance & responsiveness
NFR-1 Outline navigation < 200ms UI response for typical artifacts (hundreds of nodes)

NFR-2 Streaming updates feel “live” (new event appended within ~1s of receipt)

NFR-3 Large node content renders progressively (virtualize big blocks)

4.2 Reliability & recovery
NFR-4 Runs are resumable / at least safely fail with an error state + logs

NFR-5 Idempotent UI actions (double-click “Generate” doesn’t create two runs)

4.3 Auditability
NFR-6 Every user action + engine apply creates immutable ChangeEvent

NFR-7 Run inputs (prompt/context/settings) are persisted and viewable

4.4 Security
NFR-8 AuthN/AuthZ (even if simple): user can only access their artifacts

NFR-9 Uploaded docs are access-controlled and not exposed via guessable URLs

4.5 UX consistency
NFR-10 Clear status system and language (“needs review”, “validated”, “drift detected”)

NFR-11 Keyboard-friendly navigation (tree + editor basics)

5) User stories (MVP set)
Persona A: “Operator” (power user generating docs)
Create artifact: As an operator, I want to create an artifact with a prompt + example docs so LACE can match structure/style.

See outline: I want to see the generated outline as a tree so I can spot missing sections.

Generate a section: I want to generate a specific node so I can work incrementally.

Regenerate safely: I want conservative regen that preserves my edited blocks.

Review changes: I want a diff view so I can accept/reject patches confidently.

Validate: I want to run validation so I can catch drift/requirement misses early.

Export: I want to export to DOCX so I can send a professional deliverable.

Persona B: “Reviewer” (non-technical stakeholder)
As a reviewer, I want to read the artifact in a clean viewer without seeing engine complexity.

As a reviewer, I want to see “why this claim exists” (provenance summary) to build trust.

As a reviewer, I want a simple list of validation issues and where to go fix them.

Persona C: “Builder” (you/dev team debugging pipeline)
As a builder, I want to watch run events live to debug where quality fails.

As a builder, I want to open run details (prompt/context/strategy output) to reproduce issues.

6) Data model the UI should assume (thin contract)
You already have the right primitives; the UI just needs stable endpoints returning:

Artifact (metadata, profiles, requirements)

Node tree (node_id, parent_id, title, status, children, validation badge)

Node content (blocks + block meta)

Runs (run_id, status, started/ended, model, operation, target_node_id)

Run events stream (timestamp, step, message, progress)

ChangeEvents (before/after hashes, actions applied)

Validation results (by node, by check)

Compile jobs (status, output links)

This matches the Canonical IR + Apply + Validation + Compiler design. 
lace_architecture_and_schemas_v…


7) Iteration plan (how we iterate next)
Iteration 0 — “Control room skeleton”
Artifact list + create

Workspace layout (Tree / Node / Inspector)

Fake data wired to components (no backend integration)

Iteration 1 — “Node generation loop”
Generate/regenerate buttons

Run console with streaming events (WebSocket)

Basic diff modal (before/after)

Iteration 2 — “Trust & correctness”
Provenance tab (prompt/context/sources)

Validation tab (term drift + competency checks)

Manual edit + lock semantics

Iteration 3 — “Export”
Compile + download MD/DOCX

Error display

8) What I suggest we do next (pick one and I’ll draft it immediately)
Full UI spec doc (PRD-style) with screens, components, and acceptance criteria, or

Route map + component list for a Next.js + shadcn UI, or

Wire-level API contract (REST + WS events) that the UI will call.

If you want the fastest path: we do (2) + (3) first so implementation is unblocked.


Sources

You said:
let's do 1

ChatGPT said:
Cool — here’s (1) a PRD-style UI spec for the initial LACE UI (v0 / “Control Room”). This is written so you can drop it into the repo as docs/ui/PRD_LACE_UI_v0.md.

LACE UI v0 PRD — Control Room
0. Document control
Version: v0.1

Owner: (you)

Audience: product + engineering

Goal: define the first usable UI that lets a pilot user generate, review, validate, and export long-form artifacts with LACE.

1. Problem statement
LLMs can generate long documents, but users can’t reliably:

control where generation happens (node-level targeting),

see what changed (diff / patch review),

trust claims (provenance),

prevent regressions (validation + lock semantics),

export something professional (DOCX) without manual cleanup.

LACE’s engine solves the pipeline problem; this UI solves the human control + trust problem.

2. Goals and non-goals
2.1 Goals (v0)
Artifact creation: prompt + attach sources.

Outline-first navigation: work at node level (tree).

Generate / Regenerate nodes with streaming progress.

Review & accept changes via diffs (node/block).

Inspect provenance (prompt history, context, sources) per node.

Run validation and display actionable issues.

Export to Markdown + DOCX.

2.2 Non-goals (explicitly out of scope for v0)
Multi-user real-time collaboration (Google Docs style)

Advanced workflow approvals / roles / commenting

Automatic citations/footnotes formatting

Full WYSIWYG Word-like editor (keep it block editor + markdown-ish)

“Claim-level provenance hover” (we’ll design hooks, implement later)

Complex template library marketplace / multiple artifact templates

Deep retrieval configuration UI (basic attach + select is enough)

3. Personas
P1: Operator (power user)
Builds drafts quickly, iterates sections, wants control over regen + diffs.

P2: Reviewer (semi-technical exec / stakeholder)
Reads output, checks trust, wants “why should I believe this” without seeing guts.

P3: Builder (you/dev team)
Debugs pipeline runs, needs visibility into runs, events, failures.

4. Functional requirements
4.1 Artifact lifecycle
FR-A1 Create artifact with:

title

artifact type (proposal/report/manual/other)

prompt (required)

optional “style exemplar” docs (optional)

optional profile presets (tone, audience, constraints)

FR-A2 Artifact list/dashboard:

show artifacts with status, last run date, last validation status

open artifact workspace

FR-A3 Artifact settings:

edit title

manage attached sources

view global constraints (read-only in v0 is acceptable)

Acceptance criteria:

user can create artifact in < 60 seconds

artifact appears in dashboard immediately

4.2 Source management
FR-S1 Upload and attach sources:

PDF/DOCX/TXT (whatever your ingestion supports now)

show filename, type, size, uploaded timestamp

FR-S2 Tag sources:

reference/context

target/exemplar (style/format reference)

FR-S3 Source viewer (basic):

open doc preview (simple, not full annotation tooling)

Acceptance criteria:

user can attach ≥ 10 docs without UI breaking

user can distinguish exemplar vs reference sources

4.3 Outline tree (node graph)
FR-T1 Show outline as tree:

node title

node status badge

validation badge (pass/warn/fail)

“has pending changes” badge

FR-T2 Outline editing:

add node (sibling/child)

rename node

reorder nodes (drag/drop)

delete node (confirm)

lock node (prevents regen overwrite; see §6)

FR-T3 Node navigation:

selecting node loads node content and inspector

Acceptance criteria:

tree renders smoothly up to ~500 nodes (virtualized if needed)

reorder + rename persist instantly in UI and backend

4.4 Node content view + editing
FR-C1 Node content renderer:

display content in blocks

support headings, lists, tables (render markdown)

show inline block boundaries on hover

FR-C2 Edit mode:

user can edit content directly (block editor)

mark blocks as “user edited”

FR-C3 Block actions (v0 minimal):

split block

delete block

lock block (optional v0; node lock may be enough)

Acceptance criteria:

edits are autosaved

edited blocks are flagged visually

4.5 Generation controls + streaming run status
FR-G1 Generate node:

button: Generate (if empty) / Regenerate (if exists)

optional options: “conservative”, “aggressive” (v0 can default)

FR-G2 Show run in progress:

live streaming events with steps (e.g., Context → Plan → Generate → Apply → Validate)

progress indicator + status text

stop/cancel run

FR-G3 Run history (per artifact):

list last N runs with status (succeeded/failed/canceled), target node, timestamp

open run details

Acceptance criteria:

user sees first event within 1 second of run start

cancel stops further changes and marks run canceled

4.6 Diff & change review
FR-D1 After generation, show diff:

before/after at node level

highlight changed blocks

allow accept/reject changes

FR-D2 Apply semantics:

Accept: commit patch to node blocks

Reject: discard patch and keep old content

FR-D3 “Pending changes” indicator:

nodes with unreviewed changes show badge in tree

Acceptance criteria:

user can always recover “previous version” of node after accept (via history)

diff view is readable for multi-page sections (block-level diff first)

4.7 Provenance inspection (trust surface)
FR-P1 Node inspector “Provenance” tab shows:

prompt used for this node

context summary (what was fed in)

source IDs / filenames used

model + settings

run ID + timestamps

FR-P2 Prompt history:

show prior prompts used for the node in previous runs

Acceptance criteria:

user can answer “where did this come from?” for a node in < 10 seconds

4.8 Validation and issue navigation
FR-V1 Run validation:

validate current node

validate whole artifact

FR-V2 Display results:

list of checks with pass/warn/fail

per issue: node link, short description, severity, suggested fix (if available)

FR-V3 Navigate to issue location:

clicking issue selects node and scrolls to affected block (best effort)

Acceptance criteria:

a failed check always links to a node

user can clear an issue by regenerating or editing and re-validating

4.9 Compilation & export
FR-X1 Compile artifact to:

Markdown

DOCX

FR-X2 Export UI:

compile status

download outputs

show compile errors with affected nodes

Acceptance criteria:

exports are reproducible (same inputs + same version -> same output)

if compile fails, UI shows a helpful error and where

5. Non-functional requirements
5.1 Performance
NFR-P1 Tree interaction < 200ms perceived delay

NFR-P2 Streaming events appended within ~1s

NFR-P3 Node content render supports “big” nodes (virtualize blocks when needed)

5.2 Reliability & recovery
NFR-R1 UI safe for refresh (state rehydrates from backend)

NFR-R2 Idempotent actions (double-click generate doesn’t create 2 runs)

NFR-R3 Run failures are visible with logs + actionable message

5.3 Auditability
NFR-A1 Every apply produces a change event (who/what/when/run_id)

NFR-A2 Users can view node version history and restore prior version (v0 can be “restore whole node”)

5.4 Security
NFR-S1 Auth required (basic is fine)

NFR-S2 Artifact/doc access controlled per user/tenant

NFR-S3 No guessable direct doc URLs (signed URLs or proxied)

5.5 UX
NFR-U1 Clear status system + consistent labels

NFR-U2 Minimal cognitive load: “Tree (where) + Content (what) + Inspector (why)”

6. UX rules and semantics (critical)
6.1 Node statuses (single source of truth)
EMPTY: no content yet

GENERATED: content exists and matches last accepted patch

EDITED: user edited content after last generation

PENDING_REVIEW: generation produced changes not yet accepted

LOCKED: node cannot be overwritten by regen (must unlock)

ERROR: last run failed affecting this node

UI must show these as badges (color + text).

6.2 Lock semantics (v0)
Locking a node prevents auto-apply changes to it.

If user tries to regenerate a locked node:

show warning and require unlock OR allow “generate as proposal” without applying.

6.3 Conservative regen (v0 default)
If node contains user-edited blocks, regen should:

avoid overwriting those blocks by default

propose changes via diff for user acceptance

(You can implement more later; UI must assume safe-by-default.)

7. Screen specifications
7.1 Dashboard
Components:

Artifact table/list

New Artifact button

Status badges

Actions:

Create artifact

Open artifact

Duplicate artifact (optional v0)

Empty state:

“Create your first artifact”

7.2 New Artifact flow
Fields:

Title

Type dropdown

Prompt textarea

Upload sources (drag/drop)

Source classification: “Reference” vs “Exemplar”

Create button

Success:

route to workspace with initial outline step (if applicable)

7.3 Workspace (primary)
Layout:

Left: Outline tree

Center: Node viewer/editor

Right: Inspector (tabs)

Bottom drawer: Run console (collapsible)

Top bar:

artifact title

“Validate” dropdown (node/all)

“Export” button

“Run history” button

7.4 Diff & Review modal
Header:

Node name, run id, timestamp

Body:

Block-level diff list

Expand a block to see text diff (optional)

Accept / Reject

Footer:

“Accept changes”

“Reject changes”

“Keep but mark needs review” (optional)

7.5 Run details
Shows:

run metadata

timeline of events

prompt + context summary (read-only)

errors (if any)

8. User stories + acceptance criteria (condensed)
US-1 Create artifact
Given I’m on dashboard
When I create an artifact with prompt + sources
Then I land in workspace and can begin outline and generation.

US-2 Generate node
Given I select a node
When I click Generate
Then I see streaming progress and a diff upon completion.

US-3 Review changes
Given a diff is shown
When I accept
Then the node updates and shows GENERATED/EDITED status accordingly.

US-4 Explain origin
Given I’m reading content
When I open Provenance tab
Then I can see prompt/context/sources used.

US-5 Fix validation issues
Given validation shows an issue
When I click it
Then the correct node is selected and highlighted.

US-6 Export
Given artifact is ready
When I export to DOCX
Then I can download the file and it matches the outline order.

9. Analytics / telemetry (v0)
Track:

time-to-first-draft (create → first exported doc)

regen attempts per node

reject rate on patches

most common validation failures

run failure causes (from run events)

10. Risks & mitigations
Diff fatigue (users overwhelmed)
→ block-level diff first, collapse details, “accept all” allowed.

Run confusion (what is happening?)
→ explicit step timeline in console; “current step” always visible.

Accidental overwrite
→ conservative regen default + lock semantics + required review.

Big artifacts slow UI
→ virtualize tree + blocks; lazy-load nodes.

11. MVP milestones (what “done” means)
Milestone M0: Shell
dashboard + workspace layout

fake data wired

Milestone M1: Real generation loop
generate/regenerate triggers backend

WS streaming console

diff accept/reject

Milestone M2: Trust surface
provenance tab (prompt/context/sources)

run history + details

Milestone M3: Validation + export
validation UI

compile/export MD + DOCX

“Pilot-ready” = M3.

12. Implementation notes (for engineering)
Use a single “workspace” route with lazy-loaded panels.

Use WebSocket for run events; REST for everything else.

Normalize state around artifact_id, node_id, run_id.

UI should treat “apply patch” as the only way content changes (except manual edits).

Store draft manual edits immediately as blocks so diffs remain meaningful.

If you want, next iteration I can produce the actual UI route map + component spec (shadcn components, state store layout, event types, and a thin REST/WS contract) directly aligned to this PRD so engineering can start without guessing.


You said:
ok great yes

ChatGPT said:
Perfect — here’s the route map + component spec + state/store layout + WebSocket event types + thin REST contract aligned to the PRD. You can paste this into docs/ui/UI_Spec_LACE_v0.md.

LACE UI v0 — Routes, Components, State, API Contract
1) Route map (Next.js App Router)
Public / auth (minimal)
/login (optional if you’re using external auth / reverse proxy)

App
/ → redirect to /artifacts

/artifacts

Artifact dashboard list + “New Artifact”

/artifacts/new

New artifact wizard (prompt + upload + doc tags)

/artifacts/[artifactId]

Workspace (tree + editor + inspector + run console)

/artifacts/[artifactId]/runs

Run history list (filter by node/status)

/artifacts/[artifactId]/runs/[runId]

Run details timeline + prompt/context + errors

/artifacts/[artifactId]/export

Export/compile screen (or modal from workspace)

v0 can collapse runs/export into modals inside workspace if you want fewer routes.

2) Top-level UI layout + key components
2.1 Pages
ArtifactsDashboardPage
<ArtifactList />

<NewArtifactButton />

NewArtifactPage
<NewArtifactForm />

<SourceUploadDropzone />

<SourceListEditable /> (tag as Reference/Exemplar)

WorkspacePage
Layout: 3-pane + bottom drawer

Top bar

<ArtifactTitle />

<ValidateButton /> (node / whole artifact)

<ExportButton />

<RunHistoryButton />

Left pane

<OutlineTree />

Center

<NodeHeader /> (title, status, generate controls)

<NodeBlockEditor /> (view + edit)

Right pane

<InspectorTabs />

Bottom drawer

<RunConsole /> (streaming events)

RunHistoryPage
<RunTable /> (filters: status, node, date)

RunDetailsPage
<RunTimeline />

<RunMetadataPanel />

<RunPayloadViewer /> (prompt/context summaries)

<RunErrorPanel />

3) Component spec (props + responsibilities)
3.1 Artifact list / creation
ArtifactList

Props: artifacts: ArtifactSummary[]

Shows: title, status, last_run, validation badge

Actions: open artifact, duplicate (optional v0), delete (optional v0)

NewArtifactForm

Fields: title, type, prompt

Hooks: onSubmit(CreateArtifactRequest)

Integrations: upload sources before/after create (see API below)

SourceUploadDropzone

Props: artifactId?

Events: onUploadComplete(SourceDocument[])

Shows upload progress + failures

SourceListEditable

Props: sources: SourceDocument[]

Allows toggling role: "reference" | "exemplar"

3.2 Outline tree
OutlineTree

Props: tree: NodeTree, selectedNodeId, callbacks

Features:

select node

drag/drop reorder (v0)

context menu: add child/sibling, rename, delete, lock

UI signals:

node status badge

pending review badge

validation badge

NodeTreeItem

Props: node: NodeSummary

Minimal visual language: status chips + icons

3.3 Node editor / blocks
NodeHeader

Props: node: NodeSummary, runState?

Actions:

Generate / Regenerate

Lock toggle

“View diff” if pending changes

Shows: status, last run, validation badge

NodeBlockEditor

Props: blocks: Block[], mode: view|edit

v0 editing:

inline editing per block

mark block.user_edited = true on save

block toolbar: split, delete (lock optional)

Emits:

onUpdateBlocks(BlockPatch) (manual edit patch)

BlockRenderer

Supports: markdown headings/lists/tables (rendered)

Optional: show block boundary + metadata on hover

3.4 Inspector tabs (right pane)
InspectorTabs tabs:

Provenance

<ProvenancePanel nodeId />

Constraints

<ConstraintsPanel nodeId />

Terminology

<TerminologyPanel nodeId />

Validation

<ValidationPanel nodeId />

Dependencies

<DependenciesPanel nodeId />

ProvenancePanel shows:

latest run prompt

context summary

sources used

model/settings

prompt history list

ValidationPanel

list issues (pass/warn/fail)

click issue → navigate node + scroll to block if possible

3.5 Run console + diff
RunConsole

Props: activeRunId?, events: RunEvent[]

Features:

live append events

show current step + progress

stop/cancel button

DiffReviewModal

Props: nodeId, runId, before: Block[], after: Block[]

Actions: accept, reject

Shows: block-level diff list; expand block for text diff

4) UI state model (store layout)
Use Zustand, Redux Toolkit, or TanStack Query + local reducer. v0 suggestion:

TanStack Query for server state

Zustand for UI state (selection, modals, drawer open)

4.1 Server state (normalized)
artifact[artifactId]

sourcesByArtifact[artifactId]

treeByArtifact[artifactId]

nodeContent[nodeId] = { blocks, version, lastChangeEventId }

runsByArtifact[artifactId]

runDetails[runId]

validationByArtifact[artifactId]

validationByNode[nodeId]

4.2 UI state
type UIState = {
  selectedArtifactId?: string
  selectedNodeId?: string
  inspectorTab: "provenance"|"constraints"|"terminology"|"validation"|"dependencies"
  runConsoleOpen: boolean
  activeRunId?: string
  diffModal: { open: boolean; nodeId?: string; runId?: string }
  toasts: Toast[]
}
4.3 Derived selectors (important)
selectedNodeStatus

nodesWithPendingReview

latestRunForNode(nodeId)

validationBadgeForNode(nodeId)

isNodeLocked(nodeId)

5) WebSocket contract (streaming run events)
Single WS per artifact or per run. Easiest v0:

connect to artifact stream and filter by runId client-side.

5.1 WS endpoints
WS /ws/artifacts/{artifactId}

server pushes run events for that artifact

5.2 Event envelope
{
  "type": "run.event",
  "artifact_id": "A",
  "run_id": "R",
  "node_id": "N",
  "ts": "2026-02-17T23:12:34.123Z",
  "seq": 42,
  "payload": { }
}
5.3 Required event types (v0)
Run lifecycle
run.started

run.step.started

run.step.progress

run.step.completed

run.completed

run.failed

run.canceled

Patch / apply (critical for UI correctness)
node.patch.proposed
Payload includes patch summary + pointers to diff resources

node.patch.applied

node.patch.rejected (if server supports server-side reject)

Validation
validation.started

validation.completed (summary + counts)

validation.issue (optional streaming issues)

Compilation
compile.started

compile.completed

compile.failed

5.4 Step names (string enum)
Keep stable strings for UX:

context_build

planner

strategy_select

generate

apply_patch

validate

compile

5.5 Progress payload (example)
{
  "type": "run.step.progress",
  "payload": {
    "step": "generate",
    "message": "Generating section draft…",
    "pct": 0.35,
    "tokens_in": 12000,
    "tokens_out": 1400
  }
}
6) REST API contract (thin + UI-driven)
Base: /api/v1

6.1 Artifacts
GET /artifacts

Returns ArtifactSummary[]

POST /artifacts

Body:

{
  "title": "Healthcare Proposal",
  "type": "proposal",
  "prompt": "Draft a modernization proposal…",
  "profiles": { "tone": "executive", "audience": "CIO" }
}
Returns: Artifact

GET /artifacts/{artifactId}

Returns: Artifact (metadata + settings)

PATCH /artifacts/{artifactId}

Update title/settings

6.2 Sources
POST /artifacts/{artifactId}/sources (multipart upload)

Returns: SourceDocument[]

GET /artifacts/{artifactId}/sources

Returns list

PATCH /sources/{sourceId}

Body: { "role": "reference" | "exemplar" }

GET /sources/{sourceId}/content

Either streamed preview or signed URL token; v0 can be “download”

6.3 Outline tree
GET /artifacts/{artifactId}/tree

Returns:

{
  "root_id": "N0",
  "nodes": [
    { "id":"N0","parent_id":null,"title":"…","status":"GENERATED","locked":false,"children":["N1"] }
  ]
}
POST /artifacts/{artifactId}/nodes

Create node (child/sibling)

{ "parent_id":"N1", "title":"New Section", "position": 2 }
PATCH /nodes/{nodeId}

Rename / lock / move

{ "title":"Scope", "locked": true }
POST /nodes/{nodeId}/move

{ "new_parent_id":"N2", "position": 0 }
DELETE /nodes/{nodeId}

6.4 Node content + manual edits
GET /nodes/{nodeId}/content

Returns:

{ "node_id":"N", "version": 12, "blocks":[ ... ], "last_change_event_id":"CE123" }
PATCH /nodes/{nodeId}/content

Manual edit patch (block ops)

{
  "base_version": 12,
  "ops": [
    { "op":"update_block", "block_id":"B3", "content":"…", "user_edited": true }
  ]
}
Returns updated {version, blocks}

6.5 Runs (generate/regenerate/validate/compile)
POST /nodes/{nodeId}/runs

Body:

{ "operation": "generate", "mode": "conservative" }
Returns:

{ "run_id":"R", "status":"started" }
GET /artifacts/{artifactId}/runs

Returns RunSummary[]

GET /runs/{runId}

Returns details: step timeline, prompt/context summaries, errors

POST /runs/{runId}/cancel

6.6 Patch review / diff resources
Two workable patterns:

Pattern A (recommended): server stores patch as “proposed” until user accepts
GET /runs/{runId}/diff

Returns { before_blocks, after_blocks, summary }

POST /runs/{runId}/accept

Applies patch → emits WS node.patch.applied

POST /runs/{runId}/reject

Discards patch → emits WS node.patch.rejected

Pattern B: server auto-applies, UI can “restore previous”
Less ideal for trust; I’d avoid for pilots.

6.7 Validation
POST /artifacts/{artifactId}/validate

Body: { "scope":"artifact" }

Returns { validation_run_id } (or a normal run)

POST /nodes/{nodeId}/validate

Body: { "scope":"node" }

GET /artifacts/{artifactId}/validation

Summary + issues grouped by node

6.8 Export / compile
POST /artifacts/{artifactId}/compile

Body: { "formats":["md","docx"] }

Returns { compile_id } (or a run)

GET /compiles/{compileId}

Status + links

GET /compiles/{compileId}/download?format=docx

7) Minimal types (UI-facing)
7.1 Node status enum
EMPTY | GENERATED | EDITED | PENDING_REVIEW | LOCKED | ERROR

7.2 Block shape (v0)
type Block = {
  id: string
  kind: "markdown" | "table" | "figure" | "code" // keep small in v0
  content: string
  user_edited?: boolean
  locked?: boolean
  meta?: {
    created_by_run_id?: string
    modified_by_run_id?: string
    created_at?: string
    modified_at?: string
  }
}
7.3 Run summary
type RunSummary = {
  id: string
  artifact_id: string
  node_id?: string
  operation: "generate"|"regenerate"|"validate"|"compile"
  status: "queued"|"started"|"succeeded"|"failed"|"canceled"
  started_at: string
  ended_at?: string
}
8) UX mechanics that matter for engineering
8.1 “Generate” button behavior
If node is EMPTY: label “Generate”

Else: label “Regenerate”

If LOCKED: disable with tooltip or route to “Generate as proposal (no apply)”

8.2 Pending review UX
When server emits node.patch.proposed, node becomes PENDING_REVIEW

Tree shows badge

Center panel shows “Review changes” CTA

8.3 Manual edits
Any edit sets node status EDITED (unless pending review)

Conservative regen should preserve user-edited blocks by default (engine-side), but UI must always flag them.

9) Build order (fastest implementation path)
Workspace shell + tree selection + node content fetch

Run start + WS console + run history

Diff modal + accept/reject endpoints

Provenance tab (from run details)

Validation tab + issue navigation

Compile/export

If you want, next iteration I can write:

a shadcn component inventory (exact components + layouts),

a typed TS client skeleton (api.ts) matching these endpoints,

and a WS hook (useArtifactStream) that normalizes events into the store.



