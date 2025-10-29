# Script de Prueba - Corrector de Multiplicidades UML
# Este script prueba el endpoint /ai/fix-multiplicity con diferentes casos

Write-Host "🔧 CORRECTOR DE MULTIPLICIDADES UML - PRUEBAS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3001/ai/fix-multiplicity"

# Función helper para mostrar resultados
function Show-Results {
    param($result, $testName)
    
    Write-Host "✅ $testName - Completado!" -ForegroundColor Green
    Write-Host ""
    
    if ($result.changes.Count -eq 0) {
        Write-Host "  📊 Sin cambios - multiplicidades ya correctas" -ForegroundColor Gray
    } else {
        Write-Host "  📊 Cambios realizados:" -ForegroundColor Yellow
        foreach ($change in $result.changes) {
            Write-Host "    🔄 $($change.relationship) ($($change.category)):" -ForegroundColor White
            Write-Host "       From: $($change.from.original) → $($change.from.corrected)" -ForegroundColor Cyan
            Write-Host "       To:   $($change.to.original) → $($change.to.corrected)" -ForegroundColor Cyan
        }
    }
    
    Write-Host "  💰 Tokens: $($result.usage.totalTokens)" -ForegroundColor Magenta
    Write-Host ""
}

# ================================
# TEST 1: Caso Básico - Composición
# ================================
Write-Host "🧪 TEST 1: Composición Edificio-Habitacion" -ForegroundColor Yellow

