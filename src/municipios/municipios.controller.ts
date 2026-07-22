import { Controller, Get, Param } from '@nestjs/common';
import { MunicipiosService } from './municipios.service';

@Controller('municipios')
export class MunicipiosController {
  constructor(private readonly municipiosService: MunicipiosService) {}

  @Get(':cveEstado')
  findOne(@Param('cveEstado') cveEstado: string) {
    return this.municipiosService.findOne(cveEstado);
  }
}
