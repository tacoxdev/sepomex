import { Module } from '@nestjs/common';
import { MunicipiosService } from './municipios.service';
import { MunicipiosController } from './municipios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sepomex } from 'src/db/entities/sepomex.entity';

@Module({
  controllers: [MunicipiosController],
  providers: [MunicipiosService],
  imports: [TypeOrmModule.forFeature([Sepomex])],
})
export class MunicipiosModule {}
