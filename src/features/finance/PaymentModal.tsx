"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency as money } from "@/lib/utils";
import { QueryError } from "@/components/ui/QueryError";
import type { Appointment, PaymentMethod } from "@/features/appointments/api/appointments.api";
import { financeApi, localDateTime, methodLabels } from "./finance.api";

type PaymentPart = { id: string; method: PaymentMethod; amount: number };
const methods = Object.keys(methodLabels) as PaymentMethod[];

export function PaymentModal({ appointment, onClose }: { appointment: Appointment; onClose: () => void }) {
  const qc = useQueryClient();
  const account = useQuery({ queryKey: ["finance", "customer", appointment.customerId], queryFn: () => financeApi.customer(appointment.customerId) });
  const current = account.data?.appointments.find(a => a.id === appointment.id);
  const remaining = current?.remaining ?? appointment.remaining ?? appointment.total;
  const [parts, setParts] = useState<PaymentPart[]>([{ id: crypto.randomUUID(), method: "PIX", amount: remaining }]);
  const [credit, setCredit] = useState(0);
  const [excess, setExcess] = useState<"CHANGE" | "CREDIT">("CHANGE");
  const [date, setDate] = useState(localDateTime);
  const [requestId] = useState(() => crypto.randomUUID());
  const available = account.data?.credit ?? 0;
  const received = Math.round(parts.reduce((sum, part) => sum + (Number.isFinite(part.amount) ? part.amount : 0), 0) * 100) / 100;
  const surplus = Math.max(0, Math.round((received + credit - remaining) * 100) / 100);
  const pending = Math.max(0, Math.round((remaining - received - credit) * 100) / 100);
  const usedMethods = new Set(parts.map(part => part.method));
  const updatePart = (id: string, patch: Partial<PaymentPart>) => setParts(rows => rows.map(row => row.id === id ? { ...row, ...patch } : row));
  const save = useMutation({
    mutationFn: () => financeApi.pay(appointment.id, {
      requestId, payments: parts.filter(part => part.amount > 0).map(({ amount, method }) => ({ amount, method })),
      useCredit: credit, excess, occurredAt: new Date(date).toISOString(),
    }),
    onSuccess: () => { void qc.invalidateQueries(); toast.success("Pagamento registrado."); onClose(); },
  });
  const valid = !!account.data && !!current && parts.every(part => Number.isFinite(part.amount) && part.amount >= 0)
    && new Set(parts.map(part => part.method)).size === parts.length && Number.isFinite(credit) && credit >= 0
    && credit <= available && credit <= remaining && received + credit > 0 && !!date && Number.isFinite(new Date(date).getTime());

  return <Modal open title="Registrar pagamento" onClose={onClose} busy={save.isPending} size="lg" footer={
    <Button variant="primary" onClick={() => valid && new Date(date).getTime() <= Date.now() + 60000 ? save.mutate() : toast.error("Confira os valores, o crédito e a data do pagamento.")} disabled={save.isPending || account.isLoading}>Confirmar pagamento</Button>
  }>
    <div className="space-y-4">
      <p className="text-sm text-text-muted">{appointment.customerName} · Valor do atendimento {money(appointment.total)}</p>
      {account.isError && <QueryError onRetry={() => account.refetch()} />}
      <div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-amber-50 p-3 text-amber-900">Em aberto<strong className="block text-xl">{money(remaining)}</strong></div><div className="rounded-xl bg-emerald-50 p-3 text-emerald-900">Crédito disponível<strong className="block text-xl">{money(available)}</strong></div></div>

      <fieldset className="space-y-3"><div className="flex items-center justify-between gap-3"><legend className="text-sm font-medium">Formas de pagamento</legend><Button type="button" variant="outline" size="sm" disabled={parts.length >= methods.length} onClick={() => {
        const method = methods.find(value => !usedMethods.has(value)); if (method) setParts(rows => [...rows, { id:crypto.randomUUID(), method, amount:0 }]);
      }}><Plus size={14}/>Adicionar forma</Button></div>
        {parts.map((part,index)=><div key={part.id} className="grid grid-cols-[minmax(0,1fr)_minmax(110px,1fr)_auto] items-end gap-2 rounded-xl border border-border p-3">
          <label className="text-xs text-text-muted">Forma<select value={part.method} onChange={event=>updatePart(part.id,{method:event.target.value as PaymentMethod})} className="mt-1 min-h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm">{methods.map(value=><option key={value} value={value} disabled={value!==part.method&&usedMethods.has(value)}>{methodLabels[value]}</option>)}</select></label>
          <Input label="Valor (R$)" type="number" min="0" step="0.01" value={part.amount} onChange={event=>updatePart(part.id,{amount:Number(event.target.value)})}/>
          <button type="button" aria-label="Remover forma" disabled={parts.length===1} onClick={()=>setParts(rows=>rows.filter(row=>row.id!==part.id))} className="mb-1 grid size-10 place-items-center rounded-lg text-danger hover:bg-rose-50 disabled:opacity-30"><Trash2 size={16}/></button>
          {index===0&&parts.length>1&&<p className="col-span-3 text-[11px] text-text-muted">Cada forma será registrada separadamente no caixa, sem duplicar o atendimento.</p>}
        </div>)}
      </fieldset>

      <Input label="Usar crédito do cliente (R$)" type="number" min="0" max={Math.min(remaining,available)} step="0.01" value={credit} onChange={event=>setCredit(Number(event.target.value))}/>
      <Input label="Data do pagamento" type="datetime-local" value={date} onChange={event=>setDate(event.target.value)}/>
      {surplus>0&&<label className="block text-sm">Sobram {money(surplus)}<select value={excess} onChange={event=>setExcess(event.target.value as "CHANGE"|"CREDIT")} className="mt-1 w-full rounded-lg border border-border bg-surface p-3"><option value="CHANGE">Devolver como troco</option><option value="CREDIT">Guardar como crédito do cliente</option></select></label>}
      <div className="space-y-2 rounded-xl bg-bg p-4 text-sm"><p>Total informado: <strong>{money(received)}</strong></p><p>Entrada no caixa: <strong>{money(received-(excess==="CHANGE"?surplus:0))}</strong></p><p>Restará em aberto: <strong>{money(pending)}</strong></p><p>Crédito após pagamento: <strong>{money(available-credit+(excess==="CREDIT"?surplus:0))}</strong></p></div>
      <p className="text-xs text-text-muted">O crédito é aplicado separadamente e não gera uma nova entrada no caixa.</p>
    </div>
  </Modal>;
}
