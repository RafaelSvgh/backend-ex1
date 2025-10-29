# Guía para Generar Diagramas UML con GoJS

Este endpoint está configurado para generar diagramas de clases UML en formato JSON compatible con GoJS.

## 🎯 Endpoint

**POST** `http://localhost:3001/ai/ask`

## 📝 Formato de Entrada

```json
{
  "question": "Tu descripción del diagrama UML aquí"
}
```

## ✅ Ejemplos de Uso

### Ejemplo 1: Sistema de Biblioteca

**Request:**
```json
{
  "question": "Genera un diagrama UML de un sistema de biblioteca con las clases: Biblioteca (nombre, direccion), Libro (titulo, isbn, autor), Prestamo (fechaPrestamo, fechaDevolucion). Una Biblioteca tiene muchos Libros (composicion). Un Prestamo está asociado a un Libro (1 a 1)."
}
```

**Response esperada:**
```json
{
  "class": "GraphLinksModel",
  "nodeDataArray": [
    {"key":-1,"name":"Biblioteca","attribute":"nombre: String\ndireccion: String","methods":"","loc":"-200 0","nodeType":"standard"},
    {"key":-2,"name":"Libro","attribute":"titulo: String\nisbn: String\nautor: String","methods":"","loc":"100 0","nodeType":"standard"},
    {"key":-3,"name":"Prestamo","attribute":"fechaPrestamo: Date\nfechaDevolucion: Date","methods":"","loc":"100 200","nodeType":"standard"}
  ],
  "linkDataArray": [
    {"from":-2,"to":-1,"fromMultiplicity":"*","toMultiplicity":"1","category":"composicion"},
    {"from":-3,"to":-2,"fromMultiplicity":"1","toMultiplicity":"1","category":"asociacion"}
  ]
}
```

### Ejemplo 2: Sistema Universitario

**Request:**
```json
{
  "question": "Crea un diagrama UML con: Universidad (nombre, ciudad), Facultad (nombre, numeroEdificio), Estudiante (nombre, matricula, email), Curso (nombre, codigo, creditos). Una Universidad tiene varias Facultades (composicion). Una Facultad tiene varios Estudiantes (agregacion). Un Estudiante puede inscribirse en varios Cursos (asociacion muchos a muchos)."
}
```

### Ejemplo 3: Sistema de E-commerce

**Request:**
```json
{
  "question": "Diagrama UML para e-commerce: Cliente (nombre, email, telefono), Pedido (numero, fecha, total), Producto (nombre, precio, stock), Direccion (calle, ciudad, codigoPostal). Un Cliente tiene una Direccion (agregacion 1 a 1). Un Cliente puede hacer varios Pedidos (asociacion 1 a muchos). Un Pedido puede contener varios Productos (asociacion muchos a muchos)."
}
```

### Ejemplo 4: Herencia

**Request:**
```json
{
  "question": "Diagrama con herencia: Vehiculo (marca, modelo, año) es la clase padre. Auto (numeroPuertas) y Motocicleta (cilindrada) heredan de Vehiculo."
}
```

**Response esperada:**
```json
{
  "class": "GraphLinksModel",
  "nodeDataArray": [
    {"key":-1,"name":"Vehiculo","attribute":"marca: String\nmodelo: String\naño: int","methods":"","loc":"0 0","nodeType":"standard"},
    {"key":-2,"name":"Auto","attribute":"numeroPuertas: int","methods":"","loc":"-150 200","nodeType":"standard"},
    {"key":-3,"name":"Motocicleta","attribute":"cilindrada: int","methods":"","loc":"150 200","nodeType":"standard"}
  ],
  "linkDataArray": [
    {"from":-2,"to":-1,"fromMultiplicity":"1","toMultiplicity":"1","category":"generalizacion"},
    {"from":-3,"to":-1,"fromMultiplicity":"1","toMultiplicity":"1","category":"generalizacion"}
  ]
}
```

## 📐 Tipos de Relaciones

### 1. Composición (rombo negro)
- **Descripción**: "Es parte de" - dependencia fuerte
- **Ejemplo**: Aula es parte de Edificio
- **Multiplicidad**: `fromMultiplicity="*"`, `toMultiplicity="1"`
- **Llave foránea**: En la parte (Aula)

```json
{"from":-2,"to":-1,"fromMultiplicity":"*","toMultiplicity":"1","category":"composicion"}
```

### 2. Agregación (rombo blanco)
- **Descripción**: "Tiene un" - dependencia débil
- **Ejemplo**: Facultad tiene Estudiantes
- **Multiplicidad**: Según cardinalidad

```json
{"from":-2,"to":-1,"fromMultiplicity":"*","toMultiplicity":"1","category":"agregacion"}
```

