import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UserService } from './user.service';
import { OnModuleInit } from '@nestjs/common';

import { Server } from 'socket.io';
import { RoomService } from 'src/modules/room/room.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class UserGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;
  public rooms = {};
  constructor(
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
        for (const room in this.rooms) {
          if (this.rooms[room].users.includes(socket.id)) {
            this.rooms[room].users = this.rooms[room].users.filter(
              (userId) => userId !== socket.id,
            );
            if (this.rooms[room].users.length === 0) {
              delete this.rooms[room];
            }
            console.log(`Cliente ${socket.id} eliminado de la sala ${room}`);
          }
        }
      });

      socket.on('crear-sala', (payload) => {
        this.rooms[payload] = { users: [socket.id], diagrama: {} };
        socket.join(payload);
        console.log(`Sala ${payload} creada por ${socket.id}`);
        console.log(this.rooms);
      });

      socket.on('reconectar-a-sala', (payload) => {
        if (!this.rooms[payload]) {
          socket.join(payload);
          this.rooms[payload] = { users: [socket.id], diagrama: {} };
        } else {
          socket.join(payload);
          if (!this.rooms[payload].users.includes(socket.id)) {
            this.rooms[payload].users.push(socket.id);
          }
        }
        socket.emit('reconectar-a-sala', this.rooms[payload].diagrama);
      });

      // Unirse a una sala existente
      socket.on('unirse-a-sala', (roomCode) => {
        if (this.rooms[roomCode]) {
          socket.join(roomCode);
          this.rooms[roomCode].users.push(socket.id);
          console.log(`Usuario ${socket.id} se unió a la sala ${roomCode}`);
          //socket.emit("cargar-diagrama", rooms[roomCode].diagrama);
          socket.emit('reconectar-a-sala', this.rooms[roomCode].diagrama);
        } else {
          console.log(
            `Sala ${roomCode} no encontrada para el usuario ${socket.id}`,
          );
        }
      });

      socket.on('cargar-diagrama', (payload) => {
        if (!this.rooms[payload.room]) {
          socket.join(payload.room);
          this.rooms[payload.room] = {
            users: [socket.id],
            diagrama: payload.diagrama,
          };
        } else {
          socket.join(payload);
          if (!this.rooms[payload.room].users.includes(socket.id)) {
            this.rooms[payload.room].users.push(socket.id);
            this.rooms[payload.room].diagrama = payload.diagrama;
          } else {
            this.rooms[payload.room].diagrama = payload.diagrama;
          }
        }
        console.log(this.rooms);
      });

      socket.on('actualizar-titulo', (payload) => {
        this.server.to(payload.room).emit('titulo-actualizado', payload);
      });

      socket.on('nuevo-nodo', (payload) => {
        socket.to(payload.room).emit('agregar-nodo', payload.nodo);
      });

      socket.on('actualizar-atributo', (payload) => {
        this.server.to(payload.room).emit('atributo-actualizado', payload);
      });

      socket.on('nodo-movido', (payload) => {
        socket.to(payload.room).emit('mover-nodo', payload);
      });

      socket.on('nuevo-enlace', (payload) => {
        socket.to(payload.room).emit('agregar-enlace', payload.link);
      });

      socket.on('actualizar-enlace', (payload) => {
        socket.to(payload.room).emit('enlace-actualizado', payload.link);
      });

      socket.on('crear-relacion-muchos-a-muchos', (payload) => {
        socket.to(payload.room).emit('actualizar-muchos-a-muchos', payload);
      });

      socket.on('agregar-enlace-recursivo', (payload) => {
        socket.to(payload.room).emit('enlace-recursivo-agregado', payload.nodo);
      });

      socket.on('nodo-eliminado', (payload) => {
        socket.to(payload.room).emit('nodo-eliminado', payload);
      });

      socket.on('enlace-eliminado', (payload) => {
        socket.to(payload.room).emit('enlace-eliminado', payload);
      });

      socket.on('actualizar-multiplicidad', (payload) => {
        socket.to(payload.room).emit('actualizar-multiplicidad', payload);
      });

      socket.on('enviar-diagrama', (payload) => {
        this.rooms[payload.room].diagrama = payload.diagrama;
        console.log(this.rooms[payload.room]);
      });
    });
  }
}