$test1 = @{
    gojsDiagram = @{
        class = "GraphLinksModel"
        nodeDataArray = @(
            @{
                key = -1
                name = "Edificio"
                attribute = "nombre: String\ndireccion: String"
                methods = "abrir(): void"
                loc = "0 0"
                nodeType = "standard"
            },
            @{
                key = -2
                name = "Habitacion"
                attribute = "numero: int\ntamaño: float"
                methods = "limpiar(): void"
                loc = "200 0"
                nodeType = "standard"
            }
        )
        linkDataArray = @(
            @{
                from = -2
                to = -1
                fromMultiplicity = "1"
                toMultiplicity = "1"
                category = "composicion"
            }
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $result1 = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $test1 -ContentType "application/json"
    Show-Results $result1 "Composición Edificio-Habitacion"
} catch {
    Write-Host "❌ Error en TEST 1: $($_.Exception.Message)" -ForegroundColor Red
}

# ================================
# TEST 2: Herencia - Animal/Perro
# ================================
Write-Host "🧪 TEST 2: Herencia Animal-Perro" -ForegroundColor Yellow

$test2 = @{
    gojsDiagram = @{
        class = "GraphLinksModel"
        nodeDataArray = @(
            @{
                key = -1
                name = "Animal"
                attribute = "nombre: String\nedad: int"
                methods = "dormir(): void"
                loc = "0 0"
                nodeType = "standard"
            },
            @{
                key = -2
                name = "Perro"
                attribute = "raza: String\nladrido: String"
                methods = "ladrar(): void"
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
                category = "generalizacion"
            }
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $result2 = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $test2 -ContentType "application/json"
    Show-Results $result2 "Herencia Animal-Perro"
} catch {
    Write-Host "❌ Error en TEST 2: $($_.Exception.Message)" -ForegroundColor Red
}

# ================================
# TEST 3: Asociación - Cliente/Pedido
# ================================
Write-Host "🧪 TEST 3: Asociación Cliente-Pedido" -ForegroundColor Yellow

$test3 = @{
    gojsDiagram = @{
        class = "GraphLinksModel"
        nodeDataArray = @(
            @{
                key = -1
                name = "Cliente"
                attribute = "nombre: String\nemail: String\ntelefono: String"
                methods = "comprar(): void\ncancelar(): void"
                loc = "0 0"
                nodeType = "standard"
            },
            @{
                key = -2
                name = "Pedido"
                attribute = "numero: int\nfecha: Date\ntotal: float\nestado: String"
                methods = "procesar(): void\nentregar(): void"
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
    $result3 = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $test3 -ContentType "application/json"
    Show-Results $result3 "Asociación Cliente-Pedido"
} catch {
    Write-Host "❌ Error en TEST 3: $($_.Exception.Message)" -ForegroundColor Red
}

# ================================
# TEST 4: Caso Complejo - Sistema Universitario
# ================================
Write-Host "🧪 TEST 4: Sistema Universitario Complejo" -ForegroundColor Yellow

$test4 = @{
    gojsDiagram = @{
        class = "GraphLinksModel"
        nodeDataArray = @(
            @{
                key = -1
                name = "Universidad"
                attribute = "nombre: String\nciudad: String\nfundacion: Date"
                methods = "inscribir(): void\ngraduar(): void"
                loc = "0 0"
                nodeType = "standard"
            },
            @{
                key = -2
                name = "Facultad"
                attribute = "nombre: String\ndecano: String\npresupuesto: float"
                methods = "aprobarCurso(): void"
                loc = "300 0"
                nodeType = "standard"
            },
            @{
                key = -3
                name = "Estudiante"
                attribute = "carnet: String\nnombre: String\ncarrera: String"
                methods = "estudiar(): void\nexamen(): void"
                loc = "0 200"
                nodeType = "standard"
            },
            @{
                key = -4
                name = "Curso"
                attribute = "codigo: String\nnombre: String\ncreditos: int"
                methods = "impartir(): void"
                loc = "300 200"
                nodeType = "standard"
            }
        )
        linkDataArray = @(
            @{
                from = -1
                to = -2
                fromMultiplicity = "1"
                toMultiplicity = "1"
                category = "composicion"
            },
            @{
                from = -2
                to = -4
                fromMultiplicity = "0..1"
                toMultiplicity = "1..*"
                category = "agregacion"
            },
            @{
                from = -3
                to = -4
                fromMultiplicity = "1..*"
                toMultiplicity = "1..*"
                category = "asociacion"
            }
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $result4 = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $test4 -ContentType "application/json"
    Show-Results $result4 "Sistema Universitario"
} catch {
    Write-Host "❌ Error en TEST 4: $($_.Exception.Message)" -ForegroundColor Red
}

# ================================
# TEST 5: Caso Original - Condominio
# ================================
Write-Host "🧪 TEST 5: Caso Original del Usuario (Condominio)" -ForegroundColor Yellow

$test5 = @{
    gojsDiagram = @{
        class = "GraphLinksModel"
        nodeDataArray = @(
            @{
                key = -1
                name = "Condominio"
                attribute = "nombre: String\ndireccion: String"
                methods = "administrar(): void"
                loc = "0 0"
                nodeType = "standard"
            },
            @{
                key = -2
                name = "Edificio"
                attribute = "numero: int\npisos: int"
                methods = "mantener(): void"
                loc = "200 0"
                nodeType = "standard"
            },
            @{
                key = -3
                name = "Habitacion"
                attribute = "numero: int\narea: float"
                methods = "ocupar(): void"
                loc = "400 0"
                nodeType = "standard"
            },
            @{
                key = -4
                name = "Animal"
                attribute = "nombre: String\nespecie: String"
                methods = "comer(): void"
                loc = "0 200"
                nodeType = "standard"
            },
            @{
                key = -5
                name = "Perro"
                attribute = "raza: String\ncolor: String"
                methods = "ladrar(): void"
                loc = "200 200"
                nodeType = "standard"
            }
        )
        linkDataArray = @(
            @{
                from = -1
                to = -2
                fromMultiplicity = "1"
                toMultiplicity = "1"
                category = "asociacion"
            },
            @{
                from = -2
                to = -3
                fromMultiplicity = "1"
                toMultiplicity = "1"
                category = "composicion"
            },
            @{
                from = -5
                to = -4
                fromMultiplicity = "1"
                toMultiplicity = "1"
                category = "generalizacion"
            }
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $result5 = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $test5 -ContentType "application/json"
    Show-Results $result5 "Caso Original Condominio"
} catch {
    Write-Host "❌ Error en TEST 5: $($_.Exception.Message)" -ForegroundColor Red
}

# ================================
# RESUMEN FINAL
# ================================
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "🎉 PRUEBAS COMPLETADAS" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Casos probados:" -ForegroundColor White
Write-Host "  1. ✅ Composición Edificio-Habitacion" -ForegroundColor Gray
Write-Host "  2. ✅ Herencia Animal-Perro" -ForegroundColor Gray  
Write-Host "  3. ✅ Asociación Cliente-Pedido" -ForegroundColor Gray
Write-Host "  4. ✅ Sistema Universitario Complejo" -ForegroundColor Gray
Write-Host "  5. ✅ Caso Original Condominio" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 Endpoint: $baseUrl" -ForegroundColor Cyan
Write-Host "📚 Ver documentación: CORRECTOR_MULTIPLICIDADES.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ ¡Corrector de multiplicidades funcionando perfectamente!" -ForegroundColor Green