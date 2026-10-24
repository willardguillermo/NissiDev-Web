import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { duracionImpresion, iniciarSecuenciaImpresion, type FaseImpresion } from './impresion';

describe('duracionImpresion', () => {
  it.each([
    [-10, 1200],
    [0, 1200],
    [857, 1200],
    [858, 1201],
    [1000.4, 1401],
    [1856, 2598],
    [1857, 2600],
    [10000, 2600],
  ])('papel de %s px tarda %s ms (límites y redondeo)', (alto, esperado) => {
    expect(duracionImpresion(alto)).toBe(esperado);
  });
});

describe('iniciarSecuenciaImpresion', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it.each([
    [300, 1200],
    [1000, 1400],
    [3000, 2600],
  ])('respeta las tres fases para %s px, sin pausa final', (alto, duracion) => {
    const cambiarFase = vi.fn();
    const cancelar = iniciarSecuenciaImpresion({ alto, menosMovimiento: false, cambiarFase });
    expect(cambiarFase.mock.calls).toEqual([['preparando']]);
    vi.advanceTimersByTime(899);
    expect(cambiarFase).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1);
    expect(cambiarFase.mock.calls).toEqual([['preparando'], ['imprimiendo']]);
    vi.advanceTimersByTime(duracion - 1);
    expect(cambiarFase).toHaveBeenCalledTimes(2);
    vi.advanceTimersByTime(1);
    expect(cambiarFase.mock.calls).toEqual([['preparando'], ['imprimiendo'], ['lista']]);
    expect(vi.getTimerCount()).toBe(0);
    cancelar();
    expect(cambiarFase).toHaveBeenCalledTimes(3);
  });

  it('con movimiento reducido pasa directamente a lista sin temporizadores', () => {
    const cambiarFase = vi.fn();
    const cancelar = iniciarSecuenciaImpresion({ alto: 3000, menosMovimiento: true, cambiarFase });
    expect(cambiarFase.mock.calls).toEqual([['lista']]);
    expect(vi.getTimerCount()).toBe(0);
    cancelar();
    vi.runAllTimers();
    expect(cambiarFase.mock.calls).toEqual([['lista']]);
  });

  it.each([0, 450, 900, 1500])('cancelar a los %s ms no escribe ni deja callbacks o timers', (tiempo) => {
    let texto = '';
    const cambiarFase = vi.fn((fase: FaseImpresion) => { texto = fase; });
    const cancelar = iniciarSecuenciaImpresion({ alto: 3000, menosMovimiento: false, cambiarFase });
    vi.advanceTimersByTime(tiempo);
    const avisos = cambiarFase.mock.calls.length;
    expect(texto).toBe(tiempo < 900 ? 'preparando' : 'imprimiendo');
    // Imita un texto nuevo puesto por React antes de limpiar el efecto anterior.
    texto = 'texto actualizado';
    cancelar();
    cancelar();
    expect(texto).toBe('texto actualizado');
    expect(cambiarFase).toHaveBeenCalledTimes(avisos);
    expect(vi.getTimerCount()).toBe(0);
    vi.runAllTimers();
    expect(texto).toBe('texto actualizado');
    expect(cambiarFase).toHaveBeenCalledTimes(avisos);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('permite cancelar desde el aviso de impresión sin dejar el final pendiente', () => {
    let cancelar = () => {};
    const cambiarFase = vi.fn((fase: FaseImpresion) => {
      if (fase === 'imprimiendo') cancelar();
    });
    cancelar = iniciarSecuenciaImpresion({ alto: 1000, menosMovimiento: false, cambiarFase });
    vi.advanceTimersByTime(900);
    expect(vi.getTimerCount()).toBe(0);
    vi.runAllTimers();
    expect(cambiarFase.mock.calls).toEqual([['preparando'], ['imprimiendo']]);
  });

  it('al repetir, la secuencia cancelada no adelanta el final de la nueva', () => {
    const cambiarFase = vi.fn();
    const opciones = { alto: 3000, menosMovimiento: false, cambiarFase };
    const cancelarAnterior = iniciarSecuenciaImpresion(opciones);
    vi.advanceTimersByTime(1000);
    cancelarAnterior();
    const cancelarNueva = iniciarSecuenciaImpresion(opciones);
    vi.advanceTimersByTime(2500); // La anterior habría terminado aquí.
    expect(cambiarFase.mock.calls).toEqual([
      ['preparando'], ['imprimiendo'], ['preparando'], ['imprimiendo'],
    ]);
    vi.advanceTimersByTime(1000);
    expect(cambiarFase).toHaveBeenLastCalledWith('lista');
    expect(cambiarFase).toHaveBeenCalledTimes(5);
    expect(vi.getTimerCount()).toBe(0);
    cancelarNueva();
  });
});
