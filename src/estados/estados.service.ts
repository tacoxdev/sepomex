import { Injectable } from '@nestjs/common';

const ESTADOS_DE_MEXICO = [
  { cve_estado: '01', estado: 'Aguascalientes' },
  { cve_estado: '02', estado: 'Baja California' },
  { cve_estado: '03', estado: 'Baja California Sur' },
  { cve_estado: '04', estado: 'Campeche' },
  { cve_estado: '05', estado: 'Coahuila de Zaragoza' },
  { cve_estado: '06', estado: 'Colima' },
  { cve_estado: '07', estado: 'Chiapas' },
  { cve_estado: '08', estado: 'Chihuahua' },
  { cve_estado: '09', estado: 'Ciudad de México' },
  { cve_estado: '10', estado: 'Durango' },
  { cve_estado: '11', estado: 'Guanajuato' },
  { cve_estado: '12', estado: 'Guerrero' },
  { cve_estado: '13', estado: 'Hidalgo' },
  { cve_estado: '14', estado: 'Jalisco' },
  { cve_estado: '15', estado: 'México' },
  { cve_estado: '16', estado: 'Michoacán' },
  { cve_estado: '17', estado: 'Morelos' },
  { cve_estado: '18', estado: 'Nayarit' },
  { cve_estado: '19', estado: 'Nuevo León' },
  { cve_estado: '20', estado: 'Oaxaca' },
  { cve_estado: '21', estado: 'Puebla' },
  { cve_estado: '22', estado: 'Querétaro' },
  { cve_estado: '23', estado: 'Quintana Roo' },
  { cve_estado: '24', estado: 'San Luis Potosí' },
  { cve_estado: '25', estado: 'Sinaloa' },
  { cve_estado: '26', estado: 'Sonora' },
  { cve_estado: '27', estado: 'Tabasco' },
  { cve_estado: '28', estado: 'Tamaulipas' },
  { cve_estado: '29', estado: 'Tlaxcala' },
  { cve_estado: '30', estado: 'Veracruz' },
  { cve_estado: '31', estado: 'Yucatán' },
  { cve_estado: '32', estado: 'Zacatecas' },
] as const;

@Injectable()
export class EstadosService {
  findAll() {
    return ESTADOS_DE_MEXICO.map((estado) => ({ ...estado }));
  }
}
