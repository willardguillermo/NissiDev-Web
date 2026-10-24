import type { Ref } from 'react';
import type { FaseImpresion } from '../../cotizacion/impresion';

const ESTADOS: Record<FaseImpresion, string> = {
  preparando: 'Preparando tu cotización',
  imprimiendo: 'Imprimiendo tu cotización',
  lista: 'Cotización lista',
};

export default function Ticketera({ fase, refEstado }: {
  fase: FaseImpresion;
  refEstado?: Ref<HTMLParagraphElement>;
}) {
  return (
    <div className="ticketera zona-oscura">
      <div className="ticketera__marca" aria-hidden="true">
        <span>NissiDev</span><span>Proforma NSD</span>
      </div>
      <p ref={refEstado} tabIndex={-1} className="ticketera__estado" role="status" aria-live="polite">
        <span className="ticketera__indicador" aria-hidden="true">{fase === 'lista' ? '✓' : '·'}</span>
        {ESTADOS[fase]}
      </p>
      <span className="ticketera__ranura" aria-hidden="true" />
    </div>
  );
}
