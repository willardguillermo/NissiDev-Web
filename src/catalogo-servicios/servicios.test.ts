import { describe, expect, it } from 'vitest';
import { SERVICIOS } from './servicios';

describe('servicios', () => {
  it('son los 4 del video de marca, en orden y con sus frases exactas', () => {
    expect(SERVICIOS).toEqual([
      { nombre: 'Páginas web', frase: 'Que te encuentren. Que te elijan.' },
      { nombre: 'Sistemas a medida', frase: 'Tu negocio, bajo control.' },
      { nombre: 'Aplicaciones móviles', frase: 'Tu negocio en el bolsillo de tus clientes.' },
      { nombre: 'Paneles de administración', frase: 'Decide con datos, no con suposiciones.' },
    ]);
  });
});