### 3. Asociación (línea simple)
- **Descripción**: Relación general entre clases
- **Cardinalidades**:
  - 1:1 → `"1"` y `"1"`
  - 1:N → `"1"` y `"*"`
  - N:N → `"*"` y `"*"`

```json
{"from":-1,"to":-2,"fromMultiplicity":"1","toMultiplicity":"*","category":"asociacion"}
```

### 4. Generalización/Herencia (flecha vacía)
- **Descripción**: Herencia entre clases
- **Multiplicidad**: Siempre `"1"` y `"1"`

```json
{"from":-2,"to":-1,"fromMultiplicity":"1","toMultiplicity":"1","category":"generalizacion"}
```

## 🎨 Reglas de Formato

### ✅ Nombres de Clases
- Primera letra MAYÚSCULA
- Ejemplos correctos: `Persona`, `Edificio`, `Usuario`

### ✅ Atributos
- Siempre en minúscula
- Sin prefijos (+, -, #)
- Formato: `nombreAtributo: tipo`
- Ejemplos: `nombre: String`, `edad: int`, `email: String`

### ✅ Tipos de Datos Comunes
- `String` - Texto
- `int` - Entero
- `double` - Decimal
- `boolean` - Verdadero/Falso
- `Date` - Fecha
- `LocalDateTime` - Fecha y hora

### ✅ Métodos
- Formato: `nombreMetodo(): tipoRetorno`
- Ejemplos: `calcularTotal(): double`, `validar(): boolean`

## 💡 Consejos para Mejores Resultados

1. **Sé específico con las relaciones:**
   - ✅ "Una Universidad tiene varias Facultades (composición)"
   - ❌ "Universidad y Facultad están relacionadas"

2. **Especifica la cardinalidad:**
   - ✅ "Un Cliente puede hacer varios Pedidos (1 a muchos)"
   - ❌ "Cliente tiene Pedidos"

3. **Indica el tipo de relación:**
   - Composición (parte de, pertenece a)
   - Agregación (tiene, contiene)
   - Asociación (relacionado con)
   - Herencia (es un, extiende)

4. **Menciona atributos con tipo:**
   - ✅ "Persona: nombre (String), edad (int), email (String)"
   - ❌ "Persona: nombre, edad, email"

## 🧪 Ejemplos Rápidos

### Sistema Bancario
```json
{
  "question": "Diagrama UML: Banco (nombre, codigo), Cuenta (numero, saldo, tipo), Cliente (nombre, dni, telefono). Un Banco tiene muchas Cuentas (composicion). Un Cliente puede tener varias Cuentas (asociacion muchos a muchos)."
}
```

### Red Social
```json
{
  "question": "UML para red social: Usuario (username, email, fechaRegistro), Publicacion (contenido, fechaPublicacion, likes), Comentario (texto, fecha). Un Usuario puede crear varias Publicaciones (asociacion 1 a muchos). Una Publicacion puede tener varios Comentarios (composicion)."
}
```

### Sistema Hospitalario
```json
{
  "question": "Diagrama médico: Hospital (nombre, direccion), Doctor (nombre, especialidad, licencia), Paciente (nombre, dni, fechaNacimiento), Cita (fecha, hora, motivo). Un Hospital emplea varios Doctores (agregacion). Un Doctor atiende varios Pacientes (asociacion muchos a muchos). Una Cita relaciona un Doctor con un Paciente."
}
```

## 🔍 Validación del JSON

El JSON generado debe ser válido y parseable. Puedes validarlo en:
- JSONLint: https://jsonlint.com/
- JSON Formatter: https://jsonformatter.org/

## ⚠️ Notas Importantes

1. La multiplicidad SOLO puede ser `"1"` o `"*"` (no `"0..1"`, `"1..*"`, etc.)
2. Los atributos deben estar en minúscula sin prefijos
3. Los nombres de clase deben empezar con mayúscula
4. El JSON debe ser directo, sin bloques de código markdown
5. La llave foránea siempre va en el lado "muchos" (*)

## 📊 Estructura del JSON

```typescript
{
  "class": "GraphLinksModel",
  "nodeDataArray": [
    {
      "key": -1,                    // Número negativo único
      "name": "NombreClase",        // Primera letra mayúscula
      "attribute": "attr1: tipo\nattr2: tipo",  // Atributos separados por \n
      "methods": "metodo1(): tipo", // Métodos separados por \n
      "loc": "x y",                 // Coordenadas
      "nodeType": "standard"        // Siempre "standard"
    }
  ],
  "linkDataArray": [
    {
      "from": -1,                   // key del nodo origen
      "to": -2,                     // key del nodo destino
      "fromMultiplicity": "1",      // Solo "1" o "*"
      "toMultiplicity": "*",        // Solo "1" o "*"
      "category": "composicion"     // Tipo de relación
    }
  ]
}
```
