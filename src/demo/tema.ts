import type { TemaDemo } from './tipos';

/** El tema del negocio como variables CSS (prefijo --d-) para el elemento raíz de la demo. */
export function variablesDeTema(tema: TemaDemo): Record<string, string> {
  return {
    '--d-marca': tema.marca,
    '--d-sobre-marca': tema.sobreMarca,
    '--d-marca-texto': tema.marcaTexto,
    '--d-texto': tema.texto,
    '--d-texto-suave': tema.textoSuave,
    '--d-fondo': tema.fondo,
    '--d-fondo-suave': tema.fondoSuave,
    '--d-amarillo': tema.etiquetaAmarilla,
    '--d-turquesa': tema.etiquetaTurquesa,
    '--d-fuente-titulos': tema.fuenteTitulos,
    '--d-fuente-texto': tema.fuenteTexto,
  };
}
