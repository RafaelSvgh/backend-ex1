# 🧪 Pruebas Rápidas - Análisis de Imágenes

## 🚀 Comandos Listos para Copiar

### 1. Prueba Básica (PowerShell)

```powershell
# Asegúrate de tener una imagen llamada "test.png" en tu escritorio
$imagePath = "$env:USERPROFILE\Desktop\test.png"

# Verificar que existe
if (Test-Path $imagePath) {
    $form = @{
        image = Get-Item -Path $imagePath
        additionalContext = "Analiza cualquier diagrama o estructura en esta imagen"
    }
    
    try {
        $result = Invoke-RestMethod -Uri "http://localhost:3001/ai/analyze-image" -Method Post -Form $form
        Write-Host "Resultado del análisis:" -ForegroundColor Green
        Write-Host $result.imageAnalysis -ForegroundColor Cyan
        
        # Verificar si es JSON de GoJS
        if ($result.imageAnalysis.StartsWith('{')) {
            Write-Host "`n✅ ¡Se generó un diagrama GoJS válido!" -ForegroundColor Green
            Write-Host "Tokens utilizados: $($result.usage.totalTokens)" -ForegroundColor Yellow
        } else {
            Write-Host "`nℹ️ La imagen no contenía un diagrama procesable" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "No se encontró la imagen en: $imagePath" -ForegroundColor Red
    Write-Host "Por favor, coloca una imagen llamada 'test.png' en tu escritorio" -ForegroundColor Yellow
}
```

### 2. Prueba con cURL (Linux/Mac/WSL)

```bash
# Reemplaza la ruta con tu imagen
curl -X POST http://localhost:3001/ai/analyze-image \
  -F "image=@/ruta/a/tu/imagen.png" \
  -F "additionalContext=Busca diagramas UML, esquemas de BD o estructuras de clases" \
  | jq '.'
```

### 3. Comando Rápido para Múltiples Formatos

```bash
# Buscar cualquier imagen en el directorio actual
for img in *.{png,jpg,jpeg,gif,webp}; do
  [ -f "$img" ] || continue
  echo "Analizando: $img"
  curl -s -X POST http://localhost:3001/ai/analyze-image \
    -F "image=@$img" \
    -F "additionalContext=Identifica cualquier diagrama o estructura" \
    | jq -r '.imageAnalysis'
  echo "---"
done
```

## 📋 Script de Prueba Completo (PowerShell)

Guarda esto como `test-image-analyzer.ps1`:

```powershell
param(
    [string]$ImagePath = "",
    [string]$Context = "Analiza cualquier diagrama, esquema o estructura en esta imagen"
)

# Función para mostrar ayuda
function Show-Help {
    Write-Host "Uso: .\test-image-analyzer.ps1 [-ImagePath ruta] [-Context contexto]" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ejemplos:" -ForegroundColor Yellow
    Write-Host "  .\test-image-analyzer.ps1 -ImagePath 'C:\Users\usuario\diagrama.png'"
    Write-Host "  .\test-image-analyzer.ps1 -ImagePath '.\boceto.jpg' -Context 'Diagrama UML dibujado a mano'"
    Write-Host ""
    Write-Host "Si no se especifica ImagePath, buscará 'test.png' en el escritorio"
}

# Si no se proporciona ruta, usar imagen por defecto
if (-not $ImagePath) {
    $ImagePath = "$env:USERPROFILE\Desktop\test.png"
    if (-not (Test-Path $ImagePath)) {
        Write-Host "No se encontró imagen por defecto en: $ImagePath" -ForegroundColor Red
        Write-Host ""
        Show-Help
        return
    }
}

# Verificar que la imagen existe
if (-not (Test-Path $ImagePath)) {
    Write-Host "Error: No se encontró la imagen en: $ImagePath" -ForegroundColor Red
    return
}

# Verificar que el servidor está corriendo
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:3001" -Method Get -ErrorAction Stop
} catch {
    Write-Host "Error: El servidor no está corriendo en http://localhost:3001" -ForegroundColor Red
    Write-Host "Ejecuta 'npm run start:dev' primero" -ForegroundColor Yellow
    return
}

Write-Host "🔍 Analizando imagen: $ImagePath" -ForegroundColor Cyan
Write-Host "📝 Contexto: $Context" -ForegroundColor Gray
Write-Host ""

