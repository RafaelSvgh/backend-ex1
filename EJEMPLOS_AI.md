# Ejemplos de peticiones al endpoint AI

## 1. Pregunta simple

**POST** `http://localhost:3001/ai/ask`

```json
{
  "question": "¿Qué es TypeScript?"
}
```

## 2. Análisis de código

**POST** `http://localhost:3001/ai/ask`

```json
{
  "question": "¿Cómo puedo mejorar este código: function suma(a, b) { return a + b }?"
}
```

## 3. Lista de mejores prácticas

**POST** `http://localhost:3001/ai/ask`

```json
{
  "question": "Dame 5 ventajas de usar NestJS en formato de lista numerada"
}
```

## 4. Explicación técnica detallada

**POST** `http://localhost:3001/ai/ask`

```json
{
  "question": "Explica cómo funciona la inyección de dependencias en NestJS con ejemplos"
}
```

## 5. Generación de código

**POST** `http://localhost:3001/ai/ask`

```json
{
  "question": "Genera un decorador personalizado en NestJS para validar que un usuario sea admin"
}
```

## 6. Debugging y solución de problemas

**POST** `http://localhost:3001/ai/ask`

```json
{
  "question": "Tengo este error: 'Cannot find module @nestjs/common'. ¿Cómo lo soluciono?"
}
```

## Prueba con cURL

```bash
curl -X POST http://localhost:3001/ai/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "¿Cuál es la diferencia entre let, const y var en JavaScript?"
  }'
```

## Prueba con Postman / Thunder Client

1. Método: **POST**
2. URL: `http://localhost:3001/ai/ask`
3. Headers: 
   - `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "question": "Tu pregunta aquí"
}
```

## Respuesta esperada

```json
{
  "question": "Tu pregunta",
  "answer": "La respuesta de OpenAI",
  "model": "gpt-4o-mini",
  "usage": {
    "promptTokens": 25,
    "completionTokens": 50,
    "totalTokens": 75
  }
}
```

## 💡 Personalizar el contexto

El contexto del asistente está configurado en el código (`src/modules/ai/ai.service.ts`).
Puedes modificarlo para cambiar cómo responde el asistente:

```typescript
const systemMessage = `Eres un asistente experto en programación...
Tus instrucciones personalizadas aquí.`;
```
