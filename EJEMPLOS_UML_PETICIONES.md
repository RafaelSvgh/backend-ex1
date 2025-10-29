# Ejemplos de Peticiones para Generar Diagramas UML

## 📌 Endpoint
`POST http://localhost:3001/ai/ask`

---

## 1️⃣ Sistema Educativo Simple

```json
{
  "question": "Genera un diagrama UML con: Persona (nombre, email), Edificio (nombre, direccion), Aula (numero). Un Edificio tiene varias Aulas (composicion). Una Persona trabaja en un Edificio (asociacion 1 a muchos)."
}
```

---

## 2️⃣ E-commerce Básico

```json
{
  "question": "Diagrama UML para tienda online: Cliente (nombre, email, telefono), Producto (nombre, precio, stock), Carrito (fechaCreacion, total). Un Cliente tiene un Carrito (agregacion 1 a 1). Un Carrito contiene varios Productos (asociacion muchos a muchos)."
}
```

---

## 3️⃣ Sistema Bancario

```json
{
  "question": "Crea un diagrama con: Banco (nombre, codigo), Sucursal (nombre, direccion), Cuenta (numero, saldo, tipo), Cliente (dni, nombre, telefono). Un Banco tiene varias Sucursales (composicion). Una Sucursal gestiona varias Cuentas (composicion). Un Cliente puede tener varias Cuentas (asociacion muchos a muchos)."
}
```

---

## 4️⃣ Herencia - Vehículos

```json
{
  "question": "Diagrama con herencia: Vehiculo (marca, modelo, año, color) es la clase padre. Auto (numeroPuertas, tipoTransmision) y Motocicleta (cilindrada, tipoManubrio) son clases hijas que heredan de Vehiculo."
}
```

---

## 5️⃣ Hospital Completo

```json
{
  "question": "Sistema hospitalario: Hospital (nombre, direccion, telefono), Departamento (nombre, piso), Doctor (nombre, especialidad, licencia), Paciente (dni, nombre, fechaNacimiento, tipoSangre), Cita (fecha, hora, motivo, diagnostico). Un Hospital tiene varios Departamentos (composicion). Un Departamento tiene varios Doctores (agregacion). Un Doctor atiende varios Pacientes (asociacion muchos a muchos). Una Cita relaciona un Doctor con un Paciente."
}
```

---

## 6️⃣ Red Social

```json
{
  "question": "Red social: Usuario (username, email, fechaRegistro, biografia), Publicacion (contenido, fechaPublicacion, likes, compartidos), Comentario (texto, fecha), Reaccion (tipo, fecha). Un Usuario puede crear varias Publicaciones (asociacion 1 a muchos). Una Publicacion puede tener varios Comentarios (composicion). Un Comentario pertenece a un Usuario (asociacion). Una Publicacion puede tener varias Reacciones (composicion)."
}
```

---

## 7️⃣ Biblioteca Digital

```json
{
  "question": "Biblioteca: Biblioteca (nombre, direccion, telefono), Seccion (nombre, piso), Libro (titulo, isbn, autor, editorial, año), Socio (dni, nombre, email, fechaInscripcion), Prestamo (fechaPrestamo, fechaDevolucion, estado). Una Biblioteca tiene varias Secciones (composicion). Una Seccion contiene varios Libros (agregacion). Un Socio puede hacer varios Prestamos (asociacion 1 a muchos). Un Prestamo se relaciona con un Libro (asociacion)."
}
```

---

## 8️⃣ Universidad Completa

```json
{
  "question": "Universidad: Universidad (nombre, ciudad, rector), Facultad (nombre, decano, edificio), Carrera (nombre, duracion, creditos), Curso (codigo, nombre, creditos, horasSemanales), Profesor (dni, nombre, especialidad, grado), Estudiante (matricula, nombre, email, fechaIngreso). Una Universidad tiene varias Facultades (composicion). Una Facultad ofrece varias Carreras (composicion). Una Carrera tiene varios Cursos (composicion). Un Profesor dicta varios Cursos (asociacion muchos a muchos). Un Estudiante se inscribe en varios Cursos (asociacion muchos a muchos)."
}
```

---

## 9️⃣ Restaurante

```json
{
  "question": "Sistema de restaurante: Restaurante (nombre, direccion, telefono, capacidad), Mesa (numero, capacidad, ubicacion), Reserva (fecha, hora, numeroPersonas), Cliente (dni, nombre, telefono, email), Pedido (numero, fecha, total, estado), Platillo (nombre, precio, categoria, descripcion). Un Restaurante tiene varias Mesas (composicion). Una Mesa puede tener varias Reservas (asociacion 1 a muchos). Un Cliente hace varias Reservas (asociacion 1 a muchos). Un Pedido pertenece a una Reserva (asociacion). Un Pedido contiene varios Platillos (asociacion muchos a muchos)."
}
```

---

## 🔟 Sistema de Transporte

