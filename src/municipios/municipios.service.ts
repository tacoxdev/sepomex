import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sepomex } from 'src/db/entities/sepomex.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MunicipiosService {
  constructor(
    @InjectRepository(Sepomex)
    private readonly repo: Repository<Sepomex>,
  ) {}

  async findOne(cveEstado: string) {
    const municipios = await this.repo
      .createQueryBuilder('sepomex')
      .distinct(true)
      .select('sepomex.c_estado', 'cveEstado')
      .addSelect('sepomex.c_mnpio', 'cveMunicipio')
      .addSelect('sepomex.D_mnpio', 'municipio')
      .where('sepomex.c_estado = :cveEstado', { cveEstado })
      .orderBy('sepomex.c_mnpio', 'ASC')
      .getRawMany<{
        cveEstado: string;
        cveMunicipio: string;
        municipio: string;
      }>();

    return municipios.map((municipio) => ({ ...municipio }));
  }
}
