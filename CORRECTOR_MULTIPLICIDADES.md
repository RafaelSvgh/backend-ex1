# 🔧 Corrector de Multiplicidades UML - GoJS

Este endpoint utiliza OpenAI para analizar y corregir automáticamente las multiplicidades en diagramas GoJS siguiendo la lógica UML correcta.

## 🎯 Endpoint

**POST** `http://localhost:3001/ai/fix-multiplicity`

## 📝 Función

Toma un JSON de GoJS existente y corrige únicamente las multiplicidades (`fromMultiplicity` y `toMultiplicity`) en el `linkDataArray`, siguiendo estas reglas:

### ✅ Reglas de Corrección

#### 1. **Composición** (rombo negro - "es parte de")
- **Lógica**: Las partes pertenecen al todo
- **Ejemplo**: Habitacion es parte de Edificio
- **Corrección**: `from=Habitacion, to=Edificio, fromMultiplicity="*", toMultiplicity="1"`

#### 2. **Agregación** (rombo blanco - "tiene/contiene") 
- **Lógica**: El todo tiene partes, pero pueden existir independientemente
- **Ejemplo**: Departamento tiene Empleados
- **Corrección**: `from=Empleado, to=Departamento, fromMultiplicity="*", toMultiplicity="1"`

#### 3. **Herencia/Generalización** (flecha vacía)
- **Lógica**: Siempre relación de herencia
- **Ejemplo**: Perro hereda de Animal
- **Corrección**: `from=Perro, to=Animal, fromMultiplicity="*", toMultiplicity="1"`

#### 4. **Asociación** (línea simple)
- **Lógica**: Analiza el contexto y nombres para determinar la cardinalidad
- **Ejemplos**:
  - Cliente-Pedido: `from=Pedido, to=Cliente, "*" a "1"`
  - Usuario-Perfil: `from=Usuario, to=Perfil, "1" a "1"`
  - Estudiante-Curso: `from=Estudiante, to=Curso, "*" a "*"`

## 📋 Formato de Entrada

**Content-Type:** `application/json`

```json
{
  "gojsDiagram": {
    "class": "GraphLinksModel",
    "nodeDataArray": [
      {
        "key": -1,
        "name": "Edificio",
        "attribute": "nombre: String\ndireccion: String",
        "methods": "abrir(): void",
        "loc": "0 0",
        "nodeType": "standard"
      },
      {
        "key": -2,
        "name": "Habitacion", 
        "attribute": "numero: int\ntamaño: float",
        "methods": "limpiar(): void",
        "loc": "200 0",
        "nodeType": "standard"
      }
    ],
    "linkDataArray": [
      {
        "from": -2,
        "to": -1,
        "fromMultiplicity": "1",
        "toMultiplicity": "1", 
        "category": "composicion"
      }
    ]
  }
}
```

## 📊 Formato de Respuesta

```json
{
  "originalDiagram": {
    "class": "GraphLinksModel",
    "nodeDataArray": [...],
    "linkDataArray": [...]
  },
  "correctedDiagram": {
    "class": "GraphLinksModel", 
    "nodeDataArray": [...],
    "linkDataArray": [
      {
        "from": -2,
        "to": -1,
        "fromMultiplicity": "*",
        "toMultiplicity": "1",
        "category": "composicion"
      }
    ]
  },
  "changes": [
    {
      "relationship": "Habitacion → Edificio",
      "category": "composicion",
      "from": {
        "original": "1",
        "corrected": "*"
      },
      "to": {
        "original": "1", 
        "corrected": "1"
      }
    }
  ],
  "model": "gpt-4o",
  "usage": {
    "promptTokens": 450,
    "completionTokens": 320,
    "totalTokens": 770
  }
}
```

## 🧪 Ejemplos de Uso

### Ejemplo 1: PowerShell

```powershell
$diagrama = @{
    gojsDiagram = @{
        class = "GraphLinksModel"
        nodeDataArray = @(
            @{
                key = -1
                name = "Universidad"
                attribute = "nombre: String\nciudad: String"
                methods = "inscribir(): void"
                loc = "0 0"
                nodeType = "standard"
            },
            @{
                key = -2
                name = "Facultad"
                attribute = "nombre: String\ndecano: String"
                methods = "graduar(): void"
                loc = "200 0"
                nodeType = "standard"
            }
        )
        linkDataArray = @(
            @{
                from = -2
                to = -1
                fromMultiplicity = "0..1"
                toMultiplicity = "1..*"
                category = "composicion"
            }
        )
    }
} | ConvertTo-Json -Depth 10

$result = Invoke-RestMethod -Uri "http://localhost:3001/ai/fix-multiplicity" -Method Post -Body $diagrama -ContentType "application/json"

Write-Host "Cambios realizados:" -ForegroundColor Green
$result.changes | ForEach-Object {
    Write-Host "  $($_.relationship) ($($_.category)): $($_.from.original)→$($_.from.corrected) a $($_.to.original)→$($_.to.corrected)" -ForegroundColor Cyan
}
```

