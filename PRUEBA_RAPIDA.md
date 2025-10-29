# Prueba Rápida - Generar Diagrama UML

## 🚀 Prueba Simple

Copia y pega este comando en tu terminal (asegúrate de que el servidor esté corriendo):

### Windows PowerShell:
```powershell
$body = @{
    question = "Genera un diagrama UML con: Persona (nombre, email), Edificio (nombre, direccion), Aula (numero). Un Edificio tiene varias Aulas (composicion). Una Persona trabaja en un Edificio (asociacion 1 a muchos)."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/ai/ask" -Method Post -Body $body -ContentType "application/json"
```

### Linux/Mac (curl):
```bash
curl -X POST http://localhost:3001/ai/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Genera un diagrama UML con: Persona (nombre, email), Edificio (nombre, direccion), Aula (numero). Un Edificio tiene varias Aulas (composicion). Una Persona trabaja en un Edificio (asociacion 1 a muchos)."
  }'
```

---

## 📋 Ejemplo con Postman/Thunder Client

1. **Método:** POST
2. **URL:** `http://localhost:3001/ai/ask`
3. **Headers:**
   - `Content-Type: application/json`
4. **Body (raw JSON):**

```json
{
  "question": "Genera un diagrama UML con: Cliente (nombre, email), Producto (nombre, precio), Pedido (fecha, total). Un Cliente hace varios Pedidos (asociacion 1 a muchos). Un Pedido contiene varios Productos (asociacion muchos a muchos)."
}
```

---

## ✅ Respuesta Esperada

La respuesta incluirá el JSON de GoJS en el campo `answer`:

```json
{
  "question": "tu pregunta aquí...",
  "answer": "{ \"class\": \"GraphLinksModel\", \"nodeDataArray\": [{\"key\":-1,\"name\":\"Cliente\",...}], \"linkDataArray\": [...] }",
  "model": "gpt-4o",
  "usage": {
    "promptTokens": 450,
    "completionTokens": 280,
    "totalTokens": 730
  }
}
```

---

## 🔍 Validar el JSON generado

Para extraer y validar el JSON de GoJS:

### Opción 1: Copiar manualmente
1. Copia el contenido del campo `answer`
2. Pégalo en https://jsonlint.com/
3. Valida que sea JSON correcto

### Opción 2: Procesar con código
```javascript
const response = await fetch('http://localhost:3001/ai/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: "Tu pregunta aquí..."
  })
});

const data = await response.json();
const gojsJson = JSON.parse(data.answer); // Convierte el string a objeto JSON

console.log(gojsJson);
// Ahora puedes usar gojsJson con GoJS
```

---

## 🎯 Verificar que el contexto funciona correctamente

El JSON generado debe cumplir estas reglas:

✅ **Nombres de clases**: Primera letra mayúscula (`Cliente`, `Producto`)
✅ **Atributos**: Todo en minúscula, sin prefijos (`nombre: String`, `email: String`)
✅ **Multiplicidad**: Solo `"1"` o `"*"`
✅ **Estructura**: `{ "class": "GraphLinksModel", "nodeDataArray": [...], "linkDataArray": [...] }`

---

## 🐛 Si algo sale mal

### Error 401:
```
API key de OpenAI inválida
```
**Solución:** Verifica que `OPENAI_API_KEY` esté correctamente configurada en tu archivo `.env`

### Error 429:
```
Límite de solicitudes excedido
```
**Solución:** Espera unos minutos y vuelve a intentar

### El JSON no es válido:
- Verifica que el campo `answer` contenga JSON válido
- Puede que la IA haya incluido texto adicional, limpia el JSON manualmente

---

## 📊 Ejemplo de uso en Frontend

```javascript
// Función para obtener diagrama UML
async function generarDiagramaUML(descripcion) {
  try {
    const response = await fetch('http://localhost:3001/ai/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: descripcion
      })
    });
    
    const data = await response.json();
    
    // Parsear el JSON de GoJS
    const gojsData = JSON.parse(data.answer);
    
    // Usar con GoJS
    myDiagram.model = go.Model.fromJson(data.answer);
    
    return gojsData;
  } catch (error) {
    console.error('Error al generar diagrama:', error);
  }
}

// Uso:
const descripcion = `
  Genera un diagrama UML con:
  Usuario (username, email, password),
  Post (titulo, contenido, fecha),
  Comentario (texto, fecha).
  Un Usuario crea varios Posts (asociacion 1 a muchos).
  Un Post tiene varios Comentarios (composicion).
`;

generarDiagramaUML(descripcion);
```

---

## 🎨 Modificar el modelo GPT

Si quieres cambiar el modelo de IA usado, edita `src/modules/ai/ai.service.ts`:

```typescript
model: 'gpt-4o',        // Más potente, más caro
// model: 'gpt-4o-mini', // Más económico
// model: 'gpt-4-turbo', // Balance
```

Ver `MODELOS_OPENAI.md` para más información sobre los modelos disponibles.
