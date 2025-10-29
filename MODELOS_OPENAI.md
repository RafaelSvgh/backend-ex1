# Modelos de OpenAI Disponibles

## 🚀 Modelos GPT-4o (Más recientes y potentes)

### 1. **gpt-4o** 
- **Descripción**: Modelo más reciente y potente de OpenAI (optimizado)
- **Contexto**: 128,000 tokens
- **Costo**: Alto
- **Velocidad**: Muy rápido
- **Mejor para**: Tareas complejas, razonamiento avanzado, análisis detallado
- **Fecha de conocimiento**: Octubre 2023

### 2. **gpt-4o-mini** ⭐ (RECOMENDADO para uso general)
- **Descripción**: Versión optimizada y económica de GPT-4o
- **Contexto**: 128,000 tokens
- **Costo**: Muy bajo (15x más barato que gpt-3.5-turbo)
- **Velocidad**: Muy rápido
- **Mejor para**: Uso general, excelente relación calidad-precio
- **Fecha de conocimiento**: Octubre 2023

## 🔥 Modelos GPT-4 Turbo

### 3. **gpt-4-turbo**
- **Descripción**: GPT-4 optimizado para mayor velocidad
- **Contexto**: 128,000 tokens
- **Costo**: Alto
- **Velocidad**: Rápido
- **Mejor para**: Tareas complejas que requieren mucho contexto
- **Fecha de conocimiento**: Abril 2023

### 4. **gpt-4-turbo-preview**
- **Descripción**: Versión preview del GPT-4 Turbo
- **Contexto**: 128,000 tokens
- **Costo**: Alto
- **Velocidad**: Rápido
- **Mejor para**: Testing de nuevas capacidades

## 🎯 Modelos GPT-4 Clásicos

### 5. **gpt-4**
- **Descripción**: Modelo GPT-4 estándar
- **Contexto**: 8,192 tokens
- **Costo**: Muy alto
- **Velocidad**: Moderado
- **Mejor para**: Tareas que requieren máxima precisión
- **Fecha de conocimiento**: Septiembre 2021

### 6. **gpt-4-32k**
- **Descripción**: GPT-4 con ventana de contexto extendida
- **Contexto**: 32,768 tokens
- **Costo**: Muy alto
- **Velocidad**: Moderado
- **Mejor para**: Análisis de documentos largos

## 💰 Modelos GPT-3.5 (Económicos)

### 7. **gpt-3.5-turbo**
- **Descripción**: Modelo económico y rápido
- **Contexto**: 16,385 tokens
- **Costo**: Bajo
- **Velocidad**: Muy rápido
- **Mejor para**: Tareas simples, chatbots básicos
- **Fecha de conocimiento**: Septiembre 2021

### 8. **gpt-3.5-turbo-16k**
- **Descripción**: GPT-3.5 con más contexto
- **Contexto**: 16,385 tokens
- **Costo**: Bajo
- **Velocidad**: Muy rápido
- **Mejor para**: Conversaciones largas, análisis de texto medio

## 📊 Comparativa de Costos (aproximados)

| Modelo | Entrada (por 1M tokens) | Salida (por 1M tokens) | Relación calidad/precio |
|--------|-------------------------|------------------------|------------------------|
| gpt-4o | $5.00 | $15.00 | ⭐⭐⭐⭐⭐ |
| gpt-4o-mini | $0.15 | $0.60 | ⭐⭐⭐⭐⭐ (MEJOR) |
| gpt-4-turbo | $10.00 | $30.00 | ⭐⭐⭐⭐ |
| gpt-4 | $30.00 | $60.00 | ⭐⭐⭐ |
| gpt-3.5-turbo | $0.50 | $1.50 | ⭐⭐⭐⭐ |

## 🎨 Recomendaciones por Caso de Uso

### Para tu aplicación (análisis de preguntas generales):
```typescript
model: 'gpt-4o-mini' // ⭐ MEJOR OPCIÓN
```
- Excelente calidad de respuestas
- Muy económico
- Rápido
- Contexto grande (128k tokens)

### Para análisis de código complejo:
```typescript
model: 'gpt-4o'
```

### Para chatbots simples:
```typescript
model: 'gpt-3.5-turbo'
```

### Para análisis de documentos largos:
```typescript
model: 'gpt-4-turbo'
```

## 🔧 Cómo cambiar el modelo en tu código

En `src/modules/ai/ai.service.ts`, línea ~25:

```typescript
const completion = await this.openai.chat.completions.create({
  model: 'gpt-4o-mini', // 👈 Cambia aquí el modelo
  messages: [...],
  temperature: 0.7,
  max_tokens: 2000,
});
```

## ⚙️ Parámetros adicionales que puedes ajustar:

### Temperature (0.0 - 2.0)
- **0.0-0.3**: Respuestas muy determinísticas y precisas
- **0.7-0.9**: Balance entre creatividad y precisión (RECOMENDADO)
- **1.0-2.0**: Respuestas muy creativas y variadas

```typescript
temperature: 0.7
```

### Max Tokens
- **100-500**: Respuestas cortas
- **500-1000**: Respuestas medianas
- **1000-2000**: Respuestas detalladas
- **2000-4000**: Respuestas muy extensas

```typescript
max_tokens: 2000
```

### Top P (alternativa a temperature)
```typescript
top_p: 1.0 // 0.1 = más enfocado, 1.0 = más diverso
```

### Frequency Penalty (0.0 - 2.0)
```typescript
frequency_penalty: 0.0 // Penaliza la repetición de tokens
```

### Presence Penalty (0.0 - 2.0)
```typescript
presence_penalty: 0.0 // Penaliza hablar sobre los mismos temas
```

## 📝 Ejemplo de configuración avanzada:

```typescript
const completion = await this.openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'system',
      content: 'Eres un experto en TypeScript...',
    },
    {
      role: 'user',
      content: question,
    },
  ],
  temperature: 0.7,
  max_tokens: 2000,
  top_p: 1.0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
});
```

## 🌐 Modelos especializados adicionales:

### Para visión (imágenes):
- `gpt-4o` - Puede analizar imágenes
- `gpt-4-vision-preview` - Preview con capacidades de visión

### Para embeddings (búsqueda semántica):
- `text-embedding-3-large`
- `text-embedding-3-small`
- `text-embedding-ada-002`

### Para audio (transcripción):
- `whisper-1`

### Para generación de imágenes:
- `dall-e-3`
- `dall-e-2`

## 💡 Consejo Final

Para tu caso de uso actual, **`gpt-4o-mini`** es la mejor opción:
- ✅ Respuestas de alta calidad
- ✅ Muy económico (15x más barato que gpt-3.5-turbo)
- ✅ Rápido
- ✅ Gran ventana de contexto
- ✅ Conocimiento actualizado hasta Oct 2023
