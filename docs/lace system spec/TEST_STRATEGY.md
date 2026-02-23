# LACE MVP — Test Strategy (TDD from day one)

## Goals
- Code that **runs** and produces deterministic outputs (to the extent possible).
- Fast feedback: most tests should be unit tests.
- End-to-end confidence with golden fixtures.

---

## 1) Testing layers

### 1.1 Unit tests (majority)
Test each Step in isolation using fakes/mocks:
- ArtifactStore fake (in-memory)
- RunStore fake (Postgres temp or in-memory)
- LLMCall mocked (returns fixed LLMResponse JSON)

Examples:
- DeterministicApply:
  - applies `set_node_content` correctly
  - rejects action with missing node_id
  - emits correct ChangeEvent with before/after hashes
- ValidateLLMResponse:
  - accepts valid JSON schema
  - rejects invalid schema and returns `SCHEMA_INVALID`

### 1.2 Integration tests (pipeline)
Run the full pipeline with:
- a small sample ArtifactIR fixture
- mocked LLM response
Assert:
- pipeline succeeds
- IR updated
- compiled markdown matches expected output

### 1.3 Golden tests (artifact correctness)
Store expected outputs under `tests/golden/`.
- `artifact_ir_before.json`
- `llm_response_valid.json`
- `artifact_ir_after.json`
- `compiled.md`

Golden tests should compare:
- normalized JSON (stable ordering)
- markdown exactly (or with normalized whitespace rules)

---

## 2) Determinism rules for tests
- CI/unit/integration tests never call live LLM.
- Optional manual e2e acceptance tests may call live LLM behind explicit env flags.
- Record prompts + responses in fixtures.
- Hashing:
  - canonicalize JSON before hashing
  - stable ordering for dicts/lists where applicable

---

## 3) “Definition of Done” for each new step
- Step has:
  - unit tests (happy path + error path)
  - input/output type names defined
  - idempotency key behavior tested
- Pipeline integration test updated if step is wired into MVP pipeline.

---

## 4) First test cases to write (recommended order)
1) PipelineDefinition parsing + ref resolution
2) ArtifactStore (put/get; content addressing)
3) RunStore (PipelineRun + StepRun lifecycle)
4) ValidateLLMResponse schema gate
5) DeterministicApply (core correctness)
6) Compiler Markdown (simple compile)
7) End-to-end pipeline integration test