```json
{
  "question": "Transporte público: Empresa (nombre, ruc, telefono), Ruta (codigo, nombre, origen, destino), Autobus (placa, modelo, capacidad, año), Conductor (dni, nombre, licencia, experiencia), Pasajero (dni, nombre, edad), Viaje (fecha, horaSalida, horaLlegada, tarifa). Una Empresa opera varias Rutas (composicion). Una Empresa tiene varios Autobuses (agregacion). Un Autobus realiza varios Viajes (asociacion 1 a muchos). Un Conductor maneja un Autobus por Viaje (asociacion). Un Viaje transporta varios Pasajeros (asociacion muchos a muchos)."
}
```

---

## 1️⃣1️⃣ Herencia Múltiple - Empleados

```json
{
  "question": "Diagrama con herencia: Persona (nombre, dni, fechaNacimiento, direccion) es la clase padre. Empleado (codigo, cargo, salario, fechaContratacion) hereda de Persona. Gerente (departamento, bonus) y Vendedor (comision, metaVentas) heredan de Empleado."
}
```

---

## 1️⃣2️⃣ Hotel Completo

```json
{
  "question": "Sistema hotelero: Hotel (nombre, direccion, estrellas, telefono), Piso (numero, tipo), Habitacion (numero, tipo, precio, capacidad), Huesped (dni, nombre, email, telefono), Reservacion (fechaEntrada, fechaSalida, numeroPersonas, total), Servicio (nombre, descripcion, costo). Un Hotel tiene varios Pisos (composicion). Un Piso tiene varias Habitaciones (composicion). Una Habitacion puede tener varias Reservaciones (asociacion 1 a muchos). Un Huesped hace varias Reservaciones (asociacion 1 a muchos). Una Reservacion puede incluir varios Servicios (asociacion muchos a muchos)."
}
```

---

## 1️⃣3️⃣ Cine

```json
{
  "question": "Sistema de cine: Cine (nombre, direccion, telefono), Sala (numero, capacidad, tipo), Pelicula (titulo, duracion, genero, clasificacion, director), Funcion (fecha, hora, precio), Entrada (numero, fila, asiento, precio), Cliente (dni, nombre, email). Un Cine tiene varias Salas (composicion). Una Sala programa varias Funciones (asociacion 1 a muchos). Una Funcion proyecta una Pelicula (asociacion). Una Funcion tiene varias Entradas (composicion). Un Cliente compra varias Entradas (asociacion 1 a muchos)."
}
```

---

## 1️⃣4️⃣ Gym

```json
{
  "question": "Gimnasio: Gimnasio (nombre, direccion, telefono), Area (nombre, tipo, capacidad), Maquina (nombre, marca, estado), Entrenador (dni, nombre, especialidad, certificacion), Socio (numero, nombre, email, telefono, fechaInscripcion), Membresia (tipo, duracion, precio, fechaInicio), Rutina (nombre, objetivo, duracion). Un Gimnasio tiene varias Areas (composicion). Un Area contiene varias Maquinas (agregacion). Un Gimnasio emplea varios Entrenadores (agregacion). Un Socio tiene una Membresia (asociacion 1 a 1). Un Entrenador crea varias Rutinas (asociacion 1 a muchos). Un Socio sigue varias Rutinas (asociacion muchos a muchos)."
}
```

---

## 1️⃣5️⃣ Clínica Veterinaria

```json
{
  "question": "Clínica veterinaria: Clinica (nombre, direccion, telefono), Veterinario (dni, nombre, especialidad, licencia), Mascota (nombre, especie, raza, edad, peso), Dueño (dni, nombre, telefono, email, direccion), Cita (fecha, hora, motivo), Tratamiento (nombre, descripcion, costo, duracion). Una Clinica emplea varios Veterinarios (agregacion). Un Dueño tiene varias Mascotas (composicion). Una Mascota tiene varias Citas (asociacion 1 a muchos). Un Veterinario atiende varias Citas (asociacion 1 a muchos). Una Cita puede incluir varios Tratamientos (asociacion muchos a muchos)."
}
```

---

## 💡 Tips para escribir tu pregunta

1. **Menciona las clases con sus atributos:**
   ```
   Cliente (nombre, email, telefono)
   ```

2. **Especifica las relaciones claramente:**
   ```
   Una Biblioteca tiene varios Libros (composicion)
   Un Cliente puede hacer varios Pedidos (asociacion 1 a muchos)
   ```

3. **Indica el tipo de relación:**
   - Composición: "es parte de", "pertenece a"
   - Agregación: "tiene", "contiene"
   - Asociación: "se relaciona con"
   - Herencia: "hereda de", "es un"

4. **Especifica la cardinalidad:**
   - 1 a 1: "tiene un", "tiene una"
   - 1 a muchos: "tiene varios", "tiene muchos"
   - muchos a muchos: "varios X con varios Y"

---

## ✅ Resultado Esperado

Todas las peticiones devolverán un JSON en el siguiente formato:

```json
{
  "question": "tu pregunta",
  "answer": "{ \"class\": \"GraphLinksModel\", \"nodeDataArray\": [...], \"linkDataArray\": [...] }",
  "model": "gpt-4o",
  "usage": {
    "promptTokens": 450,
    "completionTokens": 320,
    "totalTokens": 770
  }
}
```

El campo `answer` contendrá el JSON de GoJS que puedes usar directamente en tu aplicación.
