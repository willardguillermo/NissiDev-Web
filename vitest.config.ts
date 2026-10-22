import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Vitest no procesa CSS por defecto (llega vacío); tokens.test.ts lee los colores reales.
    css: { include: [/tokens\.css/] },
  },
});
