import { Controller, Get } from '@nestjs/common';
import { EstadosService } from './estados.service';

@Controller('estados')
export class EstadosController {
  constructor(private readonly estadosService: EstadosService) {}

  @Get()
  findAll() {
    return this.estadosService.findAll();
  }
}
