# 📷 Análisis de Imágenes para Diagramas UML con OpenAI Vision

Este endpoint utiliza OpenAI Vision (GPT-4o) para analizar imágenes y generar diagramas UML en formato GoJS si la imagen contiene diagramas relevantes.

## 🎯 Endpoint

**POST** `http://localhost:3001/ai/analyze-image`

## 📝 Formato de Entrada

**Content-Type:** `multipart/form-data`

### Campos:

1. **`image`** (requerido): Archivo de imagen
   - Formatos soportados: JPEG, PNG, GIF, WebP
   - Tamaño máximo: 20MB
   
2. **`additionalContext`** (opcional): Contexto adicional sobre qué buscar
   - Tipo: texto
   - Ejemplo: "Busca relaciones de herencia" o "Enfócate en las cardinalidades"

## 🖼️ Tipos de Imágenes que Puede Procesar

### ✅ Imágenes Compatibles:
- **Diagramas UML** dibujados a mano o digitales
- **Esquemas de base de datos** (ERD)
- **Organigramas** empresariales
- **Diagramas conceptuales** de sistemas
- **Bocetos** de arquitectura de software
- **Mapas mentales** con entidades relacionadas
- **Diagramas de flujo** con entidades
- **Wireframes** con componentes

### ❌ Imágenes No Compatibles:
- Fotografías sin diagramas
- Texto plano sin estructura
- Imágenes decorativas
- Capturas de pantalla de código

## 🧪 Ejemplos de Uso

### Ejemplo 1: Con curl

```bash
curl -X POST http://localhost:3001/ai/analyze-image \
  -F "image=@diagrama.png" \
  -F "additionalContext=Analiza las relaciones entre las clases"
```

### Ejemplo 2: Con PowerShell

```powershell
$form = @{
    image = Get-Item -Path "C:\ruta\a\tu\diagrama.png"
    additionalContext = "Busca patrones de herencia y composición"
}

Invoke-RestMethod -Uri "http://localhost:3001/ai/analyze-image" -Method Post -Form $form
```

### Ejemplo 3: Con JavaScript/Fetch

```javascript
async function analizarImagen(imageFile, context = '') {
  const formData = new FormData();
  formData.append('image', imageFile);
  if (context) {
    formData.append('additionalContext', context);
  }

  const response = await fetch('http://localhost:3001/ai/analyze-image', {
    method: 'POST',
    body: formData
  });

  return await response.json();
}

// Uso:
const inputFile = document.querySelector('#imageInput').files[0];
const resultado = await analizarImagen(inputFile, 'Analiza la estructura de clases');
```

### Ejemplo 4: HTML Form

```html
<form action="http://localhost:3001/ai/analyze-image" method="POST" enctype="multipart/form-data">
  <input type="file" name="image" accept="image/*" required>
  <input type="text" name="additionalContext" placeholder="Contexto adicional (opcional)">
  <button type="submit">Analizar Imagen</button>
</form>
```

## 📊 Respuesta del Endpoint

### Caso 1: Imagen con Diagrama Válido

```json
{
  "imageAnalysis": "{ \"class\": \"GraphLinksModel\", \"nodeDataArray\": [{\"key\":-1,\"name\":\"Usuario\",...}], \"linkDataArray\": [...] }",
  "model": "gpt-4o",
  "usage": {
    "promptTokens": 1250,
    "completionTokens": 420,
    "totalTokens": 1670
  }
}
```

### Caso 2: Imagen Sin Diagrama Relevante

```json
{
  "imageAnalysis": "La imagen no contiene un diagrama UML o estructura que pueda convertirse en un diagrama de clases.",
  "model": "gpt-4o", 
  "usage": {
    "promptTokens": 1250,
    "completionTokens": 25,
    "totalTokens": 1275
  }
}
```

## 🎨 Procesamiento de la Respuesta

### JavaScript - Extraer JSON de GoJS

```javascript
async function procesarRespuesta(response) {
  const data = await response.json();
  
  // Verificar si se generó un diagrama
  if (data.imageAnalysis.startsWith('{')) {
    // Es un JSON de GoJS
    const gojsData = JSON.parse(data.imageAnalysis);
    console.log('Diagrama generado:', gojsData);
    
    // Usar con GoJS
    myDiagram.model = go.Model.fromJson(data.imageAnalysis);
    
    return gojsData;
  } else {
    // No se pudo generar diagrama
    console.log('Resultado:', data.imageAnalysis);
    return null;
  }
}
```

### Python - Procesar con requests

```python
import requests
import json

def analizar_imagen(ruta_imagen, contexto_adicional=""):
    with open(ruta_imagen, 'rb') as img:
        files = {'image': img}
        data = {'additionalContext': contexto_adicional}
        
        response = requests.post(
            'http://localhost:3001/ai/analyze-image',
            files=files,
            data=data
        )
        
        resultado = response.json()
        
        # Verificar si es JSON de GoJS
        if resultado['imageAnalysis'].startswith('{'):
            diagrama_gojs = json.loads(resultado['imageAnalysis'])
            print("Diagrama generado exitosamente!")
            return diagrama_gojs
        else:
            print(f"No se pudo generar diagrama: {resultado['imageAnalysis']}")
            return None

# Uso
diagrama = analizar_imagen('mi_diagrama.png', 'Enfócate en las cardinalidades')
```

## 📋 Casos de Uso Comunes

### 1. Digitalizar Diagramas Dibujados a Mano

