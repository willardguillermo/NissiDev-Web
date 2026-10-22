// Los 4 servicios de NissiDev con las frases del video de marca (textos de Guillermo: no cambiarlos).

export interface Servicio {
  nombre: string;
  frase: string;
}

export const SERVICIOS: readonly Servicio[] = [
  { nombre: 'Páginas web', frase: 'Que te encuentren. Que te elijan.' },
  { nombre: 'Sistemas a medida', frase: 'Tu negocio, bajo control.' },
  { nombre: 'Aplicaciones móviles', frase: 'Tu negocio en el bolsillo de tus clientes.' },
  { nombre: 'Paneles de administración', frase: 'Decide con datos, no con suposiciones.' },
];
