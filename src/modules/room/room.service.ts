import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaClient } from 'generated/prisma';
import * as fs from 'fs';
import * as path from 'path';

// Interfaces para el modelo de datos
interface NodeData {
  key: number;
  name: string;
  attribute: string;
  loc: string;
  nodeType: string;
}

interface LinkData {
  from: number;
  to: number;
  fromMultiplicity: string;
  toMultiplicity: string;
  category: string;
}

interface DiagramModel {
  class: string;
  nodeDataArray: NodeData[];
  linkDataArray: LinkData[];
}

interface ParsedAttribute {
  name: string;
  type: string;
}

interface EntityRelation {
  targetEntity: string;
  relationType: 'OneToMany' | 'ManyToOne' | 'OneToOne' | 'ManyToMany';
  mappedBy?: string;
  joinColumn?: string;
}

@Injectable()
export class RoomService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(RoomService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('Module initialized');
  }

  create(createRoomDto: CreateRoomDto) {
    const { adminId } = createRoomDto;

    const user = this.user.findUnique({
      where: { id: adminId, isActive: true },
    });

    if (!user) {
      throw new HttpException(
        {
          message: 'User not found',
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.room.create({ data: createRoomDto });
  }

  findAll() {
    return `This action returns all room`;
  }

  async findOne(id: string) {
    const room = await this.room.findUnique({ where: { id } });
    if (!room) {
      throw new HttpException(
        {
          message: 'Room not found',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    await this.findOne(id);
    return this.room.update({
      where: { id },
      data: updateRoomDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.room.delete({ where: { id } });
  }

  async adminRoom(roomId: string) {
    const room = await this.room.findUnique({
      where: { id: roomId },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!room) {
      throw new HttpException(
        {
          message: 'Room not found',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return room.admin;
  }

  async roomUsers(roomId: string) {
    const room = await this.room.findUnique({
      where: { id: roomId },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!room) {
      throw new HttpException(
        {
          message: 'Room not found',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return room.users.map((u) => u.user);
  }

  async addUserToRoom(roomId: string, userId: number) {
    const room = await this.room.findUnique({ where: { id: roomId } });
    console.log(room);
    if (!room) {
      throw new HttpException(
        {
          message: 'Room not found',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Verificar que el usuario existe
    const user = await this.user.findUnique({ where: { id: userId } });
    console.log(user);
    if (!user) {
      throw new HttpException(
        {
          message: 'User not found',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Verificar si el usuario ya está en la sala
    const existingUserRoom = await this.userRoom.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });

    if (existingUserRoom) {
      return existingUserRoom;
    }

    // Crear relación en UserRoom
    const userRoom = await this.userRoom.create({
      data: {
        userId,
        roomId,
      },
    });
    console.log(userRoom);
    return userRoom;
  }

  async getUsersByRoom(roomId: string) {
    const users = await this.userRoom.findMany({
      where: { roomId },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return users.map((ur) => ur.user);
  }

  async removeUserFromRoom(roomId: string, userId: number) {
    const room = await this.findOne(roomId);
    if (!room) {
      throw new HttpException(
        {
          message: 'Room not found',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const user = await this.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HttpException(
        {
          message: 'User not found',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.userRoom.deleteMany({
      where: {
        roomId,
        userId,
      },
    });
  }

  async generateJavaFiles(entities: string[]) {
    const results: Array<{
      entity: string;
      files?: {
        entity: string;
        repository: string;
        service: string;
        controller: string;
        createDto?: string;
        updateDto?: string;
        responseDto?: string;
      };
      error?: string;
      status: 'success' | 'error';
    }> = [];

    for (const entityName of entities) {
      try {
        const capitalizedEntity = this.capitalizeFirstLetter(entityName);
        const basePath = path.join(
          process.cwd(),
          'back_examen',
          'src',
          'main',
          'java',
          'com',
          'example',
          'back_examen',
        );

        // Generar Entity
        const entityContent = this.generateEntityTemplate(capitalizedEntity);
        const entityPath = path.join(
          basePath,
          'entity',
          `${capitalizedEntity}.java`,
        );
        this.ensureDirectoryExists(path.dirname(entityPath));
        fs.writeFileSync(entityPath, entityContent);

        // Generar Repository
        const repositoryContent =
          this.generateRepositoryTemplate(capitalizedEntity);
        const repositoryPath = path.join(
          basePath,
          'repository',
          `${capitalizedEntity}Repository.java`,
        );
        this.ensureDirectoryExists(path.dirname(repositoryPath));
        fs.writeFileSync(repositoryPath, repositoryContent);

        // Generar Service
        const serviceContent = this.generateServiceTemplate(capitalizedEntity);
        const servicePath = path.join(
          basePath,
          'service',
          `${capitalizedEntity}Service.java`,
        );
        this.ensureDirectoryExists(path.dirname(servicePath));
        fs.writeFileSync(servicePath, serviceContent);

        // Generar Controller
        const controllerContent =
          this.generateControllerTemplate(capitalizedEntity);
        const controllerPath = path.join(
          basePath,
          'controller',
          `${capitalizedEntity}Controller.java`,
        );
        this.ensureDirectoryExists(path.dirname(controllerPath));
        fs.writeFileSync(controllerPath, controllerContent);

        results.push({
          entity: entityName,
          files: {
            entity: entityPath,
            repository: repositoryPath,
            service: servicePath,
            controller: controllerPath,
          },
          status: 'success',
        });
      } catch (error) {
        results.push({
          entity: entityName,
          error: error.message,
          status: 'error',
        });
      }
    }

    return {
      message: 'Java files generation completed',
      results,
    };
  }

  async generateJavaFilesInPath(entities: string[], projectPath: string) {
    const results: Array<{
      entity: string;
      files?: {
        entity: string;
        repository: string;
        service: string;
        controller: string;
        createDto?: string;
        updateDto?: string;
        responseDto?: string;
      };
      error?: string;
      status: 'success' | 'error';
    }> = [];

    for (const entityName of entities) {
      try {
        const capitalizedEntity = this.capitalizeFirstLetter(entityName);
        const basePath = path.join(
          projectPath,
          'src',
          'main',
          'java',
          'com',
          'example',
          'back_examen',
        );

        // Generar Entity
        const entityContent = this.generateEntityTemplate(capitalizedEntity);
        const entityPath = path.join(
          basePath,
          'entity',
          `${capitalizedEntity}.java`,
        );
        this.ensureDirectoryExists(path.dirname(entityPath));
        fs.writeFileSync(entityPath, entityContent);

        // Generar Repository
        const repositoryContent =
          this.generateRepositoryTemplate(capitalizedEntity);
        const repositoryPath = path.join(
          basePath,
          'repository',
          `${capitalizedEntity}Repository.java`,
        );
        this.ensureDirectoryExists(path.dirname(repositoryPath));
        fs.writeFileSync(repositoryPath, repositoryContent);

        // Generar Service
        const serviceContent = this.generateServiceTemplate(capitalizedEntity);
        const servicePath = path.join(
          basePath,
          'service',
          `${capitalizedEntity}Service.java`,
        );
        this.ensureDirectoryExists(path.dirname(servicePath));
        fs.writeFileSync(servicePath, serviceContent);

        // Generar Controller
        const controllerContent =
          this.generateControllerTemplate(capitalizedEntity);
        const controllerPath = path.join(
          basePath,
          'controller',
          `${capitalizedEntity}Controller.java`,
        );
        this.ensureDirectoryExists(path.dirname(controllerPath));
        fs.writeFileSync(controllerPath, controllerContent);

        results.push({
          entity: entityName,
          files: {
            entity: entityPath,
            repository: repositoryPath,
            service: servicePath,
            controller: controllerPath,
          },
          status: 'success',
        });
      } catch (error) {
        results.push({
          entity: entityName,
          error: error.message,
          status: 'error',
        });
      }
    }

    return {
      message: 'Java files generation completed in custom path',
      results,
    };
  }

  async generateJavaFilesFromDiagram(diagramModel: DiagramModel, projectPath: string) {
    const results: Array<{
      entity: string;
      files?: {
        entity: string;
        repository: string;
        service: string;
        controller: string;
        createDto?: string;
        updateDto?: string;
        responseDto?: string;
      };
      error?: string;
      status: 'success' | 'error';
    }> = [];

    // Procesar cada nodo para extraer entidades y sus atributos
    const entitiesMap = new Map<number, { name: string; attributes: ParsedAttribute[]; relations: EntityRelation[] }>();
    
    // Parsear entidades y atributos
    for (const node of diagramModel.nodeDataArray) {
      const attributes = this.parseAttributes(node.attribute);
      entitiesMap.set(node.key, {
        name: node.name,
        attributes,
        relations: []
      });
    }

    // Procesar relaciones
    for (const link of diagramModel.linkDataArray) {
      // if (link.category === 'generalizacion') {
      //   // Manejar herencia - por ahora solo marcamos pero no implementamos herencia completa
      //   continue;
      // }

      const fromEntity = entitiesMap.get(link.from);
      const toEntity = entitiesMap.get(link.to);
      
      if (fromEntity && toEntity) {
        // Procesar relación basada en multiplicidad
        // link.fromMultiplicity es la multiplicidad de la entidad FROM
        // link.toMultiplicity es la multiplicidad de la entidad TO
        
        if (link.fromMultiplicity === '1' && link.toMultiplicity === '*') {
          // From(1) -> To(*): From tiene muchos To, To tiene un From
          // From: OneToMany hacia To
          fromEntity.relations.push({
            targetEntity: toEntity.name,
            relationType: 'OneToMany',
            mappedBy: `${fromEntity.name.toLowerCase()}`,
            joinColumn: undefined
          });
          
          // To: ManyToOne hacia From  
          toEntity.relations.push({
            targetEntity: fromEntity.name,
            relationType: 'ManyToOne',
            mappedBy: undefined,
            joinColumn: `${fromEntity.name.toLowerCase()}_id`
          });
          
        } else if (link.fromMultiplicity === '*' && link.toMultiplicity === '1') {
          // From(*) -> To(1): From tiene un To, To tiene muchos From
          // From: ManyToOne hacia To
          fromEntity.relations.push({
            targetEntity: toEntity.name,
            relationType: 'ManyToOne',
            mappedBy: undefined,
            joinColumn: `${toEntity.name.toLowerCase()}_id`
          });
          
          // To: OneToMany hacia From
          toEntity.relations.push({
            targetEntity: fromEntity.name,
            relationType: 'OneToMany',
            mappedBy: `${toEntity.name.toLowerCase()}`,
            joinColumn: undefined
          });
          
        } else if (link.fromMultiplicity === '1' && link.toMultiplicity === '1') {
          // From(1) -> To(1): Relación OneToOne
          fromEntity.relations.push({
            targetEntity: toEntity.name,
            relationType: 'OneToOne',
            mappedBy: undefined,
            joinColumn: `${toEntity.name.toLowerCase()}_id`
          });
          
          toEntity.relations.push({
            targetEntity: fromEntity.name,
            relationType: 'OneToOne',
            mappedBy: `${fromEntity.name.toLowerCase()}`,
            joinColumn: undefined
          });
          
        } else if (link.fromMultiplicity === '*' && link.toMultiplicity === '*') {
          // From(*) -> To(*): Relación ManyToMany
          fromEntity.relations.push({
            targetEntity: toEntity.name,
            relationType: 'ManyToMany',
            mappedBy: undefined,
            joinColumn: undefined
          });
        }
      }
    }

    // Generar archivos para cada entidad
    for (const [key, entityInfo] of entitiesMap) {
      try {
        const capitalizedEntity = this.capitalizeFirstLetter(entityInfo.name);
        const basePath = path.join(projectPath, 'src', 'main', 'java', 'com', 'example', 'back_examen');
        
        // Generar Entity con atributos y relaciones
        const entityContent = this.generateAdvancedEntityTemplate(capitalizedEntity, entityInfo.attributes, entityInfo.relations);
        const entityPath = path.join(basePath, 'entity', `${capitalizedEntity}.java`);
        this.ensureDirectoryExists(path.dirname(entityPath));
        fs.writeFileSync(entityPath, entityContent);

        // Generar Repository
        const repositoryContent = this.generateRepositoryTemplate(capitalizedEntity);
        const repositoryPath = path.join(basePath, 'repository', `${capitalizedEntity}Repository.java`);
        this.ensureDirectoryExists(path.dirname(repositoryPath));
        fs.writeFileSync(repositoryPath, repositoryContent);

        // Generar Service con DTOs
        const serviceContent = this.generateAdvancedServiceTemplate(capitalizedEntity, entityInfo.attributes, entityInfo.relations);
        const servicePath = path.join(basePath, 'service', `${capitalizedEntity}Service.java`);
        this.ensureDirectoryExists(path.dirname(servicePath));
        fs.writeFileSync(servicePath, serviceContent);

        // Generar Controller con DTOs
        const controllerContent = this.generateSimpleAdvancedControllerTemplate(capitalizedEntity);
        const controllerPath = path.join(basePath, 'controller', `${capitalizedEntity}Controller.java`);
        this.ensureDirectoryExists(path.dirname(controllerPath));
        fs.writeFileSync(controllerPath, controllerContent);

        // Generar DTOs con relaciones
        const createDtoContent = this.generateCreateDtoTemplate(capitalizedEntity, entityInfo.attributes, entityInfo.relations);
        const createDtoPath = path.join(basePath, 'dto', `Create${capitalizedEntity}Dto.java`);
        this.ensureDirectoryExists(path.dirname(createDtoPath));
        fs.writeFileSync(createDtoPath, createDtoContent);

        const updateDtoContent = this.generateUpdateDtoTemplate(capitalizedEntity, entityInfo.attributes, entityInfo.relations);
        const updateDtoPath = path.join(basePath, 'dto', `Update${capitalizedEntity}Dto.java`);
        this.ensureDirectoryExists(path.dirname(updateDtoPath));
        fs.writeFileSync(updateDtoPath, updateDtoContent);

        const responseDtoContent = this.generateResponseDtoTemplate(capitalizedEntity, entityInfo.attributes, entityInfo.relations);
        const responseDtoPath = path.join(basePath, 'dto', `${capitalizedEntity}ResponseDto.java`);
        this.ensureDirectoryExists(path.dirname(responseDtoPath));
        fs.writeFileSync(responseDtoPath, responseDtoContent);

        results.push({
          entity: entityInfo.name,
          files: {
            entity: entityPath,
            repository: repositoryPath,
            service: servicePath,
            controller: controllerPath,
            createDto: createDtoPath,
            updateDto: updateDtoPath,
            responseDto: responseDtoPath,
          },
          status: 'success',
        });

      } catch (error) {
        results.push({
          entity: entityInfo.name,
          error: error.message,
          status: 'error',
        });
      }
    }

    return {
      message: 'Java files generation completed from diagram model',
      results,
    };
  }

  private parseAttributes(attributeString: string): ParsedAttribute[] {
    if (!attributeString.trim()) return [];
    
    const lines = attributeString.split('\n');
    const attributes: ParsedAttribute[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed) {
        const parts = trimmed.split(':');
        if (parts.length === 2) {
          attributes.push({
            name: parts[0].trim(),
            type: 'String' // Convertir todos los tipos a String como solicitaste
          });
        }
      }
    }
    
    return attributes;
  }

  private generateAdvancedEntityTemplate(entityName: string, attributes: ParsedAttribute[], relations: EntityRelation[]): string {
    const tableName = this.pluralize(entityName.toLowerCase());
    
    let imports = `package com.example.back_examen.entity;

import jakarta.persistence.*;
import lombok.Data;`;

    // Agregar imports para relaciones
    if (relations.length > 0) {
      imports += `
import java.util.List;
import java.util.ArrayList;`;
    }

    let classContent = `

@Data
@Entity
@Table(name = "${tableName}")
public class ${entityName} {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
`;

    // Agregar atributos normales
    for (const attr of attributes) {
      classContent += `    private ${attr.type} ${attr.name};\n`;
    }

    // Agregar relaciones
    for (const relation of relations) {
      const annotation = this.getRelationAnnotation(relation);
      
      // Determinar tipo y nombre del campo según el tipo de relación
      let fieldType: string;
      let fieldName: string;
      
      if (relation.relationType === 'OneToMany' || relation.relationType === 'ManyToMany') {
        // Relaciones "toMany" usan List
        fieldType = `List<${relation.targetEntity}>`;
        fieldName = `${relation.targetEntity.toLowerCase()}s`;
      } else {
        // Relaciones "toOne" usan el objeto directamente
        fieldType = relation.targetEntity;
        fieldName = relation.targetEntity.toLowerCase();
      }

      classContent += `
    ${annotation}
    private ${fieldType} ${fieldName}`;
      
      // Solo inicializar con ArrayList si es una relación "toMany"
      if (relation.relationType === 'OneToMany' || relation.relationType === 'ManyToMany') {
        classContent += ` = new ArrayList<>()`;
      }
      
      classContent += `;\n`;
    }

    classContent += `}`;

    return imports + classContent;
  }

  private getRelationAnnotation(relation: EntityRelation): string {
    switch (relation.relationType) {
      case 'OneToMany':
        return relation.mappedBy ? `@OneToMany(mappedBy = "${relation.mappedBy}")` : '@OneToMany';
      case 'ManyToOne':
        return relation.joinColumn ? `@ManyToOne\n    @JoinColumn(name = "${relation.joinColumn}")` : '@ManyToOne';
      case 'OneToOne':
        if (relation.mappedBy) {
          return `@OneToOne(mappedBy = "${relation.mappedBy}")`;
        } else if (relation.joinColumn) {
          return `@OneToOne\n    @JoinColumn(name = "${relation.joinColumn}")`;
        } else {
          return '@OneToOne';
        }
      case 'ManyToMany':
        return '@ManyToMany';
      default:
        return '@ManyToOne';
    }
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  private generateEntityTemplate(entityName: string): string {
    const tableName = this.pluralize(entityName.toLowerCase());
    
    return `package com.example.back_examen.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "${tableName}")
public class ${entityName} {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
`;
  }

  private generateRepositoryTemplate(entityName: string): string {
    return `package com.example.back_examen.repository;

import com.example.back_examen.entity.${entityName};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ${entityName}Repository extends JpaRepository<${entityName}, Long> {

}
`;
  }

  private generateServiceTemplate(entityName: string): string {
    return `package com.example.back_examen.service;

import com.example.back_examen.entity.${entityName};
import com.example.back_examen.repository.${entityName}Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ${entityName}Service {

    @Autowired
    private ${entityName}Repository ${entityName.toLowerCase()}Repository;

    public ${entityName} findById(Long id) {
        return ${entityName.toLowerCase()}Repository.findById(id).orElse(null);
    }

    public List<${entityName}> findAll() {
        return ${entityName.toLowerCase()}Repository.findAll();
    }

    public ${entityName} save(${entityName} ${entityName.toLowerCase()}) {
        return ${entityName.toLowerCase()}Repository.save(${entityName.toLowerCase()});
    }

    public void deleteById(Long id) {
        ${entityName.toLowerCase()}Repository.deleteById(id);
    }

    public ${entityName} update(Long id, ${entityName} ${entityName.toLowerCase()}) {
        return ${entityName.toLowerCase()}Repository.save(${entityName.toLowerCase()});
    }
}
`;
  }

  private generateAdvancedServiceTemplate(entityName: string, attributes: ParsedAttribute[], relations?: EntityRelation[]): string {
    let imports = `package com.example.back_examen.service;

import com.example.back_examen.entity.${entityName};
import com.example.back_examen.dto.Create${entityName}Dto;
import com.example.back_examen.dto.Update${entityName}Dto;
import com.example.back_examen.repository.${entityName}Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;`;

    // Agregar imports para servicios de entidades relacionadas
    if (relations) {
      for (const relation of relations) {
        if (relation.relationType === 'ManyToOne' || relation.relationType === 'OneToOne') {
          imports += `
import com.example.back_examen.service.${relation.targetEntity}Service;`;
        }
      }
    }

    let content = `

@Service
public class ${entityName}Service {

    @Autowired
    private ${entityName}Repository ${entityName.toLowerCase()}Repository;`;

    // Agregar autowired para servicios de entidades relacionadas
    if (relations) {
      for (const relation of relations) {
        if (relation.relationType === 'ManyToOne' || relation.relationType === 'OneToOne') {
          content += `
    
    @Autowired
    private ${relation.targetEntity}Service ${relation.targetEntity.toLowerCase()}Service;`;
        }
      }
    }

    content += `

    public ${entityName} findById(Long id) {
        return ${entityName.toLowerCase()}Repository.findById(id).orElse(null);
    }

    public List<${entityName}> findAll() {
        return ${entityName.toLowerCase()}Repository.findAll();
    }

    // Crear entidad usando DTO
    public ${entityName} create(Create${entityName}Dto createDto) {
        ${entityName} ${entityName.toLowerCase()} = new ${entityName}();
        
        // Mapear atributos básicos`;

    for (const attr of attributes) {
      content += `
        ${entityName.toLowerCase()}.set${this.capitalizeFirstLetter(attr.name)}(createDto.get${this.capitalizeFirstLetter(attr.name)}());`;
    }

    // Mapear relaciones
    if (relations) {
      for (const relation of relations) {
        if (relation.relationType === 'ManyToOne' || relation.relationType === 'OneToOne') {
          const entityField = relation.targetEntity.toLowerCase();
          const idField = `${entityField}Id`;
          content += `
        
        // Establecer relación con ${relation.targetEntity}
        if (createDto.get${this.capitalizeFirstLetter(idField)}() != null) {
            ${relation.targetEntity} ${entityField} = ${entityField}Service.findById(createDto.get${this.capitalizeFirstLetter(idField)}());
            if (${entityField} != null) {
                ${entityName.toLowerCase()}.set${this.capitalizeFirstLetter(entityField)}(${entityField});
            }
        }`;
        }
      }
    }

    content += `
        
        return ${entityName.toLowerCase()}Repository.save(${entityName.toLowerCase()});
    }

    // Actualizar entidad usando DTO
    public ${entityName} update(Long id, Update${entityName}Dto updateDto) {
        ${entityName} existing${entityName} = ${entityName.toLowerCase()}Repository.findById(id).orElse(null);
        if (existing${entityName} == null) {
            return null;
        }
        
        // Actualizar atributos si no son null`;

    for (const attr of attributes) {
      content += `
        if (updateDto.get${this.capitalizeFirstLetter(attr.name)}() != null) {
            existing${entityName}.set${this.capitalizeFirstLetter(attr.name)}(updateDto.get${this.capitalizeFirstLetter(attr.name)}());
        }`;
    }

    // Actualizar relaciones
    if (relations) {
      for (const relation of relations) {
        if (relation.relationType === 'ManyToOne' || relation.relationType === 'OneToOne') {
          const entityField = relation.targetEntity.toLowerCase();
          const idField = `${entityField}Id`;
          content += `
        
        // Actualizar relación con ${relation.targetEntity}
        if (updateDto.get${this.capitalizeFirstLetter(idField)}() != null) {
            ${relation.targetEntity} ${entityField} = ${entityField}Service.findById(updateDto.get${this.capitalizeFirstLetter(idField)}());
            if (${entityField} != null) {
                existing${entityName}.set${this.capitalizeFirstLetter(entityField)}(${entityField});
            }
        }`;
        }
      }
    }

    content += `
        
        return ${entityName.toLowerCase()}Repository.save(existing${entityName});
    }

    public void deleteById(Long id) {
        ${entityName.toLowerCase()}Repository.deleteById(id);
    }

    // Método legacy para compatibilidad
    public ${entityName} save(${entityName} ${entityName.toLowerCase()}) {
        return ${entityName.toLowerCase()}Repository.save(${entityName.toLowerCase()});
    }
}
`;

    return imports + content;
  }

  private generateControllerTemplate(entityName: string): string {
    const entityLower = entityName.toLowerCase();
    const entityPlural = entityLower + 's';

    return `package com.example.back_examen.controller;

import com.example.back_examen.entity.${entityName};
import com.example.back_examen.service.${entityName}Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/${entityPlural}")
public class ${entityName}Controller {

    private final ${entityName}Service ${entityName.toLowerCase()}Service;

    public ${entityName}Controller(${entityName}Service ${entityName.toLowerCase()}Service) {
        this.${entityName.toLowerCase()}Service = ${entityName.toLowerCase()}Service;
    }

    // GET all ${entityPlural}
    @GetMapping
    public List<${entityName}> findAll() {
        return ${entityName.toLowerCase()}Service.findAll();
    }

    // GET ${entityLower} by ID
    @GetMapping("/{id}")
    public ${entityName} findById(@PathVariable Long id) {
        return ${entityName.toLowerCase()}Service.findById(id);
    }

    // POST create new ${entityLower}
    @PostMapping
    public ${entityName} create(@RequestBody ${entityName} ${entityName.toLowerCase()}) {
        return ${entityName.toLowerCase()}Service.save(${entityName.toLowerCase()});
    }

    // PUT update ${entityLower}
    @PutMapping("/{id}")
    public ${entityName} update(@PathVariable Long id, @RequestBody ${entityName} ${entityName.toLowerCase()}Details) {
        return ${entityName.toLowerCase()}Service.update(id, ${entityName.toLowerCase()}Details);
    }

    // DELETE ${entityLower}
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        ${entityName.toLowerCase()}Service.deleteById(id);
        return "${entityName} with id " + id + " deleted successfully.";
    }
}
`;
  }

  private pluralize(word: string): string {
    // Reglas básicas de pluralización en inglés
    const irregulars: { [key: string]: string } = {
      'person': 'people',
      'man': 'men',
      'woman': 'women',
      'child': 'children',
      'foot': 'feet',
      'tooth': 'teeth',
      'mouse': 'mice',
      'goose': 'geese'
    };

    // Verificar irregulares
    if (irregulars[word.toLowerCase()]) {
      return irregulars[word.toLowerCase()];
    }

    // Reglas generales
    if (word.endsWith('s') || word.endsWith('sh') || word.endsWith('ch') || 
        word.endsWith('x') || word.endsWith('z')) {
      return word + 'es';
    } else if (word.endsWith('y') && word.length > 1 && 
               !'aeiou'.includes(word[word.length - 2])) {
      return word.slice(0, -1) + 'ies';
    } else if (word.endsWith('f')) {
      return word.slice(0, -1) + 'ves';
    } else if (word.endsWith('fe')) {
      return word.slice(0, -2) + 'ves';
    } else if (word.endsWith('o') && word.length > 1 && 
               !'aeiou'.includes(word[word.length - 2])) {
      return word + 'es';
    } else {
      return word + 's';
    }
  }

  private generateCreateDtoTemplate(entityName: string, attributes: ParsedAttribute[], relations?: EntityRelation[]): string {
    let content = `package com.example.back_examen.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

@Data
public class Create${entityName}Dto {
`;

    // Agregar atributos (sin id, ya que es autoincremental)
    for (const attr of attributes) {
      content += `    @NotBlank(message = "${attr.name} is required")
    private ${attr.type} ${attr.name};

`;
    }

    // Agregar campos para relaciones ManyToOne y OneToOne (las que necesitan FK)
    if (relations) {
      for (const relation of relations) {
        if (relation.relationType === 'ManyToOne' || relation.relationType === 'OneToOne') {
          const fieldName = `${relation.targetEntity.toLowerCase()}Id`;
          content += `    @NotNull(message = "${relation.targetEntity} ID is required")
    private Long ${fieldName};

`;
        }
      }
    }

    content += `}
`;
    return content;
  }

  private generateUpdateDtoTemplate(entityName: string, attributes: ParsedAttribute[], relations?: EntityRelation[]): string {
    let content = `package com.example.back_examen.dto;

import lombok.Data;

@Data
public class Update${entityName}Dto {
`;

    // Agregar atributos (sin id, pero opcionales para update)
    for (const attr of attributes) {
      content += `    private ${attr.type} ${attr.name};
`;
    }

    // Agregar campos opcionales para relaciones ManyToOne y OneToOne
    if (relations) {
      for (const relation of relations) {
        if (relation.relationType === 'ManyToOne' || relation.relationType === 'OneToOne') {
          const fieldName = `${relation.targetEntity.toLowerCase()}Id`;
          content += `    private Long ${fieldName};
`;
        }
      }
    }

    content += `}
`;
    return content;
  }

  private generateResponseDtoTemplate(entityName: string, attributes: ParsedAttribute[], relations?: EntityRelation[]): string {
    let content = `package com.example.back_examen.dto;

import lombok.Data;

@Data
public class ${entityName}ResponseDto {
    private Long id;
`;

    // Agregar atributos
    for (const attr of attributes) {
      content += `    private ${attr.type} ${attr.name};
`;
    }

    // Agregar información de relaciones (IDs y datos anidados)
    if (relations) {
      for (const relation of relations) {
        if (relation.relationType === 'ManyToOne' || relation.relationType === 'OneToOne') {
          // Para relaciones "ToOne", incluir el ID y opcionalmente el objeto completo
          const fieldName = `${relation.targetEntity.toLowerCase()}Id`;
          content += `    private Long ${fieldName};
    private ${relation.targetEntity}ResponseDto ${relation.targetEntity.toLowerCase()};
`;
        } else if (relation.relationType === 'OneToMany' || relation.relationType === 'ManyToMany') {
          // Para relaciones "ToMany", incluir lista de IDs (evitar recursión infinita)
          const fieldName = `${relation.targetEntity.toLowerCase()}Ids`;
          content += `    private List<Long> ${fieldName};
`;
        }
      }
    }

    content += `
    // Constructor para mapear desde Entity
    public ${entityName}ResponseDto(${entityName} ${entityName.toLowerCase()}) {
        this.id = ${entityName.toLowerCase()}.getId();`;

    for (const attr of attributes) {
      content += `
        this.${attr.name} = ${entityName.toLowerCase()}.get${this.capitalizeFirstLetter(attr.name)}();`;
    }

    // Mapear relaciones en el constructor
    if (relations) {
      for (const relation of relations) {
        if (relation.relationType === 'ManyToOne' || relation.relationType === 'OneToOne') {
          const entityField = relation.targetEntity.toLowerCase();
          const idField = `${entityField}Id`;
          content += `
        if (${entityName.toLowerCase()}.get${this.capitalizeFirstLetter(entityField)}() != null) {
            this.${idField} = ${entityName.toLowerCase()}.get${this.capitalizeFirstLetter(entityField)}().getId();
            // Opcional: mapear objeto completo (cuidado con recursión)
            // this.${entityField} = new ${relation.targetEntity}ResponseDto(${entityName.toLowerCase()}.get${this.capitalizeFirstLetter(entityField)}());
        }`;
        } else if (relation.relationType === 'OneToMany' || relation.relationType === 'ManyToMany') {
          const fieldName = `${relation.targetEntity.toLowerCase()}Ids`;
          const listField = `${relation.targetEntity.toLowerCase()}s`;
          content += `
        if (${entityName.toLowerCase()}.get${this.capitalizeFirstLetter(listField)}() != null) {
            this.${fieldName} = ${entityName.toLowerCase()}.get${this.capitalizeFirstLetter(listField)}().stream()
                .map(item -> item.getId())
                .collect(java.util.stream.Collectors.toList());
        }`;
        }
      }
    }

    content += `
    }

    // Constructor vacío
    public ${entityName}ResponseDto() {}
}
`;
    return content;
  }

  private generateSimpleAdvancedControllerTemplate(entityName: string): string {
    const entityLower = entityName.toLowerCase();
    const entityPlural = this.pluralize(entityLower);
    
    return `package com.example.back_examen.controller;

import com.example.back_examen.entity.${entityName};
import com.example.back_examen.dto.Create${entityName}Dto;
import com.example.back_examen.dto.Update${entityName}Dto;
import com.example.back_examen.dto.${entityName}ResponseDto;
import com.example.back_examen.service.${entityName}Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "api/${entityPlural}")
public class ${entityName}Controller {

    private final ${entityName}Service ${entityName.toLowerCase()}Service;

    public ${entityName}Controller(${entityName}Service ${entityName.toLowerCase()}Service) {
        this.${entityName.toLowerCase()}Service = ${entityName.toLowerCase()}Service;
    }

    // GET all ${entityPlural}
    @GetMapping
    public ResponseEntity<List<${entityName}ResponseDto>> findAll() {
        List<${entityName}> ${entityPlural} = ${entityName.toLowerCase()}Service.findAll();
        List<${entityName}ResponseDto> response = ${entityPlural}.stream()
            .map(${entityName}ResponseDto::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // GET ${entityLower} by ID
    @GetMapping("/{id}")
    public ResponseEntity<${entityName}ResponseDto> findById(@PathVariable Long id) {
        ${entityName} ${entityName.toLowerCase()} = ${entityName.toLowerCase()}Service.findById(id);
        if (${entityName.toLowerCase()} != null) {
            return ResponseEntity.ok(new ${entityName}ResponseDto(${entityName.toLowerCase()}));
        }
        return ResponseEntity.notFound().build();
    }

    // POST create new ${entityLower}
    @PostMapping
    public ResponseEntity<${entityName}ResponseDto> create(@Valid @RequestBody Create${entityName}Dto createDto) {
        ${entityName} saved${entityName} = ${entityName.toLowerCase()}Service.create(createDto);
        return ResponseEntity.ok(new ${entityName}ResponseDto(saved${entityName}));
    }

    // PUT update ${entityLower}
    @PutMapping("/{id}")
    public ResponseEntity<${entityName}ResponseDto> update(@PathVariable Long id, @RequestBody Update${entityName}Dto updateDto) {
        ${entityName} updated${entityName} = ${entityName.toLowerCase()}Service.update(id, updateDto);
        if (updated${entityName} == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new ${entityName}ResponseDto(updated${entityName}));
    }

    // DELETE ${entityLower}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        ${entityName} ${entityName.toLowerCase()} = ${entityName.toLowerCase()}Service.findById(id);
        if (${entityName.toLowerCase()} == null) {
            return ResponseEntity.notFound().build();
        }
        
        ${entityName.toLowerCase()}Service.deleteById(id);
        return ResponseEntity.ok("${entityName} with id " + id + " deleted successfully.");
    }
}
`;
  }

  private generateAdvancedControllerTemplate(entityName: string, attributes: ParsedAttribute[], relations?: EntityRelation[]): string {
    const entityLower = entityName.toLowerCase();
    const entityPlural = this.pluralize(entityLower);
    
    let content = `package com.example.back_examen.controller;

import com.example.back_examen.entity.${entityName};
import com.example.back_examen.dto.Create${entityName}Dto;
import com.example.back_examen.dto.Update${entityName}Dto;
import com.example.back_examen.dto.${entityName}ResponseDto;
import com.example.back_examen.service.${entityName}Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "api/${entityPlural}")
public class ${entityName}Controller {

    private final ${entityName}Service ${entityName.toLowerCase()}Service;

    public ${entityName}Controller(${entityName}Service ${entityName.toLowerCase()}Service) {
        this.${entityName.toLowerCase()}Service = ${entityName.toLowerCase()}Service;
    }

    // GET all ${entityPlural}
    @GetMapping
    public ResponseEntity<List<${entityName}ResponseDto>> findAll() {
        List<${entityName}> ${entityPlural} = ${entityName.toLowerCase()}Service.findAll();
        List<${entityName}ResponseDto> response = ${entityPlural}.stream()
            .map(${entityName}ResponseDto::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // GET ${entityLower} by ID
    @GetMapping("/{id}")
    public ResponseEntity<${entityName}ResponseDto> findById(@PathVariable Long id) {
        ${entityName} ${entityName.toLowerCase()} = ${entityName.toLowerCase()}Service.findById(id);
        if (${entityName.toLowerCase()} != null) {
            return ResponseEntity.ok(new ${entityName}ResponseDto(${entityName.toLowerCase()}));
        }
        return ResponseEntity.notFound().build();
    }

    // POST create new ${entityLower}
    @PostMapping
    public ResponseEntity<${entityName}ResponseDto> create(@Valid @RequestBody Create${entityName}Dto createDto) {
        ${entityName} ${entityName.toLowerCase()} = new ${entityName}();`;

    // Mapear atributos del DTO a la entidad
    for (const attr of attributes) {
      content += `
        ${entityName.toLowerCase()}.set${this.capitalizeFirstLetter(attr.name)}(createDto.get${this.capitalizeFirstLetter(attr.name)}());`;
    }

    content += `
        
        ${entityName} saved${entityName} = ${entityName.toLowerCase()}Service.save(${entityName.toLowerCase()});
        return ResponseEntity.ok(new ${entityName}ResponseDto(saved${entityName}));
    }

    // PUT update ${entityLower}
    @PutMapping("/{id}")
    public ResponseEntity<${entityName}ResponseDto> update(@PathVariable Long id, @RequestBody Update${entityName}Dto updateDto) {
        ${entityName} existing${entityName} = ${entityName.toLowerCase()}Service.findById(id);
        if (existing${entityName} == null) {
            return ResponseEntity.notFound().build();
        }
`;

    // Mapear atributos del DTO a la entidad (solo si no son null)
    for (const attr of attributes) {
      content += `        if (updateDto.get${this.capitalizeFirstLetter(attr.name)}() != null) {
            existing${entityName}.set${this.capitalizeFirstLetter(attr.name)}(updateDto.get${this.capitalizeFirstLetter(attr.name)}());
        }
`;
    }

    content += `
        ${entityName} updated${entityName} = ${entityName.toLowerCase()}Service.save(existing${entityName});
        return ResponseEntity.ok(new ${entityName}ResponseDto(updated${entityName}));
    }

    // DELETE ${entityLower}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        ${entityName} ${entityName.toLowerCase()} = ${entityName.toLowerCase()}Service.findById(id);
        if (${entityName.toLowerCase()} == null) {
            return ResponseEntity.notFound().build();
        }
        
        ${entityName.toLowerCase()}Service.deleteById(id);
        return ResponseEntity.ok("${entityName} with id " + id + " deleted successfully.");
    }
}
`;
    return content;
  }

  private generateBasicCreateDtoTemplate(entityName: string): string {
    return `package com.example.back_examen.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class Create${entityName}Dto {
    // Agregar campos específicos aquí según la entidad
    @NotBlank(message = "Name is required")
    private String name;
}
`;
  }

  private generateBasicUpdateDtoTemplate(entityName: string): string {
    return `package com.example.back_examen.dto;

import lombok.Data;

@Data
public class Update${entityName}Dto {
    // Campos opcionales para actualización
    private String name;
}
`;
  }

  private generateBasicResponseDtoTemplate(entityName: string): string {
    return `package com.example.back_examen.dto;

import lombok.Data;

@Data
public class ${entityName}ResponseDto {
    private Long id;
    private String name;
    
    // Constructor para mapear desde Entity
    public ${entityName}ResponseDto(${entityName} ${entityName.toLowerCase()}) {
        this.id = ${entityName.toLowerCase()}.getId();
        // Mapear otros campos aquí
    }

    // Constructor vacío
    public ${entityName}ResponseDto() {}
}
`;
  }

  // ============= FLUTTER GENERATION METHODS =============

  async generateFlutterFilesFromDiagram(diagramModel: DiagramModel, basePath: string) {
    try {
      console.log('Iniciando generación de proyecto Flutter...');
      // 1. Copiar estructura base de flutter_front
      console.log('Copiando estructura base...');
      await this.copyFlutterBaseStructure(basePath);

      // 2. Analizar entidades del diagrama
      console.log('Parseando entidades del diagrama...');
      const entitiesMap = this.parseFlutterEntitiesFromDiagram(diagramModel);
      console.log(`Entidades encontradas: ${entitiesMap.size}`);

      // 3. Generar archivos para cada entidad
      const pagesList: Array<{name: string, title: string, route: string}> = [];
      for (const [entityName, entityInfo] of entitiesMap.entries()) {
        await this.generateFlutterCRUDFiles(entityInfo.name, entityInfo, basePath);
        pagesList.push({
          name: entityInfo.name,
          title: `${entityInfo.name}s`,
          route: `/${entityInfo.name.toLowerCase()}`
        });
      }

      // 4. Actualizar archivos de navegación
      await this.updateFlutterNavigation(pagesList, basePath);

      console.log('Proyecto Flutter generado exitosamente');
    } catch (error) {
      console.error('Error generando proyecto Flutter:', error);
      throw error;
    }
  }

  private parseFlutterEntitiesFromDiagram(diagramModel: DiagramModel): Map<number, { name: string; attributes: ParsedAttribute[]; relations: EntityRelation[] }> {
    const entitiesMap = new Map<number, { name: string; attributes: ParsedAttribute[]; relations: EntityRelation[] }>();
    
    // Parsear entidades y atributos
    for (const node of diagramModel.nodeDataArray) {
      const attributes = this.parseAttributes(node.attribute);
      entitiesMap.set(node.key, {
        name: node.name,
        attributes,
        relations: []
      });
    }

    // Procesar relaciones
    for (const link of diagramModel.linkDataArray) {
      const fromEntity = entitiesMap.get(link.from);
      const toEntity = entitiesMap.get(link.to);
      
      if (fromEntity && toEntity) {
        // Procesar relación basada en multiplicidad
        if (link.fromMultiplicity === '1' && link.toMultiplicity === '*') {
          // From(1) -> To(*): From tiene muchos To, To tiene un From
          fromEntity.relations.push({
            targetEntity: toEntity.name,
            relationType: 'OneToMany',
            mappedBy: `${fromEntity.name.toLowerCase()}`,
            joinColumn: undefined
          });
          
          toEntity.relations.push({
            targetEntity: fromEntity.name,
            relationType: 'ManyToOne',
            mappedBy: undefined,
            joinColumn: `${fromEntity.name.toLowerCase()}_id`
          });
          
        } else if (link.fromMultiplicity === '*' && link.toMultiplicity === '1') {
          fromEntity.relations.push({
            targetEntity: toEntity.name,
            relationType: 'ManyToOne',
            mappedBy: undefined,
            joinColumn: `${toEntity.name.toLowerCase()}_id`
          });
          
          toEntity.relations.push({
            targetEntity: fromEntity.name,
            relationType: 'OneToMany',
            mappedBy: `${toEntity.name.toLowerCase()}`,
            joinColumn: undefined
          });
          
        } else if (link.fromMultiplicity === '1' && link.toMultiplicity === '1') {
          fromEntity.relations.push({
            targetEntity: toEntity.name,
            relationType: 'OneToOne',
            mappedBy: undefined,
            joinColumn: `${toEntity.name.toLowerCase()}_id`
          });
          
          toEntity.relations.push({
            targetEntity: fromEntity.name,
            relationType: 'OneToOne',
            mappedBy: `${fromEntity.name.toLowerCase()}`,
            joinColumn: undefined
          });
        }
      }
    }
    
    return entitiesMap;
  }

  private async copyFlutterBaseStructure(destPath: string) {
    const sourcePath = path.join(process.cwd(), 'flutter_front');
    await this.copyDirectory(sourcePath, destPath);
  }

  private async copyDirectory(source: string, dest: string) {
    try {
      const entries = await fs.promises.readdir(source, { withFileTypes: true });
      
      for (const entry of entries) {
        const sourcePath = path.join(source, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          // Saltar ciertos directorios
          if (['.dart_tool', 'build', '.idea'].includes(entry.name)) {
            continue;
          }
          
          await fs.promises.mkdir(destPath, { recursive: true });
          await this.copyDirectory(sourcePath, destPath);
        } else {
          await fs.promises.copyFile(sourcePath, destPath);
        }
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  private async generateFlutterCRUDFiles(entityName: string, entityInfo: any, basePath: string) {
    const lowerEntityName = entityName.toLowerCase();
    const capitalizedEntity = this.capitalizeFirstLetter(entityName);

    // Generar modelo
    const modelContent = this.generateFlutterModel(capitalizedEntity, entityInfo.attributes, entityInfo.relations);
    await fs.promises.writeFile(
      path.join(basePath, 'lib', 'src', 'models', `${lowerEntityName}_model.dart`),
      modelContent
    );

    // Generar servicio
    const serviceContent = this.generateFlutterService(capitalizedEntity, lowerEntityName);
    await fs.promises.writeFile(
      path.join(basePath, 'lib', 'src', 'services', `${lowerEntityName}_service.dart`),
      serviceContent
    );

    // Generar página CRUD
    const pageContent = this.generateFlutterCRUDPage(capitalizedEntity, entityInfo.attributes, entityInfo.relations);
    await fs.promises.writeFile(
      path.join(basePath, 'lib', 'src', 'pages', `${lowerEntityName}_page.dart`),
      pageContent
    );
  }

  private generateFlutterModel(entityName: string, attributes: ParsedAttribute[], relations: EntityRelation[]): string {
    const fields = attributes.map(attr => {
      const dartType = this.javaToDartType(attr.type);
      return `  final ${dartType}? ${attr.name};`;
    }).join('\n');

    const relationFields = relations.map(rel => {
      if (rel.relationType === 'OneToMany') {
        return `  final List<${rel.targetEntity}>? ${rel.targetEntity.toLowerCase()}s;`;
      } else {
        return `  final ${rel.targetEntity}? ${rel.targetEntity.toLowerCase()};`;
      }
    }).join('\n');

    const constructorParams = attributes.map(attr => `this.${attr.name}`).join(', ');
    const relationParams = relations.map(rel => {
      if (rel.relationType === 'OneToMany') {
        return `this.${rel.targetEntity.toLowerCase()}s`;
      } else {
        return `this.${rel.targetEntity.toLowerCase()}`;
      }
    }).join(', ');

    const allParams = [constructorParams, relationParams].filter(p => p).join(', ');

    const jsonConstructor = this.generateFlutterFromJsonConstructor(entityName, attributes, relations);
    const toJsonMethod = this.generateFlutterToJsonMethod(attributes, relations);

    return `class ${entityName} {
${fields}
${relationFields}

  const ${entityName}({
    ${allParams}
  });

  ${jsonConstructor}

  ${toJsonMethod}
}
`;
  }

  private generateFlutterFromJsonConstructor(entityName: string, attributes: ParsedAttribute[], relations: EntityRelation[]): string {
    const attributeMappings = attributes.map(attr => {
      if (attr.type === 'DateTime') {
        return `    ${attr.name}: json['${attr.name}'] != null ? DateTime.parse(json['${attr.name}']) : null,`;
      }
      return `    ${attr.name}: json['${attr.name}'],`;
    }).join('\n');

    const relationMappings = relations.map(rel => {
      if (rel.relationType === 'OneToMany') {
        return `    ${rel.targetEntity.toLowerCase()}s: json['${rel.targetEntity.toLowerCase()}s'] != null 
        ? (json['${rel.targetEntity.toLowerCase()}s'] as List).map((i) => ${rel.targetEntity}.fromJson(i)).toList() 
        : null,`;
      } else {
        return `    ${rel.targetEntity.toLowerCase()}: json['${rel.targetEntity.toLowerCase()}'] != null 
        ? ${rel.targetEntity}.fromJson(json['${rel.targetEntity.toLowerCase()}']) 
        : null,`;
      }
    }).join('\n');

    return `factory ${entityName}.fromJson(Map<String, dynamic> json) {
    return ${entityName}(
${attributeMappings}
${relationMappings}
    );
  }`;
  }

  private generateFlutterToJsonMethod(attributes: ParsedAttribute[], relations: EntityRelation[]): string {
    const attributeMappings = attributes.map(attr => {
      if (attr.type === 'DateTime') {
        return `      '${attr.name}': ${attr.name}?.toIso8601String(),`;
      }
      return `      '${attr.name}': ${attr.name},`;
    }).join('\n');

    const relationMappings = relations.map(rel => {
      if (rel.relationType === 'OneToMany') {
        return `      '${rel.targetEntity.toLowerCase()}s': ${rel.targetEntity.toLowerCase()}s?.map((e) => e.toJson()).toList(),`;
      } else {
        return `      '${rel.targetEntity.toLowerCase()}': ${rel.targetEntity.toLowerCase()}?.toJson(),`;
      }
    }).join('\n');

    return `Map<String, dynamic> toJson() {
    return {
${attributeMappings}
${relationMappings}
    };
  }`;
  }

  private generateFlutterService(entityName: string, lowerEntityName: string): string {
    return `import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/${lowerEntityName}_model.dart';

class ${entityName}Service {
  final String apiUrl = 'http://10.0.2.2:8080/${lowerEntityName}s';

  Future<List<${entityName}>> getAll() async {
    final response = await http.get(Uri.parse(apiUrl));
    
    if (response.statusCode == 200) {
      final List<dynamic> jsonList = json.decode(response.body);
      return jsonList.map((json) => ${entityName}.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load ${lowerEntityName}s');
    }
  }

  Future<${entityName}> getById(int id) async {
    final response = await http.get(Uri.parse('\$apiUrl/\$id'));
    
    if (response.statusCode == 200) {
      return ${entityName}.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to load ${lowerEntityName}');
    }
  }

  Future<${entityName}> create(${entityName} ${lowerEntityName}) async {
    final response = await http.post(
      Uri.parse(apiUrl),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(${lowerEntityName}.toJson()),
    );
    
    if (response.statusCode == 201) {
      return ${entityName}.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to create ${lowerEntityName}');
    }
  }

  Future<${entityName}> update(int id, ${entityName} ${lowerEntityName}) async {
    final response = await http.put(
      Uri.parse('\$apiUrl/\$id'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(${lowerEntityName}.toJson()),
    );
    
    if (response.statusCode == 200) {
      return ${entityName}.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to update ${lowerEntityName}');
    }
  }

  Future<void> delete(int id) async {
    final response = await http.delete(Uri.parse('\$apiUrl/\$id'));
    
    if (response.statusCode != 204) {
      throw Exception('Failed to delete ${lowerEntityName}');
    }
  }
}
`;
  }

  private generateFlutterCRUDPage(entityName: string, attributes: ParsedAttribute[], relations: EntityRelation[]): string {
    const lowerEntityName = entityName.toLowerCase();
    const formFields = this.generateFlutterFormFields(attributes, relations);
    const listTileFields = this.generateFlutterListTileFields(attributes);

    return `import 'package:flutter/material.dart';
import '../models/${lowerEntityName}_model.dart';
import '../services/${lowerEntityName}_service.dart';

class ${entityName}Page extends StatefulWidget {
  const ${entityName}Page({super.key});

  @override
  State<${entityName}Page> createState() => _${entityName}PageState();
}

class _${entityName}PageState extends State<${entityName}Page> {
  final ${entityName}Service _service = ${entityName}Service();
  List<${entityName}> _items = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadItems();
  }

  Future<void> _loadItems() async {
    try {
      final items = await _service.getAll();
      setState(() {
        _items = items;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      _showErrorDialog('Error loading ${lowerEntityName}s: \$e');
    }
  }

  Future<void> _showCreateDialog() async {
    await _showFormDialog(null);
  }

  Future<void> _showEditDialog(${entityName} item) async {
    await _showFormDialog(item);
  }

  Future<void> _showFormDialog(${entityName}? item) async {
    ${formFields.controllers}

    if (item != null) {
      ${formFields.initialization}
    }

    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(item == null ? 'Create ${entityName}' : 'Edit ${entityName}'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ${formFields.widgets}
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              await _saveItem(item, {
                ${formFields.values}
              });
              Navigator.pop(context);
            },
            child: Text(item == null ? 'Create' : 'Update'),
          ),
        ],
      ),
    );
  }

  Future<void> _saveItem(${entityName}? existingItem, Map<String, dynamic> data) async {
    try {
      final item = ${entityName}.fromJson(data);
      
      if (existingItem == null) {
        await _service.create(item);
      } else {
        await _service.update(existingItem.id!, item);
      }
      
      await _loadItems();
    } catch (e) {
      _showErrorDialog('Error saving ${lowerEntityName}: \$e');
    }
  }

  Future<void> _deleteItem(${entityName} item) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Delete'),
        content: Text('Are you sure you want to delete this ${lowerEntityName}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      try {
        await _service.delete(item.id!);
        await _loadItems();
      } catch (e) {
        _showErrorDialog('Error deleting ${lowerEntityName}: \$e');
      }
    }
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Error'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${entityName}s'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _showCreateDialog,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadItems,
              child: ListView.builder(
                itemCount: _items.length,
                itemBuilder: (context, index) {
                  final item = _items[index];
                  return Card(
                    margin: const EdgeInsets.all(8.0),
                    child: ListTile(
                      title: ${listTileFields.title},
                      subtitle: ${listTileFields.subtitle},
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.edit),
                            onPressed: () => _showEditDialog(item),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete),
                            onPressed: () => _deleteItem(item),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
    );
  }
}
`;
  }

  private generateFlutterFormFields(attributes: ParsedAttribute[], relations: EntityRelation[]) {
    const controllers = attributes.map(attr => {
      return `final _${attr.name}Controller = TextEditingController();`;
    }).join('\n    ');

    const initialization = attributes.map(attr => {
      if (attr.type === 'DateTime') {
        return `_${attr.name}Controller.text = item.${attr.name}?.toIso8601String() ?? '';`;
      }
      return `_${attr.name}Controller.text = item.${attr.name}?.toString() ?? '';`;
    }).join('\n      ');

    const widgets = attributes.map(attr => {
      return `TextField(
                controller: _${attr.name}Controller,
                decoration: InputDecoration(labelText: '${this.capitalizeFirstLetter(attr.name)}'),
              ),`;
    }).join('\n              ');

    const values = attributes.map(attr => {
      if (attr.type === 'int' || attr.type === 'Integer') {
        return `'${attr.name}': int.tryParse(_${attr.name}Controller.text),`;
      } else if (attr.type === 'double' || attr.type === 'Double') {
        return `'${attr.name}': double.tryParse(_${attr.name}Controller.text),`;
      } else if (attr.type === 'DateTime') {
        return `'${attr.name}': _${attr.name}Controller.text.isNotEmpty ? _${attr.name}Controller.text : null,`;
      }
      return `'${attr.name}': _${attr.name}Controller.text,`;
    }).join('\n                ');

    return {
      controllers,
      initialization,
      widgets,
      values
    };
  }

  private generateFlutterListTileFields(attributes: ParsedAttribute[]) {
    const titleField = attributes.find(attr => 
      ['name', 'title', 'nombre', 'titulo'].includes(attr.name.toLowerCase())
    ) || attributes[0];

    const subtitleFields = attributes.filter(attr => attr.name !== titleField?.name).slice(0, 2);

    const title = `Text(item.${titleField?.name}?.toString() ?? 'No name')`;
    const subtitle = subtitleFields.length > 0 
      ? `Text('${subtitleFields.map(f => `${this.capitalizeFirstLetter(f.name)}: \${item.${f.name} ?? "N/A"}`).join(' | ')}')`
      : `Text('ID: \${item.id}')`;

    return { title, subtitle };
  }

  private async updateFlutterNavigation(pagesList: any[], basePath: string) {
    // Actualizar go_router.dart
    const routesContent = this.generateFlutterRoutes(pagesList);
    await fs.promises.writeFile(
      path.join(basePath, 'lib', 'src', 'routes', 'go_router.dart'),
      routesContent
    );

    // Actualizar welcome_page.dart
    const welcomePageContent = this.generateFlutterWelcomePage(pagesList);
    await fs.promises.writeFile(
      path.join(basePath, 'lib', 'src', 'pages', 'welcome_page.dart'),
      welcomePageContent
    );

    // Actualizar pubspec.yaml para agregar http dependency
    await this.updateFlutterPubspec(basePath);
  }

  private generateFlutterRoutes(pagesList: any[]): string {
    const imports = pagesList.map(page => 
      `import '../pages/${page.name.toLowerCase()}_page.dart';`
    ).join('\n');

    const routes = pagesList.map(page => 
      `    GoRoute(
      path: '/${page.name.toLowerCase()}',
      builder: (context, state) => const ${page.name}Page(),
    ),`
    ).join('\n');

    return `import 'package:flutter_front/src/pages/welcome_page.dart';
import 'package:go_router/go_router.dart';
${imports}

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/', builder: (context, state) => const WelcomePage()),
${routes}
  ],
);
`;
  }

  private generateFlutterWelcomePage(pagesList: any[]): string {
    const imports = pagesList.map(page => 
      `import 'package:flutter_front/src/pages/${page.name.toLowerCase()}_page.dart';`
    ).join('\n');

    const pagesArray = pagesList.map(page => 
      `    {'title': '${page.title}', 'widget': const ${page.name}Page()},`
    ).join('\n');

    return `import 'package:flutter/material.dart';
${imports}

class WelcomePage extends StatefulWidget {
  const WelcomePage({super.key});

  @override
  State<WelcomePage> createState() => _WelcomePageState();
}

class _WelcomePageState extends State<WelcomePage> {
  // List of pages with titles so we can build the Drawer dynamically
  final pages = [
${pagesArray}
  ];

  // Currently selected page index
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Welcome Page')),
      body: pages[_selectedIndex]['widget'] as Widget,
      drawer: Drawer(
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const DrawerHeader(
                decoration: BoxDecoration(color: Colors.blue),
                child: Text(
                  'Navegación',
                  style: TextStyle(color: Colors.white, fontSize: 20),
                ),
              ),
              ...List.generate(pages.length, (i) {
                final title = pages[i]['title'] as String;
                return ListTile(
                  title: Text(title),
                  selected: i == _selectedIndex,
                  onTap: () {
                    setState(() {
                      _selectedIndex = i;
                    });
                    Navigator.of(context).pop();
                  },
                );
              }),
            ],
          ),
        ),
      ),
    );
  }
}
`;
  }

  private async updateFlutterPubspec(basePath: string) {
    const pubspecPath = path.join(basePath, 'pubspec.yaml');
    
    try {
      let content = await fs.promises.readFile(pubspecPath, 'utf8');
      
      // Agregar http dependency si no existe
      if (!content.includes('http:')) {
        content = content.replace(
          'cupertino_icons: ^1.0.8',
          `cupertino_icons: ^1.0.8
  http: ^1.1.0`
        );
      }
      
      await fs.promises.writeFile(pubspecPath, content);
    } catch (error) {
      console.error('Error updating pubspec.yaml:', error);
    }
  }

  private javaToDartType(javaType: string): string {
    const typeMap: { [key: string]: string } = {
      'String': 'String',
      'int': 'int',
      'Integer': 'int',
      'long': 'int',
      'Long': 'int',
      'double': 'double',
      'Double': 'double',
      'float': 'double',
      'Float': 'double',
      'boolean': 'bool',
      'Boolean': 'bool',
      'DateTime': 'DateTime',
      'LocalDate': 'DateTime',
      'LocalDateTime': 'DateTime',
    };

    return typeMap[javaType] || 'String';
  }
}
