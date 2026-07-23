import test from 'node:test';
import assert from 'node:assert/strict';
import { runFluxnovaCalculationAgent } from '../dist/orchestration/fluxnovaAgent.js';

test('calculates eligibility, borrowing base, waterfall, and transfer evidence', () => {
  const run = runFluxnovaCalculationAgent();
  assert.equal(run.borrowingBase.results.length, run.deal.loans.length);
  assert.equal(run.borrowingBase.results.filter(r => r.eligible).length, 3);
  assert.ok(run.borrowingBase.maxAdvance > 0);
  assert.deepEqual(run.waterfall.map(w => w.priority), [1, 2, 3]);
  assert.match(run.transferStatus, /awaiting dual approval/);
  assert.ok(run.evidence.map(e => e.cdmEvent).includes('cdm.event.common.Instruction.transfer'));
});