# Preparar formulario
$form = @{
    image = Get-Item -Path $ImagePath
    additionalContext = $Context
}

try {
    # Medir tiempo de respuesta
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    
    $result = Invoke-RestMethod -Uri "http://localhost:3001/ai/analyze-image" -Method Post -Form $form
    
    $stopwatch.Stop()
    
    Write-Host "⏱️ Tiempo de procesamiento: $($stopwatch.Elapsed.TotalSeconds) segundos" -ForegroundColor Magenta
    Write-Host ""
    
    # Mostrar información de uso
    Write-Host "📊 Uso de tokens:" -ForegroundColor Yellow
    Write-Host "  - Prompt: $($result.usage.promptTokens)" -ForegroundColor Gray
    Write-Host "  - Completion: $($result.usage.completionTokens)" -ForegroundColor Gray
    Write-Host "  - Total: $($result.usage.totalTokens)" -ForegroundColor Gray
    Write-Host ""
    
    # Verificar si es JSON de GoJS
    if ($result.imageAnalysis.StartsWith('{') -and $result.imageAnalysis.Contains('GraphLinksModel')) {
        Write-Host "✅ ¡ÉXITO! Se generó un diagrama GoJS válido" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 JSON generado:" -ForegroundColor Green
        
        # Intentar formatear el JSON para mejor visualización
        try {
            $jsonObj = $result.imageAnalysis | ConvertFrom-Json
            $formattedJson = $jsonObj | ConvertTo-Json -Depth 10
            Write-Host $formattedJson -ForegroundColor Cyan
        } catch {
            Write-Host $result.imageAnalysis -ForegroundColor Cyan
        }
        
        # Información sobre las entidades encontradas
        try {
            $jsonObj = $result.imageAnalysis | ConvertFrom-Json
            $nodeCount = $jsonObj.nodeDataArray.Count
            $linkCount = $jsonObj.linkDataArray.Count
            
            Write-Host ""
            Write-Host "📈 Estadísticas del diagrama:" -ForegroundColor Yellow
            Write-Host "  - Clases/Entidades: $nodeCount" -ForegroundColor Gray
            Write-Host "  - Relaciones: $linkCount" -ForegroundColor Gray
            
            if ($nodeCount -gt 0) {
                Write-Host "  - Clases encontradas:" -ForegroundColor Gray
                foreach ($node in $jsonObj.nodeDataArray) {
                    Write-Host "    • $($node.name)" -ForegroundColor White
                }
            }
        } catch {
            Write-Host "No se pudieron extraer estadísticas adicionales" -ForegroundColor Yellow
        }
        
    } elseif ($result.imageAnalysis.Contains("no contiene")) {
        Write-Host "ℹ️ La imagen no contiene un diagrama procesable" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Respuesta de la IA:" -ForegroundColor Yellow
        Write-Host $result.imageAnalysis -ForegroundColor Gray
        Write-Host ""
        Write-Host "💡 Sugerencias:" -ForegroundColor Cyan
        Write-Host "  • Intenta con una imagen que contenga diagramas UML" -ForegroundColor Gray
        Write-Host "  • Verifica que el texto sea legible" -ForegroundColor Gray
        Write-Host "  • Usa un contexto más específico" -ForegroundColor Gray
        
    } else {
        Write-Host "⚠️ Respuesta inesperada de la IA" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Respuesta completa:" -ForegroundColor Yellow
        Write-Host $result.imageAnalysis -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ Error durante el análisis:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Message.Contains("401")) {
        Write-Host ""
        Write-Host "💡 Verifica tu OPENAI_API_KEY en el archivo .env" -ForegroundColor Yellow
    } elseif ($_.Exception.Message.Contains("413")) {
        Write-Host ""
        Write-Host "💡 La imagen es demasiado grande. Reduce el tamaño a menos de 20MB" -ForegroundColor Yellow
    } elseif ($_.Exception.Message.Contains("400")) {
        Write-Host ""
        Write-Host "💡 Formato de imagen no válido. Usa JPEG, PNG, GIF o WebP" -ForegroundColor Yellow
    }
}
```

## 🎯 Casos de Prueba Específicos

### Caso 1: Diagrama UML Clásico

```powershell
# Para un diagrama UML tradicional
$form = @{
    image = Get-Item -Path ".\diagrama_uml.png"
    additionalContext = "Diagrama UML de clases, identifica herencia y asociaciones"
}
Invoke-RestMethod -Uri "http://localhost:3001/ai/analyze-image" -Method Post -Form $form
```

### Caso 2: Esquema de Base de Datos

```powershell
# Para convertir ERD a UML
$form = @{
    image = Get-Item -Path ".\esquema_bd.png"  
    additionalContext = "Esquema de base de datos, convierte tablas a clases UML con sus relaciones"
}
Invoke-RestMethod -Uri "http://localhost:3001/ai/analyze-image" -Method Post -Form $form
```

### Caso 3: Boceto Dibujado a Mano

```powershell
# Para diagramas dibujados manualmente
$form = @{
    image = Get-Item -Path ".\boceto_mano.jpg"
    additionalContext = "Diagrama dibujado a mano, identifica clases y sus atributos aunque la escritura no sea perfecta"
}
Invoke-RestMethod -Uri "http://localhost:3001/ai/analyze-image" -Method Post -Form $form
```

### Caso 4: Organigrama Empresarial

```powershell
# Para convertir organigrama a jerarquía UML
$form = @{
    image = Get-Item -Path ".\organigrama.png"
    additionalContext = "Organigrama empresarial, convierte a diagrama UML usando herencia para mostrar jerarquía"
}
Invoke-RestMethod -Uri "http://localhost:3001/ai/analyze-image" -Method Post -Form $form
```

## 🔧 Verificar Estado del Sistema

```powershell
# Script para verificar que todo esté funcionando
Write-Host "🔍 Verificando sistema..." -ForegroundColor Cyan

