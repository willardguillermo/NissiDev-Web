// Cómo trabajo y con qué: lo usan el Inicio (versión corta) y Servicios. Un solo lugar para los textos.

export interface Paso {
  titulo: string;
  texto: string;
}

/** Maqueta → propuesta → ≈4 semanas → soporte (SPEC, T22). */
export const PASOS: readonly Paso[] = [
  { titulo: 'Maqueta', texto: 'Ves cómo quedaría, sin costo.' },
  { titulo: 'Propuesta', texto: 'Precio cerrado y qué incluye.' },
  { titulo: 'Desarrollo', texto: 'Unas 4 semanas, con avances.' },
  { titulo: 'Soporte', texto: 'Te acompaño después.' },
];

export interface GrupoTecnologias {
  para: string;
  tecnologias: readonly string[];
}

/** Agrupadas por para qué sirven: el dueño entiende el "para qué"; el reclutador ve el stack. */
export const STACK: readonly GrupoTecnologias[] = [
  { para: 'Páginas web', tecnologias: ['Astro', 'React'] },
  { para: 'Apps móviles', tecnologias: ['Kotlin · Android'] },
  { para: 'Sistemas y datos', tecnologias: ['Spring Boot', 'MySQL'] },
  { para: 'Publicación', tecnologias: ['Cloudflare'] },
];

/** Lista plana para los chips del Inicio. */
export const TECNOLOGIAS: readonly string[] = STACK.flatMap((grupo) => grupo.tecnologias);
