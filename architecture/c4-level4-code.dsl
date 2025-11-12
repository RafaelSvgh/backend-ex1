workspace "UML Code Generator Backend" "Diagrama C4 - Level 4 (Código) del Backend Generador de Código UML" {

    model {
        user = person "Desarrollador Frontend" "Usuario que consume las APIs del backend para generar código desde diagramas UML"
        
        umlBackend = softwareSystem "UML Code Generator Backend" "Sistema backend NestJS que convierte diagramas UML a código Flutter/Spring Boot y ofrece capacidades de IA para análisis de diagramas" {
            
            // === CONTENEDOR PRINCIPAL ===
            nestjsContainer = container "NestJS Application" "Aplicación Node.js/TypeScript" "NestJS Framework" {
                
                // === COMPONENTES DE INFRAESTRUCTURA ===
                mainBootstrap = component "Main Bootstrap" "Punto de entrada de la aplicación, configuración CORS y validación global" "TypeScript/NestJS" "Infrastructure"
                appModule = component "App Module" "Módulo raíz que orquesta todos los módulos del sistema" "TypeScript/NestJS" "Infrastructure"
                envConfig = component "Environment Config" "Gestión de variables de entorno y configuración" "TypeScript/Joi" "Infrastructure"
                
                // === MÓDULO DE AUTENTICACIÓN ===
                authController = component "Auth Controller" "Endpoints REST para registro y login de usuarios" "TypeScript/NestJS" "API"
                authService = component "Auth Service" "Lógica de negocio para autenticación, JWT y validación de credenciales" "TypeScript/bcryptjs" "Business Logic"
                authGuard = component "JWT Auth Guard" "Middleware de autenticación basado en JWT para proteger rutas" "TypeScript/Passport" "Security"
                jwtStrategy = component "JWT Strategy" "Estrategia de autenticación JWT para validar tokens" "TypeScript/Passport-JWT" "Security"
                
                // === MÓDULO DE USUARIOS ===
                usersService = component "Users Service" "CRUD de usuarios, gestión de perfiles y validaciones" "TypeScript/Prisma" "Business Logic"
                userResponseDto = component "User Response DTO" "Objeto de transferencia de datos para respuestas de usuario (sin password)" "TypeScript/class-validator" "Data Transfer"
                
                // === MÓDULO DE SALAS (CORE BUSINESS) ===
                roomController = component "Room Controller" "API REST para gestión de salas y generación de código" "TypeScript/NestJS" "API"
                roomService = component "Room Service" "Motor de generación de código: convierte JSON GoJS a proyectos Flutter/Spring Boot completos" "TypeScript" "Business Logic"
                codeGeneratorEngine = component "Code Generator Engine" "Generador de archivos: modelos, controladores, servicios, DTOs, vistas Flutter" "TypeScript/Archiver" "Business Logic"
                springBootGenerator = component "Spring Boot Generator" "Genera proyectos Spring Boot 3.5.5 con JPA, validaciones y estructura REST" "TypeScript" "Code Generation"
                flutterGenerator = component "Flutter Generator" "Genera aplicaciones Flutter con navegación, formularios, validaciones y dropdowns" "TypeScript" "Code Generation"
                
                // === MÓDULO DE IA (INTELIGENCIA ARTIFICIAL) ===
                aiController = component "AI Controller" "APIs para generación y análisis de diagramas UML con IA" "TypeScript/NestJS/Multer" "API"
                aiService = component "AI Service" "Integración con OpenAI GPT-4o para procesamiento de texto e imágenes" "TypeScript/OpenAI" "Business Logic"
                textToUmlProcessor = component "Text to UML Processor" "Convierte descripciones de texto a diagramas GoJS UML válidos" "TypeScript/OpenAI" "AI Processing"
                imageAnalyzer = component "Image Analyzer" "Analiza imágenes de diagramas UML usando GPT-4o Vision" "TypeScript/OpenAI" "AI Processing"
                multiplicityCorrector = component "Multiplicity Corrector" "Corrige multiplicidades UML siguiendo reglas de composición, agregación y herencia" "TypeScript/OpenAI" "AI Processing"
                
                // === MÓDULO DE WEBSOCKETS ===
                userGateway = component "User Gateway" "WebSocket Gateway para colaboración en tiempo real en salas" "TypeScript/Socket.IO" "Real-time Communication"
                socketService = component "Socket Service" "Gestión de eventos WebSocket, entrada/salida de salas y sincronización" "TypeScript" "Business Logic"
                
                // === SERVICIOS COMPARTIDOS ===
                prismaService = component "Prisma Service" "Cliente ORM para acceso a base de datos PostgreSQL" "TypeScript/Prisma" "Data Access"
                validationService = component "Validation Service" "Validaciones globales usando class-validator y DTOs" "TypeScript/class-validator" "Validation"
                
                // === OBJETOS DE TRANSFERENCIA DE DATOS ===
                createRoomDto = component "Create Room DTO" "Validación de datos para creación de salas" "TypeScript/class-validator" "Data Transfer"
                askQuestionDto = component "Ask Question DTO" "DTO para peticiones de generación de diagramas por texto" "TypeScript/class-validator" "Data Transfer"
                analyzeImageDto = component "Analyze Image DTO" "DTO para análisis de imágenes de diagramas" "TypeScript/class-validator" "Data Transfer"
                fixMultiplicityDto = component "Fix Multiplicity DTO" "DTO para corrección de multiplicidades UML" "TypeScript/class-validator" "Data Transfer"
            }
            
            // === BASES DE DATOS ===
            database = container "PostgreSQL Database" "Almacena usuarios, salas y diagramas UML" "PostgreSQL" {
                userTable = component "User Table" "Almacena datos de usuarios: email, name, password (encriptado), isActive" "PostgreSQL" "Data Storage"
                roomTable = component "Room Table" "Almacena salas: id, name, diagram (JSON GoJS), adminId" "PostgreSQL" "Data Storage"
                userRoomTable = component "UserRoom Table" "Relación muchos-a-muchos entre usuarios y salas" "PostgreSQL" "Data Storage"
            }
            
            // === SERVICIOS EXTERNOS ===
            openaiApi = container "OpenAI API" "Servicio externo de IA para procesamiento de texto e imágenes" "OpenAI GPT-4o/GPT-4o Vision" {
                gptTextModel = component "GPT-4o Text Model" "Modelo de IA para generación de diagramas UML desde texto" "OpenAI" "External AI"
                gptVisionModel = component "GPT-4o Vision Model" "Modelo de IA para análisis de imágenes de diagramas" "OpenAI" "External AI"
            }
        }
        
        // === RELACIONES ENTRE COMPONENTES ===
        
        // Usuario accede al sistema
        user -> authController "Autenticación (POST /auth/login, /auth/register)"
        user -> roomController "Gestión de salas y generación de código (REST API)"
        user -> aiController "Generación de diagramas con IA (REST API)"
        user -> userGateway "Colaboración en tiempo real (WebSocket)"
        
        // Flujo de autenticación
        authController -> authService "Valida credenciales"
        authService -> usersService "Gestiona datos de usuarios"
        authService -> prismaService "Acceso a datos"
        authGuard -> jwtStrategy "Validación de tokens"
        
        // Flujo de gestión de salas y generación de código
        roomController -> roomService "Procesamiento de diagramas"
        roomService -> codeGeneratorEngine "Generación de archivos"
        codeGeneratorEngine -> springBootGenerator "Genera Spring Boot"
        codeGeneratorEngine -> flutterGenerator "Genera Flutter"
        roomService -> prismaService "Persistencia de salas"
        
        // Flujo de IA para diagramas
        aiController -> aiService "Procesamiento con IA"
        aiService -> textToUmlProcessor "Texto a UML"
        aiService -> imageAnalyzer "Análisis de imágenes"
        aiService -> multiplicityCorrector "Corrección de multiplicidades"
        textToUmlProcessor -> gptTextModel "Generación con GPT-4o"
        imageAnalyzer -> gptVisionModel "Análisis con GPT-4o Vision"
        multiplicityCorrector -> gptTextModel "Corrección con GPT-4o"
        
        // Flujo de WebSockets
        userGateway -> socketService "Gestión de eventos"
        userGateway -> roomService "Sincronización de salas"
        
        // Acceso a datos
        usersService -> prismaService "CRUD usuarios"
        roomService -> prismaService "CRUD salas"
        prismaService -> userTable "Consultas usuarios"
        prismaService -> roomTable "Consultas salas"
        prismaService -> userRoomTable "Relaciones usuario-sala"
        
        // Validaciones
        authController -> createRoomDto "Validación entrada"
        aiController -> askQuestionDto "Validación texto"
        aiController -> analyzeImageDto "Validación imágenes"
        aiController -> fixMultiplicityDto "Validación multiplicidades"
        
        // Configuración y bootstrap
        mainBootstrap -> appModule "Inicialización"
        appModule -> authController "Carga módulo auth"
        appModule -> roomController "Carga módulo room"
        appModule -> aiController "Carga módulo AI"
        appModule -> userGateway "Carga módulo WebSocket"
        envConfig -> aiService "Configuración OpenAI"
        
        // Servicios externos
        aiService -> openaiApi "Llamadas API OpenAI"
    }

    views {
        // === VISTA DE CÓDIGO C4 LEVEL 4 ===
        component nestjsContainer "UMLCodeGeneratorCodeView" {
            title "UML Code Generator Backend - C4 Level 4 (Código)"
            description "Vista detallada de componentes, clases y módulos del sistema backend NestJS"
            
            include *
            autoLayout tb
        }
        
        // === VISTA MÓDULO DE IA ===
        component nestjsContainer "AIModuleView" {
            title "Módulo de Inteligencia Artificial - Componentes"
            description "Detalle del módulo AI: procesamiento de texto, análisis de imágenes y corrección de multiplicidades"
            
            include aiController
            include aiService
            include textToUmlProcessor
            include imageAnalyzer
            include multiplicityCorrector
            include askQuestionDto
            include analyzeImageDto
            include fixMultiplicityDto
            include gptTextModel
            include gptVisionModel
            include openaiApi
            
            autoLayout tb
        }
        
        // === VISTA GENERADOR DE CÓDIGO ===
        component nestjsContainer "CodeGeneratorView" {
            title "Motor de Generación de Código - Componentes"
            description "Detalle del sistema de generación: Room Service, generadores de Spring Boot y Flutter"
            
            include roomController
            include roomService
            include codeGeneratorEngine
            include springBootGenerator
            include flutterGenerator
            include createRoomDto
            include prismaService
            include roomTable
            
            autoLayout tb
        }
        
        // === VISTA DE AUTENTICACIÓN ===
        component nestjsContainer "AuthModuleView" {
            title "Módulo de Autenticación - Componentes"
            description "Sistema de autenticación JWT: controladores, servicios, guards y estrategias"
            
            include authController
            include authService
            include authGuard
            include jwtStrategy
            include usersService
            include userResponseDto
            include prismaService
            include userTable
            
            autoLayout tb
        }
        
        // === VISTA WEBSOCKETS ===
        component nestjsContainer "WebSocketView" {
            title "Sistema de Tiempo Real - WebSockets"
            description "Arquitectura de colaboración en tiempo real usando Socket.IO"
            
            include userGateway
            include socketService
            include roomService
            include userRoomTable
            
            autoLayout lr
        }
        
        // === ESTILOS ===
        styles {
            element "Person" {
                shape person
                background #08427b
                color #ffffff
            }
            element "Software System" {
                background #1168bd
                color #ffffff
            }
            element "Container" {
                background #438dd5
                color #ffffff
            }
            element "Component" {
                background #85bbf0
                color #000000
            }
            element "API" {
                background #ff6b6b
                color #ffffff
            }
            element "Business Logic" {
                background #4ecdc4
                color #ffffff
            }
            element "Data Access" {
                background #45b7d1
                color #ffffff
            }
            element "Infrastructure" {
                background #96ceb4
                color #000000
            }
            element "Security" {
                background #feca57
                color #000000
            }
            element "Data Transfer" {
                background #ff9ff3
                color #000000
            }
            element "Code Generation" {
                background #54a0ff
                color #ffffff
            }
            element "AI Processing" {
                background #5f27cd
                color #ffffff
            }
            element "Real-time Communication" {
                background #00d2d3
                color #ffffff
            }
            element "Data Storage" {
                background #2ed573
                color #ffffff
            }
            element "External AI" {
                background #8c7ae6
                color #ffffff
            }
            element "Validation" {
                background #fd79a8
                color #ffffff
            }
        }
    }
}