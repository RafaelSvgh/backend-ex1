# Módulo AI - OpenAI Integration

Este módulo proporciona integración con OpenAI para procesar preguntas y obtener respuestas inteligentes.

## Configuración

Agrega tu API key de OpenAI en el archivo `.env`:

```env
OPENAI_API_KEY=sk-tu-api-key-aqui
```

## Endpoint

### POST /ai/ask

Envía una pregunta de texto a OpenAI para generar diagramas UML en formato GoJS.

**Request Body:**
```json
{
  "question": "Genera un diagrama UML con: Cliente (nombre, email), Producto (nombre, precio). Un Cliente compra varios Productos (asociacion muchos a muchos)."
}
```

**Response:**
```json
{
  "question": "...",
  "answer": "{ \"class\": \"GraphLinksModel\", \"nodeDataArray\": [...], \"linkDataArray\": [...] }",
  "model": "gpt-4o",
  "usage": {
    "promptTokens": 450,
    "completionTokens": 280,
    "totalTokens": 730
  }
}
```

### POST /ai/analyze-image

Analiza una imagen con OpenAI Vision para generar diagramas UML si contiene estructuras relevantes.

**Request:** `multipart/form-data`
- `image` (archivo requerido): Imagen (JPEG, PNG, GIF, WebP, máx 20MB)
- `additionalContext` (texto opcional): Contexto sobre qué buscar en la imagen

**Response si hay diagrama:**
```json
{
  "imageAnalysis": "{ \"class\": \"GraphLinksModel\", \"nodeDataArray\": [...], \"linkDataArray\": [...] }",
  "model": "gpt-4o",
  "usage": {
    "promptTokens": 1250,
    "completionTokens": 420,
    "totalTokens": 1670
  }
}
```

**Response si no hay diagrama:**
```json
{
  "imageAnalysis": "La imagen no contiene un diagrama UML o estructura que pueda convertirse en un diagrama de clases.",
  "model": "gpt-4o",
  "usage": { ... }
}
```

## Parámetros

### Endpoint /ai/ask:
- `question` (requerido): Descripción del diagrama UML que deseas generar

### Endpoint /ai/analyze-image:
- `image` (requerido): Archivo de imagen a analizar
- `additionalContext` (opcional): Contexto sobre qué buscar o cómo interpretar la imagen

## Ejemplos de uso

### Ejemplo 1: Pregunta simple
```bash
curl -X POST http://localhost:3001/ai/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "¿Qué es NestJS?"
  }'
```

### Ejemplo 2: Análisis de código
```bash
curl -X POST http://localhost:3001/ai/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "¿Cómo funciona la inyección de dependencias en NestJS?"
  }'
```

### Ejemplo 3: Generación de código
```bash
curl -X POST http://localhost:3001/ai/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Genera un ejemplo de un guard personalizado en NestJS"
  }'
```

## Modelos disponibles

Por defecto se usa `gpt-4o-mini` (recomendado por su excelente relación calidad-precio).

Puedes cambiar el modelo en `src/modules/ai/ai.service.ts`:

### Modelos principales:
- **`gpt-4o-mini`** ⭐ - Mejor relación calidad/precio (RECOMENDADO)
- **`gpt-4o`** - Modelo más potente y reciente
- **`gpt-4-turbo`** - GPT-4 optimizado para velocidad
- **`gpt-4`** - GPT-4 estándar
- **`gpt-3.5-turbo`** - Económico y rápido

📄 Ver archivo `MODELOS_OPENAI.md` para comparativa completa de modelos, costos y recomendaciones.

## Personalización del contexto

El contexto del asistente está definido en el código (`ai.service.ts`).
Puedes modificarlo para cambiar el comportamiento del asistente:

```typescript
const systemMessage = `Eres un asistente experto en programación...
[Personaliza aquí las instrucciones del asistente]`;
```

### Ejemplos de contextos:
- **Experto técnico**: "Eres un arquitecto de software senior..."
- **Tutor educativo**: "Eres un profesor que explica conceptos de forma simple..."
- **Code reviewer**: "Eres un revisor de código que busca mejoras..."
- **Generador de código**: "Generas código limpio y bien documentado..."

## Manejo de errores

El endpoint maneja los siguientes errores:

- **401**: API key inválida
- **429**: Límite de solicitudes excedido
- **400**: Error general en el procesamiento
