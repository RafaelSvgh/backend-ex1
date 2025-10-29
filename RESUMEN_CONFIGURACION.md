# 🎯 Resumen: Generador de Diagramas UML con OpenAI

## ✅ ¿Qué se ha configurado?

Se ha creado un endpoint que utiliza OpenAI para generar diagramas UML en formato JSON compatible con GoJS, siguiendo tus especificaciones exactas.

---

## 📍 Endpoint

```
POST http://localhost:3001/ai/ask
```

**Body:**
```json
{
  "question": "Tu descripción del diagrama UML aquí"
}
```

---

## 🎨 Especificaciones Implementadas

### ✅ Nombres de Clases
- Primera letra **SIEMPRE** en MAYÚSCULA
- Ejemplos: `Persona`, `Edificio`, `Usuario`

### ✅ Atributos
- **SIEMPRE** en minúscula
- **SIN** prefijos (+, -, #, ~)
- Formato: `nombreAtributo: tipo`
- Ejemplos: `nombre: String`, `edad: int`, `email: String`

### ✅ Multiplicidad
- **SOLO** puede ser `"1"` o `"*"`
- NO se usará: `"0..1"`, `"1..*"`, etc.

### ✅ Tipos de Links
1. **Composición** - Rombo negro (parte de)
2. **Agregación** - Rombo blanco (tiene un)
3. **Asociación** - Línea simple (relación)
4. **Generalización** - Flecha vacía (herencia)

---

## 📐 Reglas de Multiplicidad por Tipo de Relación

### Composición (el hijo pertenece al padre)
```
Aula es parte de Edificio
→ from=Aula, to=Edificio
→ fromMultiplicity="*", toMultiplicity="1"
```

### Agregación (el todo tiene partes)
```
Facultad tiene Estudiantes
→ from=Estudiante, to=Facultad
→ fromMultiplicity="*", toMultiplicity="1"
```

### Asociación (según cardinalidad)
```
1:N → fromMultiplicity="1", toMultiplicity="*"
N:1 → fromMultiplicity="*", toMultiplicity="1"
1:1 → fromMultiplicity="1", toMultiplicity="1"
N:N → fromMultiplicity="*", toMultiplicity="*"
```

### Herencia (siempre 1:1)
```
Auto hereda de Vehiculo
→ from=Auto, to=Vehiculo
→ fromMultiplicity="1", toMultiplicity="1"
```

---

## 🔧 Modelo de IA Configurado

**Actual:** `gpt-4o`
- Modelo más potente y reciente
- Mejor comprensión de contexto
- Generación precisa de JSON

Puedes cambiarlo en `src/modules/ai/ai.service.ts` línea ~106

---

## 📝 Formato de Salida Garantizado

```json
{
  "class": "GraphLinksModel",
  "nodeDataArray": [
    {
      "key": -1,
      "name": "Persona",
      "attribute": "nombre: String\nemail: String",
      "methods": "metodo1(): tipo",
      "loc": "-293.5 -168",
      "nodeType": "standard"
    }
  ],
  "linkDataArray": [
    {
      "from": -3,
      "to": -2,
      "fromMultiplicity": "*",
      "toMultiplicity": "1",
      "category": "composicion"
    }
  ]
}
```

---

## 📚 Documentación Creada

1. **`GUIA_UML_GOJS.md`**
   - Guía completa de uso
   - Tipos de relaciones
   - Reglas de formato
   - Consejos para mejores resultados

2. **`EJEMPLOS_UML_PETICIONES.md`**
   - 15 ejemplos listos para usar
   - Sistemas variados (e-commerce, hospital, universidad, etc.)
   - Tips para escribir preguntas efectivas

3. **`PRUEBA_RAPIDA.md`**
   - Comandos listos para copiar/pegar
   - Ejemplos con PowerShell, curl, y fetch
   - Cómo validar el JSON generado

4. **`MODELOS_OPENAI.md`**
   - Comparativa de modelos disponibles
   - Costos y recomendaciones
   - Parámetros ajustables

---

## 🧪 Prueba Rápida

### PowerShell:
```powershell
$body = @{
    question = "Genera un diagrama UML con: Cliente (nombre, email), Producto (nombre, precio). Un Cliente compra varios Productos (asociacion muchos a muchos)."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/ai/ask" -Method Post -Body $body -ContentType "application/json"
```

### curl:
```bash
curl -X POST http://localhost:3001/ai/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Genera un diagrama UML con: Cliente (nombre, email), Producto (nombre, precio). Un Cliente compra varios Productos (asociacion muchos a muchos)."}'
```

---

## 🎯 Contexto del Sistema Message

El contexto está configurado para:

✅ Generar **SOLO** JSON válido de GoJS
✅ Seguir **TODAS** tus reglas de formato
✅ Aplicar multiplicidad correctamente según tipo de relación
✅ Nombres de clase con mayúscula inicial
✅ Atributos en minúscula sin prefijos
✅ Llave foránea en el lado "muchos" (*)

---

## 🚀 Cómo Usar

1. **Asegúrate de tener tu API key en `.env`:**
   ```env
   OPENAI_API_KEY=sk-tu-api-key-aqui
   ```

2. **Inicia el servidor:**
   ```bash
   npm run start:dev
   ```

3. **Envía una petición:**
   ```json
   {
     "question": "Genera un diagrama UML con: [tu descripción]"
   }
   ```

4. **Recibe el JSON de GoJS:**
   ```json
   {
     "question": "...",
     "answer": "{ \"class\": \"GraphLinksModel\", ... }",
     "model": "gpt-4o",
     "usage": { ... }
   }
   ```

5. **Usa el JSON en tu aplicación GoJS**

---

## 💡 Tips para Mejores Resultados

### ✅ Buena pregunta:
```
"Genera un diagrama UML con: 
Usuario (username, email, password),
Publicacion (titulo, contenido, fecha).
Un Usuario crea varias Publicaciones (asociacion 1 a muchos)."
```

### ❌ Pregunta vaga:
```
"Haz un diagrama de usuario y publicaciones"
```

---

## 🔍 Validación

El JSON generado siempre cumplirá:

✅ Estructura `{ "class": "GraphLinksModel", ... }`
✅ `nodeDataArray` con clases bien formateadas
✅ `linkDataArray` con multiplicidad `"1"` o `"*"`
✅ Atributos en minúscula
✅ Nombres de clase con mayúscula
✅ JSON válido y parseable

---

## 📊 Archivos Modificados

```
src/
  modules/
    ai/
      ai.service.ts       ✅ Contexto configurado
      ai.controller.ts    ✅ Endpoint creado
      ai.module.ts        ✅ Módulo configurado
      dto/
        ask-question.dto.ts  ✅ Solo campo 'question'

config/
  envs.ts               ✅ OPENAI_API_KEY agregada

app.module.ts          ✅ AiModule importado

Documentación:
  GUIA_UML_GOJS.md              ✅ Guía completa
  EJEMPLOS_UML_PETICIONES.md    ✅ 15 ejemplos
  PRUEBA_RAPIDA.md              ✅ Comandos listos
  MODELOS_OPENAI.md             ✅ Info de modelos
```

---

## 🎉 ¡Todo Listo!

El sistema está completamente configurado y listo para generar diagramas UML en formato GoJS siguiendo exactamente tus especificaciones.

**Siguiente paso:** Prueba el endpoint con los ejemplos de `EJEMPLOS_UML_PETICIONES.md`
