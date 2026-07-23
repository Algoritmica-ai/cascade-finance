import { sampleDeal } from '../domain/sampleDeal.js';
import type { AgentRun } from '../domain/cdm.js';
import { calculateBorrowingBase, doubleCheckLoanTape, extractDealTerms, initiateBankTransfer, runAbsBoxWaterfall } from '../primitives/adapters.js';

export function runFluxnovaCalculationAgent(): AgentRun {
  const extraction = extractDealTerms(sampleDeal);
  const validation = doubleCheckLoanTape(sampleDeal);
  const borrowingBase = calculateBorrowingBase(sampleDeal);
  const waterfall = runAbsBoxWaterfall(sampleDeal, borrowingBase);
  const transferStatus = initiateBankTransfer(waterfall);
  return {
    deal: sampleDeal, borrowingBase, waterfall, transferStatus,
    evidence: [
      extraction, validation,
      { primitive: 'Borrowing-base eligibility primitive', cdmEvent: 'cdm.observable.asset.calculation.BorrowingBase', summary: `Calculated max advance of $${borrowingBase.maxAdvance.toLocaleString(undefined, { maximumFractionDigits: 0 })}.`, risk: borrowingBase.results.some(r => !r.eligible) ? 'medium' : 'low' },
      { primitive: 'AbsBox waterfall adapter', cdmEvent: 'cdm.event.workflow.WorkflowStep.allocateCash', summary: `Allocated ${waterfall.length} payment priorities with trustee-style evidence.`, risk: 'low' },
      { primitive: 'Bank payment initiation adapter', cdmEvent: 'cdm.event.common.Instruction.transfer', summary: transferStatus, risk: 'medium' }
    ]
  };
}
