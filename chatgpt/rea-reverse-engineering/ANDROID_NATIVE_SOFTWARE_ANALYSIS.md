---
name: rea-android-native-software-analysis
description: Analyze Android packages, native binaries, and software behavior using evidence-driven REA workflows. Use for APK/DEX/manifest/resources/signatures, ELF/PE/Mach-O/shared libraries, disassembly/decompilation, and application architecture or runtime tracing.
---

# Android, native binaries, and software analysis

This additional ChatGPT-facing workflow supplements, and does not replace, any of the five original REA skills. For REA-specific commands, provider requirements, output fields, and edge cases, consult the original `reverse-engineer-anything` skill and the technical references.

## 1. Intake and triage

Collect only the details needed to choose a reliable route: target file/path or supplied report; platform and version; artifact type and architecture/ABI; user's question; authorization and static-only constraints; available tools/provider versions; and whether the target may be modified.

Record SHA-256 where possible. Preserve the original input and analyze a copy. Do not execute an unknown binary merely to identify it.

## 2. Android packages

### Static APK triage

1. Inventory the archive and record package identity, version, ABI splits, file sizes, and hashes.
2. Decode the manifest and record package name, min/target SDK, permissions, application flags, declared components, intent filters, providers, metadata, and network/security configuration when available.
3. Inspect DEX files for packages, classes, methods, strings, references, and call paths. Treat JADX output as decompiled interpretation; cross-check key behavior against Smali/DEX when accuracy matters.
4. Inspect resources separately: XML, string tables, layouts, assets, locales, and resource references.
5. Inspect signing information (v1/v2/v3/v3.1 as supported), signer certificates, fingerprints, rotation data, and digest self-consistency. A valid signature does not establish a trusted publisher.
6. Identify frameworks and native payloads: Flutter/Dart snapshots, React Native bundles, Unity/IL2CPP metadata, JNI libraries, and ABI-specific `.so` files.
7. Report unsupported or unresolved resources, placeholders, truncated inventories, and manifest limitations.

### Dynamic Android investigation

Use only an authorized emulator/device. State whether steps may install, launch, modify, or remove an app. Capture logs, screenshots, process data, or network observations only within scope. Keep static declarations separate from runtime state. Do not disable security controls or bypass app protections as a default diagnostic step.

### Tool boundaries

REA's documented Android package workflow uses a caller-supplied full JDK 17+ and pinned headless JADX engine; verify its digest in the source repository's Android guide. Resource decoding through Apktool is separate. Device inspection requires caller-supplied ADB. JEB requires a separately started JEB client and its documented MCP endpoint. These are not interchangeable and are not automatically installed by REA. Check the actual REA server tool catalog and version before invoking any operation.

## 3. Native binaries and shared libraries

1. Identify the file format (ELF, PE, Mach-O, WASM, firmware, or other), CPU architecture, bitness, endianness, ABI, and build identity.
2. Inspect headers, sections/segments, imports/exports, symbols, relocations, strings, notes, certificates, and dependencies.
3. Establish load addresses and relocation rules before interpreting addresses. Preserve the distinction between file offsets, virtual addresses, and runtime addresses.
4. Select a documented provider appropriate to the target: Ghidra, IDA, Hopper, or Kuna. Use static objdump/Rizin or format-specific parsers only when documented and available.
5. Trace functions through callers, callees, cross-references, control flow, data flow, constants, and relevant structures. Validate decompiler output against disassembly and ABI/calling-convention facts.
6. For runtime behavior, select an explicitly documented launch/attach/trace workflow. Static inspection alone cannot establish execution or dynamic values.
7. For crashes, distinguish a recorded dump from a live process; preserve thread, register, signal, mapping, and symbolization uncertainty.

## 4. Software behavior and architecture

For source-less or packaged applications, establish package boundaries and identify the application layer versus bootloader/runtime/framework code. Map modules, imports, exports, routes, IPC boundaries, native add-ons, dependencies, configuration, and data stores.

For browser or network evidence, distinguish saved captures from live observation; do not fetch URLs contained in a capture unless separately authorized. For managed code, separate metadata/CIL from native code and note when NativeAOT changes the analysis route. For firmware, identify regions and extraction boundaries; extraction writes to a caller-selected output directory and may have side effects. For process behavior, record exact launch context, inputs, interactions, exit status, filesystem observations, and cleanup.

## 5. Evidence and confidence

Classify conclusions as **Observed** (directly present in a file/result/log/instruction/manifest/capture), **Inferred** (supported by multiple observations), **Hypothesis** (requires a test), or **Unknown** (unavailable due to tool, format, access, coverage, or truncation limits).

Keep evidence linked to its source artifact and revision. Include offsets, addresses, method/class names, record ordinals, or line references. Preserve complete Evidence when available; a summary projection is not a replacement for the original. Empty search results mean only that no match was found in the examined scope.

## 6. Safe reconstruction

For feature reproduction: write a behavior contract; identify evidence versus assumptions; implement independently from behavior descriptions rather than copying proprietary implementation or secrets; add normal, boundary, malformed, failure, and compatibility tests; and compare only with authorized test artifacts and stated coverage.

Do not provide instructions for unauthorized access, credential extraction, stealth, persistence, evasion, or malware deployment. Decline that part and offer benign analysis or defensive alternatives.

## 7. Report

Use: target and scope; artifact identity; tools/prerequisites; method; evidence-backed findings; behavior/architecture trace; limitations; confidence; and next verification. Never present decompiler output, guessed symbols, or static indicators as confirmed runtime facts.
