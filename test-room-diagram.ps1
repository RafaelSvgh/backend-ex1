# Script de Prueba - Gestión de Diagramas y Salas por Admin
# Este script prueba los nuevos endpoints para actualizar diagramas y obtener salas por admin

Write-Host "📋 GESTIÓN DE DIAGRAMAS Y SALAS - PRUEBAS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3001/room"

# Función helper para mostrar resultados
function Show-Results {
    param($result, $testName)
    
    Write-Host "✅ $testName - Completado!" -ForegroundColor Green
    Write-Host "  📊 Resultado: $($result.message)" -ForegroundColor Cyan
    Write-Host ""
}

# ================================
# TEST 1: Actualizar Diagrama de una Sala
# ================================
Write-Host "🧪 TEST 1: Actualizar Diagrama en Sala Existente" -ForegroundColor Yellow
Write-Host "⚠️  Nota: Asegúrate de cambiar 'ROOM_ID_AQUI' por un ID de sala real" -ForegroundColor Gray
Write-Host ""

$roomIdToUpdate = "ROOM_ID_AQUI"  # ⚠️ CAMBIAR POR UN ID REAL

$updateDiagramTest = @{
    roomId = $roomIdToUpdate
    diagram = @{
        class = "GraphLinksModel"
        nodeDataArray = @(
            @{
                key = -1
                name = "User"
                attribute = "id: int\nnombre: string\nemail: string\npassword: string"
                methods = "login(): boolean\nlogout(): void\ngetProfile(): User"
                loc = "0 0"
                nodeType = "standard"
            },
            @{
                key = -2
                name = "Post"
                attribute = "id: int\ntitulo: string\ncontenido: string\nfechaCreacion: datetime\nuserId: int"
                methods = "publish(): void\nedit(): void\ndelete(): boolean"
                loc = "300 0"
                nodeType = "standard"
            },
            @{
                key = -3
                name = "Comment"
                attribute = "id: int\ncontenido: string\nfechaCreacion: datetime\npostId: int\nuserId: int"
                methods = "create(): void\nedit(): void\ndelete(): boolean"
                loc = "150 200"
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
            },
            @{
                from = -3
                to = -2
                fromMultiplicity = "*"
                toMultiplicity = "1"
                category = "asociacion"
            },
            @{
                from = -3
                to = -1
                fromMultiplicity = "*"
                toMultiplicity = "1"
                category = "asociacion"
            }
        )
    }
} | ConvertTo-Json -Depth 10

Write-Host "📤 Enviando actualización de diagrama..." -ForegroundColor Gray

try {
    $result1 = Invoke-RestMethod -Uri "$baseUrl/update-diagram" -Method Post -Body $updateDiagramTest -ContentType "application/json"
    Show-Results $result1 "Actualización de Diagrama"
    
    Write-Host "  🏠 Sala ID: $($result1.room.id)" -ForegroundColor Green
    Write-Host "  📝 Nombre: $($result1.room.name)" -ForegroundColor Green
    Write-Host "  👤 Admin ID: $($result1.room.adminId)" -ForegroundColor Green
    Write-Host "  🕒 Actualizado: $($result1.room.updatedAt)" -ForegroundColor Green
    Write-Host "  📊 Nodos en diagrama: $($result1.room.diagram.nodeDataArray.Count)" -ForegroundColor Green
    Write-Host "  🔗 Enlaces en diagrama: $($result1.room.diagram.linkDataArray.Count)" -ForegroundColor Green
    
} catch {
    $errorMessage = $_.Exception.Message
    if ($errorMessage -match "Room not found") {
        Write-Host "❌ Error: La sala con ID '$roomIdToUpdate' no existe" -ForegroundColor Red
        Write-Host "   💡 Consejo: Cambia 'ROOM_ID_AQUI' por un ID de sala real" -ForegroundColor Yellow
    } elseif ($errorMessage -match "ROOM_ID_AQUI") {
        Write-Host "❌ Error: Debes cambiar 'ROOM_ID_AQUI' por un ID de sala real" -ForegroundColor Red
        Write-Host "   💡 Ejecuta primero: GET /room para obtener IDs válidos" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error en TEST 1: $errorMessage" -ForegroundColor Red
    }
}

Write-Host ""

# ================================
# TEST 2: Obtener Salas por Admin ID
# ================================
Write-Host "🧪 TEST 2: Obtener Salas por Admin ID" -ForegroundColor Yellow
Write-Host "⚠️  Nota: Asegúrate de cambiar 'ADMIN_ID_AQUI' por un ID de admin real" -ForegroundColor Gray
Write-Host ""

$adminIdToTest = "ADMIN_ID_AQUI"  # ⚠️ CAMBIAR POR UN ID REAL

