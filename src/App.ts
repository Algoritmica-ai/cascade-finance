import { runFluxnovaCalculationAgent } from './orchestration/fluxnovaAgent.js';

const money = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
const run = runFluxnovaCalculationAgent();

function App() {
  const eligible = run.borrowingBase.results.filter(r => r.eligible).length;
  return `<main>
    <section class="hero">
      <div><p class="eyebrow">Enterprise calculation agent · Fluxnova + CDM + primitives</p><h1>Warehouse ABS funding cockpit</h1><p>Review prospectus extraction, loan-tape checks, eligibility, borrowing base, waterfall outputs, and payment initiation in one governed operator workflow.</p></div>
      <div class="card approval"><span class="icon">⛨</span><strong>${run.transferStatus}</strong><span>Human-in-the-loop controls before bank release</span></div>
    </section>
    <section class="grid metrics">
      <div class="card"><span>Eligible loans</span><strong>${eligible}/${run.deal.loans.length}</strong></div>
      <div class="card"><span>Eligible collateral</span><strong>${money(run.borrowingBase.eligibleCollateral)}</strong></div>
      <div class="card"><span>Reserves + haircuts</span><strong>${money(run.borrowingBase.reserves + run.borrowingBase.concentrationHaircut)}</strong></div>
      <div class="card accent"><span>Max advance</span><strong>${money(run.borrowingBase.maxAdvance)}</strong></div>
    </section>
    <section class="columns">
      <div class="card"><h2>Fluxnova orchestration</h2>${run.evidence.map((e, i) => `<div class="step"><div class="badge">${i+1}</div><div><b>${e.primitive}</b><p>${e.summary}</p><code>${e.cdmEvent}</code></div></div>`).join('')}</div>
      <div class="card"><h2>Waterfall</h2>${run.waterfall.map(line => `<div class="waterfall"><span>${line.priority}. ${line.recipient}</span><b>${money(line.amount)}</b><em>${line.status}</em></div>`).join('')}</div>
    </section>
    <section class="card"><h2>Loan-level eligibility checks</h2><table><thead><tr><th>Loan</th><th>Status</th><th>Advance value</th><th>Practitioner flags</th></tr></thead><tbody>${run.borrowingBase.results.map(r => `<tr><td>${r.loanId}</td><td>${r.eligible ? '✓ Eligible' : 'Review'}</td><td>${money(r.advanceValue)}</td><td>${r.reasons.join(', ') || 'Meets FICO, delinquency, LTV, and documentation criteria'}</td></tr>`).join('')}</tbody></table></section>
    <section class="architecture"><div>Asset-class UI</div><span>↓</span><div>⚙ Fluxnova orchestration engine</div><span>↓</span><div>CDM messages to LoanWhiz · sf-agents · AbsBox · bank rails</div></section>
  </main>`;
}

document.getElementById('root')!.innerHTML = App();