### Ejemplo 2: curl

```bash
curl -X POST http://localhost:3001/ai/fix-multiplicity \
  -H "Content-Type: application/json" \
  -d '{
    "gojsDiagram": {
      "class": "GraphLinksModel",
      "nodeDataArray": [
        {
          "key": -1,
          "name": "Cliente",
          "attribute": "nombre: String\nemail: String",
          "methods": "comprar(): void",
          "loc": "0 0",
          "nodeType": "standard"
        },
        {
          "key": -2,
          "name": "Pedido",
          "attribute": "numero: int\nfecha: Date\ntotal: float",
          "methods": "procesar(): void",
          "loc": "200 0", 
          "nodeType": "standard"
        }
      ],
      "linkDataArray": [
        {
          "from": -1,
          "to": -2,
          "fromMultiplicity": "1..1",
          "toMultiplicity": "0..*",
          "category": "asociacion"
        }
      ]
    }
  }'
```

### Ejemplo 3: JavaScript/Fetch

```javascript
async function corregirMultiplicidades(diagramaGojs) {
  const response = await fetch('http://localhost:3001/ai/fix-multiplicity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gojsDiagram: diagramaGojs
    })
  });

  const resultado = await response.json();
  
  console.log('Diagrama original:', resultado.originalDiagram);
  console.log('Diagrama corregido:', resultado.correctedDiagram);
  console.log('Cambios realizados:', resultado.changes);
  
  return resultado.correctedDiagram;
}

// Uso:
const miDiagrama = {
  "class": "GraphLinksModel",
  "nodeDataArray": [
    // ... tus nodos
  ],
  "linkDataArray": [
    // ... tus links con multiplicidades incorrectas
  ]
};

const diagramaCorregido = await corregirMultiplicidades(miDiagrama);
```

## 📋 Casos de Uso Comunes

### Caso 1: Corregir Composición

**Entrada:**
```json
{
  "gojsDiagram": {
    "linkDataArray": [
      {
        "from": -1,
        "to": -2,
        "fromMultiplicity": "1", 
        "toMultiplicity": "1",
        "category": "composicion"
      }
    ]
  }
}
```

**Salida esperada:** Si Edificio contiene Habitacion
```json
{
  "from": -2,
  "to": -1,
  "fromMultiplicity": "*",
  "toMultiplicity": "1", 
  "category": "composicion"
}
```

### Caso 2: Corregir Herencia

**Entrada:**
```json
{
  "linkDataArray": [
    {
      "from": -1,
      "to": -2, 
      "fromMultiplicity": "1..1",
      "toMultiplicity": "0..1",
      "category": "generalizacion"
    }
  ]
}
```

**Salida esperada:** Si Perro hereda de Animal
```json
{
  "from": -1,
  "to": -2,
  "fromMultiplicity": "*",
  "toMultiplicity": "1",
  "category": "generalizacion" 
}
```

### Caso 3: Corregir Asociación Compleja

**Entrada:**
```json
{
  "linkDataArray": [
    {
      "from": -1,
      "to": -2,
      "fromMultiplicity": "0..1",
      "toMultiplicity": "1..*", 
      "category": "asociacion"
    }
  ]
}
```

**Salida:** Depende del contexto de las clases involucradas

## 🎨 Integración con GoJS

### Antes y Después

```javascript
// ANTES: Diagrama con multiplicidades incorrectas
const diagramaOriginal = {
  "class": "GraphLinksModel",
  "nodeDataArray": [...],
  "linkDataArray": [
    {
      "from": -1,
      "to": -2,
      "fromMultiplicity": "0..1",  // ❌ Formato incorrecto
      "toMultiplicity": "1..*",    // ❌ Formato incorrecto
      "category": "asociacion"
    }
  ]
};

// Corregir con el endpoint
const resultado = await fetch('http://localhost:3001/ai/fix-multiplicity', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ gojsDiagram: diagramaOriginal })
}).then(r => r.json());

// DESPUÉS: Usar el diagrama corregido
myDiagram.model = go.Model.fromJson(JSON.stringify(resultado.correctedDiagram));
```

### Hook de React

```javascript
import { useState } from 'react';

export function useMultiplicityFixer() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fixMultiplicity = async (diagram) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/ai/fix-multiplicity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gojsDiagram: diagram })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      return data.correctedDiagram;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fixMultiplicity, loading, result, error };
}
```

## 🔍 Análisis de Cambios

