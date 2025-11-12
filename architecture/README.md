# 🏗️ Arquitectura C4 - Level 4 (Código) 

## 📋 **Descripción General**

Este diagrama C4 de **Nivel 4 (Código)** muestra la arquitectura interna detallada del **UML Code Generator Backend**, un sistema NestJS que convierte diagramas UML en código funcional para Spring Boot y Flutter, además de ofrecer capacidades avanzadas de IA para generación y análisis de diagramas.

---

## 🎯 **Componentes Principales**

### 🔐 **Módulo de Autenticación**
- **AuthController**: Endpoints REST para registro y login
- **AuthService**: Lógica JWT, encriptación de passwords con bcryptjs
- **JWTAuthGuard**: Middleware de protección de rutas
- **JWTStrategy**: Validación de tokens con Passport

### 🏠 **Módulo de Salas (Core Business)**
- **RoomController**: API REST para gestión de salas y generación de código
- **RoomService**: Motor principal (2300+ líneas) de conversión UML → Código
- **CodeGeneratorEngine**: Orquestador de generación de archivos
- **SpringBootGenerator**: Genera proyectos Spring Boot 3.5.5 completos
- **FlutterGenerator**: Genera aplicaciones Flutter con navegación y validaciones

### 🤖 **Módulo de Inteligencia Artificial**
- **AiController**: APIs para procesamiento con IA (`/ask`, `/analyze-image`, `/fix-multiplicity`)
- **AiService**: Integración OpenAI GPT-4o y GPT-4o Vision
- **TextToUmlProcessor**: Convierte texto natural → JSON GoJS
- **ImageAnalyzer**: Analiza imágenes de diagramas → JSON GoJS  
- **MultiplicityCorrector**: Corrige multiplicidades UML automáticamente

### 🔄 **Módulo de WebSockets**
- **UserGateway**: Gateway Socket.IO para colaboración tiempo real
- **SocketService**: Gestión de eventos, salas y sincronización

### 🗄️ **Capa de Datos**
- **PrismaService**: ORM para PostgreSQL
- **UserTable**: Usuarios (email, name, password encrypted)
- **RoomTable**: Salas (id, name, diagram JSON, adminId)
- **UserRoomTable**: Relación many-to-many usuarios-salas

---

## 🔄 **Flujos de Datos Principales**

### 1️⃣ **Flujo de Generación de Código**
```
Frontend → RoomController → RoomService → CodeGeneratorEngine 
→ [SpringBootGenerator | FlutterGenerator] → ZIP Response
```

### 2️⃣ **Flujo de IA - Texto a Diagrama**
```
Frontend → AiController → AiService → TextToUmlProcessor 
→ OpenAI GPT-4o → JSON GoJS Response
```

### 3️⃣ **Flujo de IA - Análisis de Imagen**
```
Frontend → AiController (Multer) → AiService → ImageAnalyzer 
→ OpenAI GPT-4o Vision → JSON GoJS Response
```

### 4️⃣ **Flujo de Colaboración Tiempo Real**
```
Frontend WebSocket → UserGateway → SocketService 
→ RoomService → Broadcast a sala
```

---

## 🛡️ **Seguridad y Validación**

### **Autenticación**
- **JWT Bearer Tokens** con Passport
- **Password Hashing** con bcryptjs  
- **Route Guards** para proteger endpoints

### **Validación de Datos**
- **class-validator** en todos los DTOs
- **ValidationPipe** global para sanitización
- **Multer** para validación de archivos (20MB máx)

### **CORS Configuration**
- Habilitado para todos los orígenes (`origin: '*'`)
- Métodos: GET, HEAD, PUT, PATCH, POST, DELETE

---

## 📦 **Tecnologías y Dependencias**

### **Core Framework**
- **NestJS 11.0** - Framework principal
- **TypeScript** - Lenguaje de desarrollo
- **Node.js** - Runtime

### **Base de Datos**
- **PostgreSQL** - Base de datos principal  
- **Prisma ORM** - Cliente y migraciones
- **Prisma Client** generado en `/generated/prisma`

### **Inteligencia Artificial**
- **OpenAI SDK 6.7** - Integración GPT-4o/GPT-4o Vision
- **GPT-4o** - Procesamiento de texto
- **GPT-4o Vision** - Análisis de imágenes

### **Tiempo Real**
- **Socket.IO 4.8** - WebSockets
- **@nestjs/websockets** - Integración NestJS

### **Seguridad**
- **@nestjs/jwt** - JWT tokens
- **@nestjs/passport** - Autenticación
- **bcryptjs** - Hash de passwords

### **Validación y DTOs**
- **class-validator** - Validación declarativa
- **class-transformer** - Transformación de objetos
- **@nestjs/mapped-types** - DTOs helper

### **Archivos y Uploads**
- **Multer** - Upload de archivos
- **Archiver** - Generación de ZIP

---

## 🏗️ **Patrones Arquitectónicos**

### **Módulos NestJS**
- **Separation of Concerns** por módulos funcionales
- **Dependency Injection** con decoradores
- **Module Imports** para composición

### **Repository Pattern**
- **PrismaService** como repositorio único
- **Abstracción** de acceso a datos
- **Transacciones** implícitas en Prisma