Write-Host "📤 Obteniendo salas del admin ID: $adminIdToTest..." -ForegroundColor Gray

try {
    $result2 = Invoke-RestMethod -Uri "$baseUrl/admin/$adminIdToTest" -Method Get
    Show-Results $result2 "Consulta de Salas por Admin"
    
    Write-Host "  👤 Admin ID: $($result2.adminId)" -ForegroundColor Green
    Write-Host "  🏠 Total de salas: $($result2.totalRooms)" -ForegroundColor Green
    Write-Host ""
    
    if ($result2.totalRooms -gt 0) {
        Write-Host "  📋 Detalles de las salas:" -ForegroundColor Cyan
        foreach ($room in $result2.rooms) {
            Write-Host "    🏠 Sala: $($room.name) (ID: $($room.id))" -ForegroundColor White
            Write-Host "       👥 Usuarios: $($room.userCount)" -ForegroundColor Gray
            Write-Host "       📅 Creada: $($room.createdAt)" -ForegroundColor Gray
            if ($room.diagram) {
                Write-Host "       📊 Diagrama: $($room.diagram.nodeDataArray.Count) nodos, $($room.diagram.linkDataArray.Count) enlaces" -ForegroundColor Gray
            } else {
                Write-Host "       📊 Diagrama: Sin diagrama" -ForegroundColor Gray
            }
            Write-Host ""
        }
    } else {
        Write-Host "  📭 No se encontraron salas para este admin" -ForegroundColor Yellow
    }
    
} catch {
    $errorMessage = $_.Exception.Message
    if ($errorMessage -match "Invalid admin ID format" -or $errorMessage -match "ADMIN_ID_AQUI") {
        Write-Host "❌ Error: Debes cambiar 'ADMIN_ID_AQUI' por un ID numérico real" -ForegroundColor Red
        Write-Host "   💡 Ejemplo: Cambiar por 1, 2, 3, etc." -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error en TEST 2: $errorMessage" -ForegroundColor Red
    }
}

# ================================
# TEST 3: Ejemplo con IDs de prueba
# ================================
Write-Host ""
Write-Host "🧪 TEST 3: Ejemplo con Admin ID = 1 (común en bases de datos)" -ForegroundColor Yellow

try {
    $result3 = Invoke-RestMethod -Uri "$baseUrl/admin/1" -Method Get
    Show-Results $result3 "Consulta Admin ID 1"
    
    Write-Host "  👤 Admin ID: $($result3.adminId)" -ForegroundColor Green
    Write-Host "  🏠 Total de salas: $($result3.totalRooms)" -ForegroundColor Green
    
    if ($result3.totalRooms -gt 0) {
        Write-Host "  ✅ ¡Encontramos salas! Usa estos IDs para el test de actualización:" -ForegroundColor Green
        foreach ($room in $result3.rooms[0..2]) {  # Mostrar máximo 3 salas
            Write-Host "     • Sala ID: $($room.id) - Nombre: '$($room.name)'" -ForegroundColor Cyan
        }
    }
    
} catch {
    Write-Host "  📭 No hay salas para Admin ID 1, o el admin no existe" -ForegroundColor Yellow
}

Write-Host ""

# ================================
# INFORMACIÓN ÚTIL
# ================================
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "📝 INFORMACIÓN PARA USAR LOS ENDPOINTS" -ForegroundColor Green
Write-Host ""

Write-Host "🔧 Endpoints disponibles:" -ForegroundColor Yellow
Write-Host "  POST /room/update-diagram" -ForegroundColor White
Write-Host "    Body: { ""roomId"": ""string"", ""diagram"": {...} }" -ForegroundColor Gray
Write-Host ""
Write-Host "  GET /room/admin/:adminId" -ForegroundColor White
Write-Host "    Param: adminId (número entero)" -ForegroundColor Gray
Write-Host ""

Write-Host "💡 Para obtener IDs reales:" -ForegroundColor Yellow
Write-Host "  1. GET /room (todas las salas)" -ForegroundColor Gray
Write-Host "  2. Buscar campo 'id' para roomId" -ForegroundColor Gray
Write-Host "  3. Buscar campo 'adminId' para admin" -ForegroundColor Gray
Write-Host ""

Write-Host "📊 Formato del diagrama:" -ForegroundColor Yellow
Write-Host "  • Se guarda como STRING en la BD (campo 'diagram')" -ForegroundColor Gray
Write-Host "  • Se recibe/devuelve como OBJECT en las APIs" -ForegroundColor Gray
Write-Host "  • Conversión automática JSON ↔ String" -ForegroundColor Gray
Write-Host ""

Write-Host "✨ ¡Endpoints de gestión de diagramas listos!" -ForegroundColor Green