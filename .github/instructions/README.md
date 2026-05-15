# CholoBD Mobile — Instruction Files

Module-specific guidance for AI agents and developers. Each file activates automatically
when editing files that match its `applyTo` pattern.

The global rules in `../copilot-instructions.md` apply to all files (`applyTo: "**"`).
These module files take precedence over global rules within their scope.

---

## Index

| File | Scope (`applyTo`) |
|---|---|
| [auth/auth.instructions.md](auth/auth.instructions.md) | `src/app/(auth)/**`, `authSlice.ts`, auth hooks, `secureStore.ts`, auth validators/types |
| [explore/explore.instructions.md](explore/explore.instructions.md) | `src/app/(tabs)/explore/**`, explore components, hotel/booking hooks and services |
| [dashboard/dashboard.instructions.md](dashboard/dashboard.instructions.md) | `src/app/(tabs)/dashboard/**`, dashboard + service admin hooks and components |
| [tracking/tracking.instructions.md](tracking/tracking.instructions.md) | `src/app/(tabs)/tracking/**`, QR hooks, camera permission, QR service + types |
| [trip-planner/trip-planner.instructions.md](trip-planner/trip-planner.instructions.md) | `src/app/(tabs)/trip-planner/**`, `tripPlannerSlice.ts`, trip hooks, service, types, components |
| [tour-builder/tour-builder.instructions.md](tour-builder/tour-builder.instructions.md) | `src/app/(tour-builder)/**`, `tourBuilderSlice.ts`, tour builder hook, service, validators, types, components |
| [state-management/state-management.instructions.md](state-management/state-management.instructions.md) | `src/store/**` |
| [api-layer/api-layer.instructions.md](api-layer/api-layer.instructions.md) | `src/services/api/**`, `src/constants/api.ts`, `src/lib/secureStore.ts` |
| [ui-components/ui-components.instructions.md](ui-components/ui-components.instructions.md) | `src/components/ui/**`, `src/constants/theme.ts`, `tailwind.config.js` |
| [i18n/i18n.instructions.md](i18n/i18n.instructions.md) | `src/locales/**`, `src/lib/i18n.ts`, `src/constants/translationKeys.ts`, `src/providers/LanguageProvider.tsx` |
| [hooks/hooks.instructions.md](hooks/hooks.instructions.md) | `src/hooks/**` |
| [navigation/navigation.instructions.md](navigation/navigation.instructions.md) | `src/app/**/_layout.tsx`, `src/app/**/index.tsx` |