El endpoint proporciona un análisis detallado de los cambios:

```json
{
  "changes": [
    {
      "relationship": "Habitacion → Edificio",
      "category": "composicion", 
      "from": {
        "original": "1",
        "corrected": "*"
      },
      "to": {
        "original": "1",
        "corrected": "1"
      }
    }
  ]
}
```

### Interpretar los Cambios

- **`relationship`**: Muestra las entidades involucradas
- **`category`**: Tipo de relación (composicion, agregacion, etc.)
- **`from/to`**: Cambios en multiplicidades origen y destino

## ⚠️ Limitaciones y Consideraciones

### ✅ Lo que SÍ hace:
- Corrige multiplicidades siguiendo lógica UML
- Mantiene toda la estructura original del JSON
- Proporciona análisis de cambios realizados
- Valida que el JSON de salida sea válido

### ❌ Lo que NO hace:
- No cambia nombres de clases o atributos
- No modifica coordenadas (loc) de elementos
- No altera las categorías de relación
- No agrega o elimina nodos/links

### 🎯 Precisión:
- **Alta** para relaciones estándar (Edificio-Habitacion, Cliente-Pedido)
- **Media** para relaciones ambiguas que requieren contexto de negocio
- **Muy Alta** para herencia (siempre * a 1)

## 🚀 Casos Reales de Corrección

### Sistema Universitario
```
Universidad → Facultad (composicion): 1→1 ⟹ *→1 ✅
Facultad → Curso (agregacion): 0..1→1..* ⟹ *→1 ✅
Estudiante → Curso (asociacion): *→* ⟹ *→* ✅
```

### Sistema E-commerce
```
Cliente → Pedido (asociacion): 1→0..* ⟹ *→1 ✅
Pedido → Producto (asociacion): *→* ⟹ *→* ✅
Categoria → Producto (agregacion): 1→* ⟹ *→1 ✅
```

### Jerarquía de Clases
```
Perro → Animal (herencia): 1→1 ⟹ *→1 ✅
Gato → Animal (herencia): 1→1 ⟹ *→1 ✅
Auto → Vehiculo (herencia): 1→1 ⟹ *→1 ✅
```

## 📝 Script de Prueba Completo

```powershell
# Ejemplo completo de uso
$testDiagram = @{
    gojsDiagram = @{
        class = "GraphLinksModel"
        nodeDataArray = @(
            @{ key = -1; name = "Condominio"; attribute = "nombre: String"; methods = ""; loc = "0 0"; nodeType = "standard" },
            @{ key = -2; name = "Edificio"; attribute = "direccion: String"; methods = ""; loc = "200 0"; nodeType = "standard" },
            @{ key = -3; name = "Habitacion"; attribute = "numero: int"; methods = ""; loc = "400 0"; nodeType = "standard" },
            @{ key = -4; name = "Animal"; attribute = "nombre: String"; methods = ""; loc = "0 200"; nodeType = "standard" },
            @{ key = -5; name = "Perro"; attribute = "raza: String"; methods = ""; loc = "200 200"; nodeType = "standard" }
        )
        linkDataArray = @(
            @{ from = -1; to = -2; fromMultiplicity = "1..1"; toMultiplicity = "0..*"; category = "asociacion" },
            @{ from = -2; to = -3; fromMultiplicity = "1"; toMultiplicity = "1"; category = "composicion" },
            @{ from = -4; to = -5; fromMultiplicity = "1"; toMultiplicity = "1"; category = "generalizacion" }
        )
    }
} | ConvertTo-Json -Depth 10

Write-Host "🔧 Enviando diagrama para corregir multiplicidades..." -ForegroundColor Cyan

try {
    $result = Invoke-RestMethod -Uri "http://localhost:3001/ai/fix-multiplicity" -Method Post -Body $testDiagram -ContentType "application/json"
    
    Write-Host "✅ Corrección completada!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Cambios realizados:" -ForegroundColor Yellow
    
    if ($result.changes.Count -eq 0) {
        Write-Host "  No se realizaron cambios - las multiplicidades ya eran correctas" -ForegroundColor Gray
    } else {
        foreach ($change in $result.changes) {
            Write-Host "  🔄 $($change.relationship) ($($change.category)):" -ForegroundColor White
            Write-Host "     From: $($change.from.original) → $($change.from.corrected)" -ForegroundColor Cyan
            Write-Host "     To:   $($change.to.original) → $($change.to.corrected)" -ForegroundColor Cyan
        }
    }
    
    Write-Host ""
    Write-Host "💰 Tokens utilizados: $($result.usage.totalTokens)" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "✨ Diagrama corregido listo para usar!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
```

¡Tu endpoint corrector de multiplicidades está listo para usar! 🎉