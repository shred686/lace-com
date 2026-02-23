# LACE MVP — System Architecture Plan (v0.1)

## 1) Guiding principles
- **Deterministic core**: only the LLM is “creative”; everything else is schema-validated and reproducible.
- **IR-first**: all compilation targets come from the same Canonical IR.
- **Small orchestration**: in-process pipeline runner + persistence (no distributed framework in MVP).
- **Test-first**: every step has unit tests; every end-to-end pipeline has golden tests.

---

## 2) High-level component map

### 2.1 Generic pipeline runtime (engine-agnostic)
- PipelineLoader: loads YAML definitions
- StepRegistry: maps `type_id -> Step class`
- StepRunner: executes a step with retries/timeouts
- Orchestrator: resolves refs, runs steps in order (DAG later)
- NodeLockManager: node-level lock acquisition/release with TTL
- RunStore: persists PipelineRun + StepRun
- ArtifactStore: content-addressed blobs for inputs/outputs
- GateRunner: executes schema/domain validators per step
- Observability: structured logs + metrics per step

### 2.2 LACE domain package (LACE-specific)
- IRStore: reads/writes ArtifactIR
- IR migration registry hook: migrate stored payloads to latest in `load_ir`
- ContextBuilder step
- StrategySelector step
- LLMCall step
- ValidateLLMResponse step (JSON schema)
- DeterministicApply step
- ValidationLayer step
- Compiler step (Markdown; DOCX optional)
- CompilerRegistry: target->compiler plugin mapping (`md`, `docx`, `owl`)
- LLM ProviderRegistry: provider-neutral adapters (`openai`, `anthropic`, ...)

---

## 3) MVP repo layout (suggested)

```
lace/
  pyproject.toml
  README.md
  docs/
    PURPOSE_SPECS_MVP.md
    SCHEMAS_CONTRACTS.md
    ARCHITECTURE_PLAN.md
    TEST_STRATEGY.md
  src/lace/
    __init__.py
    cli.py

    pipeline/
      definition.py      # parse/validate PipelineDefinition
      runtime.py         # orchestrator + runner
      registry.py        # StepRegistry
      stores.py          # RunStore + ArtifactStore (Postgres + files)
      gates.py           # GateRunner
      types.py           # StepContext, StepResult, StepError

    domain/
      ir.py              # ArtifactIR model + helpers
      steps/
        load_artifact.py
        resolve_constraints.py
        context_builder.py
        strategy_selector.py
        llm_call.py
        validate_llm.py
        deterministic_apply.py
        validate_artifact.py
        compiler_md.py
      validators/
        llm_response_schema.json

  pipelines/
    lace.GenerateNodeContentPipeline.yaml

tests/
  unit/
  integration/
  golden/
```

---

## 4) “GenerateNodeContentPipeline” (execution flow)
1. LoadArtifact (locks + returns IR + node ref)
2. ResolveConstraints
3. ContextBuilder -> StrategyInput
4. StrategySelector -> StrategyPlan
5. LLMCall -> LLMResponse (raw)
6. ValidateLLMResponse (JSON schema)
7. DeterministicApply -> updated IR + ChangeEvent
8. ValidationLayer -> ValidationReport
9. Compiler -> CompiledBundle (md)

---

## 5) Persistence approach (MVP)
- **RunStore**: filesystem-backed JSON records (MVP simplicity):
  - `.lace/runs/<run_id>.json` containing `pipeline_run` + `step_runs`
- **ArtifactStore**:
  - blobs in `./.lace/blobs/<sha256>`
  - metadata alongside blob metadata JSON
- **IR snapshots**:
  - store ArtifactIR as JSON under `.lace/artifacts/<artifact_id>.json`
  - keep historical run outputs in RunStore for replay/debug

This yields resumability: if the process dies, you can resume from persisted successful step outputs.

Lock runtime behavior:
- lock TTL is periodically heartbeated during active runs
- stale locks are recoverable via TTL expiry

IR evolution behavior:
- Artifact load path runs registered migrations before model parsing
- unknown migration paths fail fast

---

## 6) Extensibility (post-MVP)
- Add DAG execution + fan-out (module generation)
- Add “repair loop pipelines” on schema/validation failures
- Add ontology compiler + reasoner gates
- Add UI to visualize runs and diffs
