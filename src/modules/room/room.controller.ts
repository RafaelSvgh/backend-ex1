import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { Response } from 'express';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { generarID } from 'src/helpers/generate-id.helper';
import * as archiver from 'archiver';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

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

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    createRoomDto.id = generarID();
    return this.roomService.create(createRoomDto);
  }

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }

  @Post('/join')
  joinRoom(@Body('id') id: string, @Body('userId') userId: string) {
    return this.roomService.addUserToRoom(id, +userId);
  }

  @Post('downloadZip')
  async downloadZip(@Res() res: Response, @Body() diagramModel: DiagramModel) {
    let tempProjectPath: string | null = null;
    
    try {
      // Validar que se proporcione el modelo de diagrama
      if (!diagramModel || !diagramModel.nodeDataArray || diagramModel.nodeDataArray.length === 0) {
        return res.status(400).json({ 
          error: 'Se requiere un modelo de diagrama válido con nodeDataArray' 
        });
      }

      // Ruta del proyecto original
      const originalProjectPath = path.join(process.cwd(), 'back_examen');
      
      // Verificar que la carpeta original existe
      if (!fs.existsSync(originalProjectPath)) {
        return res.status(404).json({ 
          error: 'La carpeta back_examen no fue encontrada' 
        });
      }

      // Crear una copia temporal del proyecto
      const timestamp = Date.now();
      const tempProjectName = `back_examen_temp_${timestamp}`;
      tempProjectPath = path.join(process.cwd(), tempProjectName);
      
      console.log('Creando copia temporal del proyecto...');
      await this.copyDirectory(originalProjectPath, tempProjectPath);

      // Generar los archivos Java en la copia temporal
      console.log('Generando archivos Java en la copia temporal...');
      await this.roomService.generateJavaFilesFromDiagram(diagramModel, tempProjectPath);

      // Configurar headers para la descarga
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${tempProjectName}.zip"`);

      // Crear el archivo ZIP
      const archive = archiver('zip', {
        zlib: { level: 9 } // Nivel de compresión máximo
      });

      // Manejar errores del archivo
      archive.on('error', (err) => {
        console.error('Error al crear el ZIP:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error al crear el archivo ZIP' });
        }
      });

      // Cuando termine de crear el ZIP, eliminar la carpeta temporal
      archive.on('end', async () => {
        console.log('ZIP creado, eliminando carpeta temporal...');
        if (tempProjectPath) {
          await this.deleteTempDirectory(tempProjectPath);
        }
      });

      // Enviar el stream del ZIP como respuesta
      archive.pipe(res);

      // Agregar toda la carpeta temporal al ZIP
      archive.directory(tempProjectPath, tempProjectName);

      // Finalizar el archivo ZIP
      await archive.finalize();

    } catch (error) {
      console.error('Error en downloadZip:', error);
      
      // Limpiar carpeta temporal si existe
      if (tempProjectPath && fs.existsSync(tempProjectPath)) {
        await this.deleteTempDirectory(tempProjectPath);
      }
      
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Error interno del servidor al generar el ZIP' 
        });
      }
    }
  }

  // Método auxiliar para copiar directorios recursivamente
  private async copyDirectory(src: string, dest: string): Promise<void> {
    await fs.promises.mkdir(dest, { recursive: true });
    
    const entries = await fs.promises.readdir(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }
  }

  // Método auxiliar para eliminar directorios temporales
  private async deleteTempDirectory(dirPath: string): Promise<void> {
    try {
      if (fs.existsSync(dirPath)) {
        const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry.name);
          
          if (entry.isDirectory()) {
            await this.deleteTempDirectory(fullPath);
          } else {
            await fs.promises.unlink(fullPath);
          }
        }
        
        await fs.promises.rmdir(dirPath);
        // console.log(`Carpeta temporal eliminada: ${dirPath}`);
      }
    } catch (error) {
      console.error('Error al eliminar carpeta temporal:', error);
    }
  }

  @Post('downloadFlutterZip')
  async downloadFlutterZip(@Body() diagramModel: DiagramModel, @Res() res: Response) {
    const tempDir = path.join(process.cwd(), 'temp', `flutter-project-${Date.now()}`);
    
    try {
      // Crear directorio temporal
      await fs.promises.mkdir(tempDir, { recursive: true });
      
      // Generar archivos de Flutter desde el diagrama
      await this.roomService.generateFlutterFilesFromDiagram(diagramModel, tempDir);
      
      // Configurar headers para descarga de ZIP
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="flutter-project.zip"',
      });
      
      // Crear archivo ZIP
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      // Manejar errores del archiver
      archive.on('error', (err) => {
        throw err;
      });
      
      // Pipe el archive a la respuesta
      archive.pipe(res);
      
      // Agregar todos los archivos del directorio temporal al ZIP
      archive.directory(tempDir, false);
      
      // Finalizar el archivo
      archive.finalize();
      
      // Limpiar el directorio temporal después de enviar el ZIP
      archive.on('end', async () => {
        await this.deleteTempDirectory(tempDir);
      });
      
    } catch (error) {
      console.error('Error generando proyecto Flutter:', error);
      
      // Limpiar el directorio temporal en caso de error
      await this.deleteTempDirectory(tempDir);
      
      if (!res.headersSent) {
        res.status(500).json({ 
          message: 'Error generando proyecto Flutter', 
          error: error.message 
        });
      }
    }
  }

}
