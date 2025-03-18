---
'zustand-ards': major
---

Updated zustand-ards to support zustand 5

react >= 18, typescript >= 4.5, zustand >= 5.0.3, and use-sync-external-store >= 1.2.0 are now peer dependencies

To update your code import createWithEqualityFn from zustand/traditional instead of the original create function
