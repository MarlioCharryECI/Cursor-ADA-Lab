## Vibe Report — EcoTrack

### Cómo configuré las reglas de mi agente

Antes de pedirle nada a la IA, escribí un archivo .cursorrules con el
contexto del proyecto (qué es EcoTrack, para quién, con qué stack) y con
reglas explícitas de cómo quería que trabajara conmigo: código modular,
sin "any" en TypeScript, y sobre todo una regla de comportamiento — que
si algo fallaba, la IA propusiera el fix en vez de pedirme que lo
depurara manualmente. Esa última regla resultó ser la más importante de
todo el laboratorio: cambió mi rol de "el que corrige errores" a "el que
decide si el fix tiene sentido".

### Qué dificultades encontré al delegar el código a la IA

Lo más difícil no fue el cálculo de CO2, fue el arranque del entorno.
El primer intento de scaffold falló porque create-next-app rechazó el
nombre de la carpeta Cursor-ADA-Lab (npm no acepta mayúsculas). En vez
de pelear con la CLI a mano, copié el error y pedí el ajuste: crear el
proyecto como ecotrack y moverlo a la raíz. Después PowerShell rechazó
el operador &&; otra vez pegué el síntoma y la IA cambió a ;. Esos dos
bloqueos me recordaron que orquestar también es tratar la configuración
como un error de producto, no como algo que yo tenga que googlear solo.

También me costó resistir la tentación de corregir código yo mismo cuando
veía un bug obvio. La mentalidad de Vibe Coding pide lo contrario:
describir el síntoma, no la solución, y dejar que la IA proponga el
cambio — aunque a veces mi versión mental del fix fuera más rápida de
teclear que de explicar.

### Cómo se siente pasar de "escribir código" a "orquestar una visión"

Se siente más parecido a dirigir que a programar. En vez de pensar en
sintaxis, pasé la mayoría del tiempo pensando en preguntas de producto:
¿qué actividades debería reconocer la app?, ¿qué pasa si el usuario no
menciona ninguna?, ¿el resultado se siente confiable o se siente
inventado? Esas son decisiones que ya sabía tomar antes de este curso —
lo nuevo fue aprender a describirlas con suficiente precisión para que
la IA las ejecutara bien a la primera.

Lo que más me sorprendió fue cuánto control seguí teniendo sin escribir
una sola línea a mano: cada iteración fue una decisión mía (qué
funcionaba, qué no encajaba con la visión), no algo que la IA decidiera
por su cuenta. Vibe Coding no elimina el criterio técnico — lo mueve de
"¿cómo lo implemento?" a "¿esto es correcto?".