### **DTO Pattern**
- **Validación** en capa de entrada
- **Transformación** de datos
- **Type Safety** con TypeScript

### **Service Layer**
- **Business Logic** en servicios
- **Reutilización** entre controladores
- **Testabilidad** mejorada

---

## 📊 **Métricas del Sistema**

### **Líneas de Código Principales**
- **RoomService**: ~2,300 líneas (generación de código)
- **AiService**: ~460 líneas (integración OpenAI)
- **AuthService**: ~90 líneas (autenticación)
- **UserGateway**: ~150 líneas (WebSockets)

### **APIs Expuestas**
- **Auth**: `/auth/login`, `/auth/register`
- **Rooms**: `/room/*` (CRUD, generación)
- **AI**: `/ai/ask`, `/ai/analyze-image`, `/ai/fix-multiplicity`
- **WebSocket**: Eventos de salas y colaboración

### **Capacidades del Generador**
- **Spring Boot**: Modelos JPA, Controllers REST, Services, DTOs
- **Flutter**: Models, Views, Controllers, Navigation, Forms
- **Validaciones**: Client-side y server-side
- **Dropdowns**: Foreign keys automáticos

---

## 🚀 **Cómo Visualizar el Diagrama**

### **Opción 1: Structurizr Online**
1. Ir a [structurizr.com](https://structurizr.com)
2. Crear cuenta gratuita
3. Subir el archivo `c4-level4-code.dsl`
4. Visualizar automáticamente

### **Opción 2: Structurizr CLI**
```bash
# Instalar Structurizr CLI
npm install -g @structurizr/cli

# Generar diagrama
structurizr export -workspace c4-level4-code.dsl -format svg
```

### **Opción 3: VS Code Extension**
1. Instalar "Structurizr DSL"
2. Abrir `c4-level4-code.dsl`
3. Vista previa automática

---

## 📏 **Estándares de Codificación**

### **Framework & Tooling**
- **NestJS 11.0** con TypeScript ES2023
- **ESLint** + **Prettier** (comillas simples, trailing commas)
- **Prisma ORM** para acceso a datos PostgreSQL

### **Arquitectura de Código**
- **Estructura modular**: `/modules/auth`, `/modules/room`, `/modules/ai`
- **Dependency Injection**: Constructor pattern con decoradores NestJS
- **DTOs con validación**: `class-validator` en todos los endpoints

### **Convenciones de Naming**
- **Archivos**: `*.service.ts`, `*.controller.ts`, `*.dto.ts`, `*.module.ts`
- **Clases**: PascalCase → `RoomService`, `AuthController`
- **Métodos**: camelCase → `createRoom()`, `validateUser()`
- **Constantes**: UPPER_SNAKE_CASE

### **Patrones de Desarrollo**
- **Error Handling**: `BadRequestException`, `UnauthorizedException`
- **Authentication**: JWT con Passport + bcryptjs
- **Validation**: DTOs con decoradores `@IsString()`, `@IsNotEmpty()`
- **Security**: Input sanitization, password hashing, CORS habilitado

### **Quality Control**
- **Scripts**: `npm run lint`, `npm run format`, `npm run start:dev`
- **TypeScript**: Strict mode, decorators experimentales
- **Testing**: Jest configurado (estructura preparada)

---

## 🎨 **Leyenda de Colores**

| Color | Tipo de Componente | Ejemplos |
|-------|-------------------|----------|
| 🔴 **Rojo** | API Controllers | AuthController, RoomController |
| 🟢 **Verde** | Business Logic | AuthService, RoomService |
| 🔵 **Azul** | Data Access | PrismaService, Database Tables |
| 🟡 **Amarillo** | Security | JWTAuthGuard, JWTStrategy |
| 🟣 **Morado** | AI Processing | TextToUmlProcessor, ImageAnalyzer |
| 🟠 **Naranja** | Code Generation | SpringBootGenerator, FlutterGenerator |
| 🔷 **Cian** | Real-time | UserGateway, SocketService |
| 🟪 **Rosa** | Data Transfer | DTOs, Validation Objects |

---

## 📝 **Notas de Arquitectura**

### **Decisiones de Diseño**
1. **Monolito Modular**: Un solo servicio NestJS con módulos bien separados
2. **Database First**: Prisma Schema como fuente de verdad
3. **API First**: Diseño REST con OpenAPI implícito
4. **AI Integration**: OpenAI como servicio externo crítico

### **Puntos de Extensión**
- **Nuevos Generadores**: Agregar React, Vue, .NET
- **Más Modelos IA**: Integrar Claude, Gemini
- **Plugins Arquitectura**: Sistema de plugins para generadores
- **Cache Layer**: Redis para diagramas frecuentes

### **Limitaciones Actuales**
- **Single Database**: Solo PostgreSQL soportado
- **AI Dependency**: Requiere OpenAI API key
- **Memory Intensive**: Generación de código en memoria
- **No Async Processing**: Generación síncrona únicamente

---

**📅 Generado**: Noviembre 2025  
**🔧 Framework**: NestJS 11.0 + TypeScript  
**🤖 IA**: OpenAI GPT-4o/Vision  
**📊 Nivel C4**: Level 4 (Código)