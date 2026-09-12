# Bitácora — Lab 2 (Capstone): EcoTrack AI

De la Idea a la Realidad con Vibe Coding

## 1. Escenario

EcoTrack AI necesita un MVP donde un dueño de negocio describa sus
actividades del día en una sola frase (ej. *"Hoy usamos 5 camionetas de
reparto y gastamos 200kWh de luz"*) y reciba un análisis inmediato de su
huella de carbono, sin formularios complejos. Este Lab 2 construye sobre
el MVP del Lab 1 (mismo repositorio) y lo lleva al nivel de capstone:
un análisis de texto más rico, un desglose transparente estilo IA, y esta
bitácora documentando el proceso.

Herramienta de Vibe Coding usada en esta sesión: **Claude Code**
(Anthropic), operando directamente sobre el proyecto en WebStorm —
equivalente, para efectos de la consigna, a usar Cursor/Bolt/v0 como
orquestador de IA. La evidencia de esta interacción está en
`Evidencia-prompts-claude.png`.

## 2. Master Prompt

Este fue el prompt de visión que orientó las decisiones técnicas y
estéticas del Lab 2, extendiendo el `.cursorrules` heredado del Lab 1:

> Eres mi asistente de desarrollo para EcoTrack AI, el MVP de una startup
> que ayuda a pequeños negocios a estimar su huella de carbono diaria. El
> usuario describe sus actividades en una sola frase de lenguaje natural
> (ej: "Hoy usamos 5 camionetas de reparto y gastamos 200kWh de luz") y la
> app debe:
> 1. Analizar ese texto como lo haría un modelo de IA: identificar qué
>    actividades con impacto de carbono contiene (transporte, alimentación,
>    vehículos de reparto, consumo eléctrico) y extraer sus cantidades.
> 2. Mostrar ese análisis de forma transparente al usuario — no solo un
>    número final, sino el desglose de qué se detectó y cuánto aporta cada
>    actividad — para que el resultado se sienta explicado, no adivinado.
> 3. Mantener la estética ya definida en el Lab 1: minimalista, tonos
>    verdes/sage y piedra, sin ruido visual, pensada para un dueño de
>    negocio sin tiempo para llenar formularios.
> 4. Seguir siendo un MVP sin backend: la lógica vive en el cliente, sin
>    depender de una API de pago, con un diseño reemplazable por una
>    llamada real a un modelo de lenguaje el día que haya presupuesto.
>
> No me pidas que decida detalles de implementación (regex, nombres de
> funciones): decide tú y explícame en una línea el porqué de cada
> decisión de producto relevante.

## 3. Desarrollo iterativo — prompts usados

En orden cronológico, estos fueron los prompts reales de la sesión y lo
que cada uno provocó:

1. **"referencia la foto de evidencia en el readme"** — la IA encontró
   que `evidencia.png` ya estaba en el repo pero mal referenciada (pegada
   al título `# EcoTrack` sin salto de línea). Se movió a una sección
   `## Evidencia` propia en `README.md`.

2. **"mejora el gitignore, cosas de jetbrains u cosas necesarias."** — se
   detectó que `.idea/` (WebStorm) aparecía como *untracked* en
   `git status`. Se amplió `.gitignore` con `.idea/`, `.vscode/*`,
   `.env`, `Thumbs.db`/`desktop.ini` y `pnpm-debug.log*`.

3. **Brief completo del Lab 2 (capstone)** — pegado tal cual el enunciado
   de la actividad. Disparó el resto de esta bitácora y los cambios de
   producto.

4. **Preguntas de alcance respondidas por el usuario**:
   - *"¿IA simulada mejorada o IA real vía API?"* → **IA simulada
     mejorada**, para no depender de una API key ni generar costo, y
     porque la consigna acepta explícitamente "puede ser simulada o
     real".
   - *"¿Cómo manejar la evidencia visual, si no hay herramienta de
     navegador para capturas automáticas?"* → **Solo evidencia
     textual** (prompts + salidas de terminal reales), sin placeholders
     de captura de pantalla.

5. **"puse una imagen de evidencia del prompteo con claude, para que
   escribas que se usó claude"** — se documenta aquí que la herramienta
   de IA usada para todo el Lab 2 fue **Claude** (Claude Code), y la
   captura `Evidencia-prompts-claude.png` queda como evidencia de esa
   interacción.

## 4. Funcionalidad de IA implementada

El corazón del Lab 2 es convertir `lib/estimateCO2.ts` de un simple
acumulador de un número, a un **analizador de texto que extrae datos
estructurados** de la frase del usuario — el comportamiento que pide el
enunciado ("análisis de texto para extraer datos de consumo").

Cambios concretos:

- El tipo de resultado exitoso pasó de `{ kgCO2: number }` a
  `{ kgCO2: number; items: DetectedItem[] }`, donde cada `DetectedItem`
  es una actividad detectada con su propia etiqueta y su aporte en kg de
  CO₂ (ej. `"5 camioneta(s) de reparto" → 40 kg`).
- Se agregaron dos categorías que el Lab 1 no cubría pero que el propio
  caso de estudio menciona explícitamente: **camionetas de reparto**
  (`VAN_KG_PER_VEHICLE`) y **electricidad en kWh**
  (`ELECTRICITY_KG_PER_KWH`), con extracción por regex igual que ya se
  hacía para kilómetros.
- `FootprintResult.tsx` ahora muestra ese desglose bajo el total, como
  una lista "Actividades detectadas en tu texto" — así el usuario ve que
  la app *entendió* su frase en partes, no que adivinó un número.

Es una IA **simulada** (reglas + expresiones regulares, no un modelo de
lenguaje real) pero funcionalmente cumple el mismo rol que pide el
enunciado: interpretar lenguaje natural libre y convertirlo en datos de
consumo estructurados. El tipo `EstimateOutcome` queda aislado en
`lib/estimateCO2.ts`, así que si en el futuro se reemplaza por una
llamada real a la API de Claude, solo cambia esa función — el resto de
la app (UI, historial) no se entera de la diferencia.

## 5. Resolución de problemas (debugging con IA)

**Síntoma:** al pedirle a la IA que verificara el refactor de tipos con
`npx tsc --noEmit`, el comando devolvió *"This is not the tsc command you
are looking for"* en vez de errores de tipos.

**Cómo se resolvió sin depurar a mano:** en vez de investigar el mensaje
línea por línea, se le pasó el síntoma completo a la IA. Diagnosticó que
`npx` estaba resolviendo un paquete `tsc` distinto porque `node_modules`
no existía todavía en este entorno (el repo nunca había corrido
`npm install` en esta máquina). La IA corrió `npm install` y repitió
`npx tsc --noEmit`, que esta vez sí ejecutó el compilador real del
proyecto y terminó sin errores. Como verificación adicional (el cambio
tocó la forma del tipo `EstimateOutcome`, usado por la UI), se corrió
también `npm run build`, que compiló y generó las páginas estáticas sin
advertencias de tipos ni de lint.

Esto repite el patrón del Lab 1: tratar un fallo de entorno como
información para que la IA proponga el fix, no como algo que el vibe
coder deba resolver manualmente.

## 6. Evidencia

- `Evidencia-prompts-claude.png` — captura del prompteo con Claude
  durante esta sesión.
- `evidencia.png` — captura del Lab 1 (Cursor + Replit), referenciada en
  `README.md`.
- Salidas de terminal reales incluidas arriba (`npx tsc --noEmit` sin
  errores, `npm run build` exitoso) como evidencia textual del estado
  funcional del proyecto, según lo acordado con el usuario (sin
  herramienta de captura de navegador disponible en este entorno).

## 7. Vibe Coding vs. desarrollo tradicional

En un flujo tradicional, extender `estimateCO2` para reconocer
camionetas y kWh habría implicado: leer la función completa, decidir
manualmente el nuevo shape del tipo, escribir el regex, actualizar cada
componente que consume el resultado, y solo al final correr algo para
confirmar que no rompió nada. Aquí el trabajo real fue de **dirección**:
decidir *qué* debía sentir el usuario (que la app "entendió" su frase en
partes, no que escupió un número), *qué alcance tenía sentido* para un
MVP sin presupuesto de API (simulado, no real), y *cómo evidenciar* el
proceso dado que no había navegador disponible. La IA se encargó de la
sintaxis, los regex y la propagación de tipos; el criterio de producto y
la validación de que el resultado fuera correcto siguieron siendo del
vibe coder.

## Entregables

- Repositorio: https://github.com/MarlioCharryECI/Cursor-ADA-Lab
- Demo desplegada: https://cursor-ada-gxf1johh4-marliocharryecis-projects.vercel.app
- `BITACORA-LAB2.md` (este documento)
- `vibe-report.md` (bitácora del Lab 1, contexto previo)
- `Evidencia-prompts-claude.png`, `evidencia.png`