# 1. Verificar servidor
try {
    Invoke-RestMethod -Uri "http://localhost:3001" -Method Get -ErrorAction Stop
    Write-Host "✅ Servidor corriendo en puerto 3001" -ForegroundColor Green
} catch {
    Write-Host "❌ Servidor no disponible - ejecuta 'npm run start:dev'" -ForegroundColor Red
    exit
}

# 2. Verificar endpoint de texto
try {
    $testQuestion = @{ question = "test" } | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:3001/ai/ask" -Method Post -Body $testQuestion -ContentType "application/json" -ErrorAction Stop
    Write-Host "✅ Endpoint de texto funcionando" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Endpoint de texto con problemas: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 3. Verificar endpoint de imagen (con imagen dummy)
# Crear imagen de prueba pequeña si no existe
$testImagePath = ".\test_dummy.png"
if (-not (Test-Path $testImagePath)) {
    Write-Host "ℹ️ Creando imagen de prueba..." -ForegroundColor Gray
    # Aquí normalmente crearías una imagen pequeña, pero por simplicidad solo verificamos
    Write-Host "💡 Para prueba completa, coloca una imagen llamada 'test_dummy.png' aquí" -ForegroundColor Yellow
} else {
    try {
        $form = @{
            image = Get-Item -Path $testImagePath
            additionalContext = "test"
        }
        Invoke-RestMethod -Uri "http://localhost:3001/ai/analyze-image" -Method Post -Form $form -ErrorAction Stop
        Write-Host "✅ Endpoint de imagen funcionando" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Endpoint de imagen con problemas: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🚀 Sistema listo para pruebas!" -ForegroundColor Green
```

## 📝 Generar Imágenes de Prueba

Si necesitas imágenes de ejemplo para probar:

```powershell
# Descargar imágenes de ejemplo de diagramas UML
$examples = @(
    @{ name = "uml_classes.png"; url = "https://ejemplo.com/uml_classes.png" },
    @{ name = "erd_diagram.png"; url = "https://ejemplo.com/erd_diagram.png" }
)

foreach ($example in $examples) {
    if (-not (Test-Path $example.name)) {
        Write-Host "Descargando $($example.name)..." -ForegroundColor Yellow
        try {
            Invoke-WebRequest -Uri $example.url -OutFile $example.name
            Write-Host "✅ Descargado: $($example.name)" -ForegroundColor Green
        } catch {
            Write-Host "❌ Error descargando $($example.name)" -ForegroundColor Red
        }
    }
}
```

## 🎉 ¡Todo Listo!

1. **Guarda el script** `test-image-analyzer.ps1`
2. **Coloca una imagen** en tu escritorio llamada `test.png`
3. **Ejecuta**: `.\test-image-analyzer.ps1`
4. **¡Disfruta analizando imágenes!** 🚀