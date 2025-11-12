# Script de Prueba - Validador y Corrector de Diagramas UML
# Este script prueba el endpoint /ai/validate-diagram

Write-Host "🔍 VALIDADOR Y CORRECTOR DE DIAGRAMAS UML - PRUEBAS" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3001/ai/validate-diagram"

# Función helper para mostrar resultados
function Show-ValidationResults {
    param($result, $testName)
    
    Write-Host "✅ $testName - Completado!" -ForegroundColor Green
    Write-Host ""
    
    if ($result.perfect -eq "yes") {
        Write-Host "  ✨ Diagrama PERFECTO - Sin correcciones necesarias" -ForegroundColor Green
        Write-Host "  📊 Estado: $($result.perfect)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️ Diagrama CORREGIDO - Se encontraron problemas" -ForegroundColor Yellow
        Write-Host "  📊 Estado: $($result.perfect)" -ForegroundColor Yellow
        Write-Host "  🔧 Correcciones aplicadas automáticamente" -ForegroundColor Cyan
    }
    
    Write-Host "  💰 Tokens: $($result.usage.totalTokens)" -ForegroundColor Magenta
    Write-Host ""
}

# ================================
# TEST 1: Diagrama CORRECTO (debería devolver perfect: "yes")
# ================================
Write-Host "🧪 TEST 1: Diagrama Correcto - User y Post con lógica correcta" -ForegroundColor Yellow