```bash
curl -X POST http://localhost:3001/ai/analyze-image \
  -F "image=@boceto_mano.jpg" \
  -F "additionalContext=Diagrama UML dibujado a mano, identifica clases y relaciones"
```

### 2. Convertir ERD a UML

```bash
curl -X POST http://localhost:3001/ai/analyze-image \
  -F "image=@esquema_bd.png" \
  -F "additionalContext=Esquema de base de datos, convierte tablas a clases UML"
```

### 3. Analizar Organigrama

```bash
curl -X POST http://localhost:3001/ai/analyze-image \
  -F "image=@organigrama.png" \
  -F "additionalContext=Organigrama empresarial, crea jerarquía de clases con herencia"
```

### 4. Extraer de Whiteboard

```bash
curl -X POST http://localhost:3001/ai/analyze-image \
  -F "image=@pizarra.jpg" \
  -F "additionalContext=Pizarra con diseño de sistema, identifica componentes y sus relaciones"
```

## 🔍 Consejos para Mejores Resultados

### ✅ Imágenes Ideales:
- **Alta resolución** (mínimo 800x600)
- **Buena iluminación** y contraste
- **Texto legible** en los diagramas
- **Líneas claras** entre entidades
- **Relaciones visibles** (flechas, líneas)

### ✅ Contexto Adicional Útil:
- "Diagrama UML de clases, identifica herencia"
- "Esquema de base de datos, convierte a UML"
- "Boceto de sistema, enfócate en las entidades principales"
- "Organigrama, usa herencia para la jerarquía"
- "Wireframe, identifica componentes como clases"

### ❌ Evitar:
- Imágenes borrosas o de baja calidad
- Múltiples diagramas en una sola imagen
- Texto demasiado pequeño para leer
- Diagramas muy complejos con muchas entidades

## ⚠️ Limitaciones y Consideraciones

### Formatos de Imagen:
- ✅ **JPEG/JPG** - Recomendado para fotografías
- ✅ **PNG** - Recomendado para capturas de pantalla
- ✅ **GIF** - Soportado pero no recomendado
- ✅ **WebP** - Formato moderno, excelente compresión
- ❌ **BMP, TIFF, SVG** - No soportados

### Tamaño y Resolución:
- **Máximo**: 20MB por imagen
- **Recomendado**: 2-10MB para balance velocidad/calidad
- **Resolución mínima**: 800x600 para texto legible
- **Resolución máxima**: Sin límite, pero afecta tiempo de procesamiento

### Costos:
- **GPT-4o Vision** es más costoso que texto plano
- Imágenes de mayor resolución consumen más tokens
- Considerar optimizar imágenes antes de enviar

## 🛠️ Integración con Frontend

### React Hook Personalizado

```javascript
import { useState } from 'react';

export function useImageAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyzeImage = async (file, context = '') => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      if (context) formData.append('additionalContext', context);

      const response = await fetch('http://localhost:3001/ai/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Intentar parsear como JSON de GoJS
      let gojsData = null;
      if (data.imageAnalysis.startsWith('{')) {
        try {
          gojsData = JSON.parse(data.imageAnalysis);
        } catch (e) {
          console.warn('No se pudo parsear como JSON:', e);
        }
      }

      setResult({ ...data, gojsData });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { analyzeImage, loading, result, error };
}
```

### Componente React

```jsx
function ImageDiagramAnalyzer() {
  const { analyzeImage, loading, result, error } = useImageAnalyzer();
  const [file, setFile] = useState(null);
  const [context, setContext] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      analyzeImage(file, context);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <input
          type="text"
          placeholder="Contexto adicional (opcional)"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Analizando...' : 'Analizar Imagen'}
        </button>
      </form>

      {error && <div style={{color: 'red'}}>Error: {error}</div>}
      
      {result && (
        <div>
          <h3>Resultado:</h3>
          {result.gojsData ? (
            <div>
              <p>✅ Diagrama generado exitosamente!</p>
              <pre>{JSON.stringify(result.gojsData, null, 2)}</pre>
            </div>
          ) : (
            <p>ℹ️ {result.imageAnalysis}</p>
          )}
        </div>
      )}
    </div>
  );
}
```

## 🚀 Próximos Pasos

1. **Subir tu imagen** al endpoint
2. **Revisar la respuesta** para ver si se generó JSON válido
3. **Integrar el JSON** con tu aplicación GoJS
4. **Refinar el contexto** si es necesario para mejores resultados

## 📝 Ejemplo Completo de Flujo

```javascript
// 1. Usuario selecciona imagen
const fileInput = document.getElementById('imageFile');
const contextInput = document.getElementById('context');

// 2. Enviar al análisis
async function procesarImagen() {
  const formData = new FormData();
  formData.append('image', fileInput.files[0]);
  formData.append('additionalContext', contextInput.value);

  // 3. Llamar API
  const response = await fetch('http://localhost:3001/ai/analyze-image', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  // 4. Procesar resultado
  if (data.imageAnalysis.startsWith('{')) {
    // 5. Usar con GoJS
    const gojsData = JSON.parse(data.imageAnalysis);
    myDiagram.model = go.Model.fromJson(data.imageAnalysis);
    console.log('¡Diagrama cargado exitosamente!');
  } else {
    console.log('No se pudo generar diagrama:', data.imageAnalysis);
  }
}
```

¡Tu endpoint de análisis de imágenes está listo para usar! 🎉