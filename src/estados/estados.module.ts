import { Module } from '@nestjs/common';
import { EstadosService } from './estados.service';
import { EstadosController } from './estados.controller';
import { Sepomex } from 'src/db/entities/sepomex.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [EstadosController],
  providers: [EstadosService],
  imports: [TypeOrmModule.forFeature([Sepomex])],
})
export class EstadosModule {}