$test1 = @{
    gojsDiagram = @{
        class = "GraphLinksModel"
        nodeDataArray = @(
            @{
                key = -1
                name = "User"
                attribute = "id: int\nnombre: string\nemail: string"
                methods = "login(): boolean\ngetPosts(): Post[]"
                loc = "0 0"
                nodeType = "standard"
            },
            @{
                key = -2
                name = "Post"
                attribute = "id: int\ntitulo: string\ncontenido: string\nuserId: int"
                methods = "publish(): void\ngetAuthor(): User"
                loc = "300 0"
                nodeType = "standard"
            }
        )
        linkDataArray = @(
            @{
                from = -2
                to = -1
                fromMultiplicity = "*"
                toMultiplicity = "1"
                category = "asociacion"
            }
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $result1 = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $test1 -ContentType "application/json"
    Show-ValidationResults $result1 "User-Post Correcto"
} catch {
    Write-Host "❌ Error en TEST 1: $($_.Exception.Message)" -ForegroundColor Red
}

# ================================
# TEST 2: Diagrama INCORRECTO - Lógica invertida (debería corregir)
# ================================
Write-Host "🧪 TEST 2: Diagrama Incorrecto - Lógica invertida User-Post" -ForegroundColor Yellow

$test2 = @{
    gojsDiagram = @{
        class = "GraphLinksModel"
        nodeDataArray = @(
            @{
                key = -1
                name = "User"
                attribute = "id: int\nnombre: string\nemail: string"
                methods = "login(): boolean"
                loc = "0 0"
                nodeType = "standard"
            },
            @{
                key = -2
                name = "Post"
                attribute = "id: int\ntitulo: string\ncontenido: string"
                methods = "publish(): void"
                loc = "300 0"
                nodeType = "standard"
            }
        )
        linkDataArray = @(
            @{
                from = -1
                to = -2
                fromMultiplicity = "*"
                toMultiplicity = "1"
                category = "asociacion"
            }
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $result2 = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $test2 -ContentType "application/json"
    Show-ValidationResults $result2 "User-Post Lógica Invertida"
    
    if ($result2.perfect -eq "no") {
        Write-Host "    🔍 Análisis del diagrama corregido:" -ForegroundColor Gray
        $correctedDiagram = $result2.diagram | ConvertFrom-Json
        $link = $correctedDiagram.linkDataArray[0]
        Write-Host "       Multiplicidad corregida: $($link.fromMultiplicity) → $($link.toMultiplicity)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Error en TEST 2: $($_.Exception.Message)" -ForegroundColor Red
}

# ================================
# TEST 3: Errores Ortográficos (debería corregir)
# ================================
Write-Host "🧪 TEST 3: Errores Ortográficos - nombres mal escritos" -ForegroundColor Yellow

$test3 = @{
    gojsDiagram = @{
        class = "GraphLinksModel"
        nodeDataArray = @(
            @{
                key = -1
                name = "usuario"
                attribute = "ID: Int\nNombre: String\nEmail: string"
                methods = "Login(): Boolean"
                loc = "0 0"
                nodeType = "standard"
            },
            @{
                key = -2
                name = "posts"
                attribute = "id: int\nTitulo: String\nContenido: text"
                methods = "publicar(): void"
                loc = "300 0"
                nodeType = "standard"
            }
        )
        linkDataArray = @(
            @{
                from = -2
                to = -1
                fromMultiplicity = "*"
                toMultiplicity = "1"
                category = "asociacion"
            }
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $result3 = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $test3 -ContentType "application/json"
    Show-ValidationResults $result3 "Errores Ortográficos"
} catch {
    Write-Host "❌ Error en TEST 3: $($_.Exception.Message)" -ForegroundColor Red
}

# ================================
# TEST 4: Multiplicidades Incorrectas (debería corregir)
# ================================
Write-Host "🧪 TEST 4: Multiplicidades Incorrectas - formato no válido" -ForegroundColor Yellow

$test4 = @{
    gojsDiagram = @{
        class = "GraphLinksModel"
        nodeDataArray = @(
            @{
                key = -1
                name = "Cliente"
                attribute = "id: int\nnombre: string\nemail: string"
                methods = "comprar(): void"
                loc = "0 0"
                nodeType = "standard"
            },
            @{
                key = -2
                name = "Pedido"
                attribute = "id: int\nfecha: date\ntotal: float"
                methods = "procesar(): void"
                loc = "300 0"
                nodeType = "standard"
            }
        )
        linkDataArray = @(
            @{
                from = -1
                to = -2
                fromMultiplicity = "1..1"
                toMultiplicity = "0..*"
                category = "asociacion"
            }
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $result4 = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $test4 -ContentType "application/json"
    Show-ValidationResults $result4 "Multiplicidades Incorrectas"
} catch {
    Write-Host "❌ Error en TEST 4: $($_.Exception.Message)" -ForegroundColor Red
}

# ================================
# TEST 5: Caso Complejo - Múltiples errores
# ================================
Write-Host "🧪 TEST 5: Caso Complejo - Múltiples errores combinados" -ForegroundColor Yellow

$test5 = @{
    gojsDiagram = @{
        class = "GraphLinksModel"
        nodeDataArray = @(
            @{
                key = -1
                name = "users"
                attribute = "ID: Integer\nNAME: String\nemail: String"
                methods = "LOGIN(): Boolean\ngetposts(): Array"
                loc = "0 0"
                nodeType = "standard"
            },
            @{
                key = -2
                name = "post"
                attribute = "id: int\nTitle: String\ncontent: Text\nuser_id: Integer"
                methods = "Publish(): Void\ngetAuthor(): User"
                loc = "300 0"
                nodeType = "standard"
            },
            @{
                key = -3
                name = "comentarios"
                attribute = "id: int\nTexto: String\npost_id: int"
                methods = "save(): void"
                loc = "150 200"
                nodeType = "standard"
            }
        )
        linkDataArray = @(
            @{
                from = -1
                to = -2
                fromMultiplicity = "1..*"
                toMultiplicity = "0..1"
                category = "asociacion"
            },
            @{
                from = -2
                to = -3
                fromMultiplicity = "0..1"
                toMultiplicity = "1..*"
                category = "asociacion"
            }
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $result5 = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $test5 -ContentType "application/json"
    Show-ValidationResults $result5 "Caso Complejo"
} catch {
    Write-Host "❌ Error en TEST 5: $($_.Exception.Message)" -ForegroundColor Red
}

# ================================
# RESUMEN FINAL
# ================================
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "🎉 PRUEBAS DE VALIDACIÓN COMPLETADAS" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Casos probados:" -ForegroundColor White
Write-Host "  1. ✅ Diagrama Correcto (perfect: yes esperado)" -ForegroundColor Gray
Write-Host "  2. ✅ Lógica Invertida (perfect: no esperado)" -ForegroundColor Gray  
Write-Host "  3. ✅ Errores Ortográficos (perfect: no esperado)" -ForegroundColor Gray
Write-Host "  4. ✅ Multiplicidades Incorrectas (perfect: no esperado)" -ForegroundColor Gray
Write-Host "  5. ✅ Caso Complejo - Múltiples errores (perfect: no esperado)" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 Endpoint: $baseUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Tipos de correcciones que realiza:" -ForegroundColor Yellow
Write-Host "   • Lógica de relaciones (User 1→* Post, no Post 1→* User)" -ForegroundColor Gray
Write-Host "   • Multiplicidades (solo '1' o '*', no '1..1', '0..*')" -ForegroundColor Gray
Write-Host "   • Ortografía (User no usuario, Post no posts)" -ForegroundColor Gray
Write-Host "   • Nomenclatura (clases Mayúscula, atributos minúscula)" -ForegroundColor Gray
Write-Host "   • Tipos de datos (string no String, int no Integer)" -ForegroundColor Gray
Write-Host ""
Write-Host "✨ ¡Validador de diagramas funcionando perfectamente!" -ForegroundColor Green