export function extractDealTerms(deal) {
    return { primitive: 'LoanWhiz prospectus / investor-report extractor', cdmEvent: 'cdm.event.workflow.WorkflowStep.extractTerms', summary: `Extracted advance rate ${(deal.advanceRate * 100).toFixed(1)}%, reserve ${(deal.reserveRate * 100).toFixed(1)}%, and ${deal.loans.length} loan records.`, risk: 'low' };
}
export function doubleCheckLoanTape(deal) {
    const exceptions = deal.loans.filter(l => !l.documentationComplete || l.daysDelinquent > 30 || l.ltv > .8).length;
    return { primitive: 'sf-agents loan-level verification', cdmEvent: 'cdm.event.common.BusinessEvent.validateLoanTape', summary: `${deal.loans.length - exceptions} loans passed automated tape checks; ${exceptions} require review.`, risk: exceptions ? 'medium' : 'low' };
}
export function calculateBorrowingBase(deal) {
    const results = deal.loans.map(loan => {
        const reasons = [
            loan.borrowerFico < 640 && 'FICO below 640',
            loan.daysDelinquent > 30 && 'Delinquency exceeds 30 days',
            loan.ltv > .8 && 'LTV exceeds 80%',
            !loan.documentationComplete && 'Missing required documents'
        ].filter(Boolean);
        return { loanId: loan.id, eligible: reasons.length === 0, reasons, advanceValue: reasons.length === 0 ? loan.currentBalance * deal.advanceRate : 0 };
    });
    const eligibleCollateral = results.reduce((sum, r) => sum + r.advanceValue, 0);
    const balancesByState = deal.loans.reduce((acc, loan) => ({ ...acc, [loan.state]: (acc[loan.state] ?? 0) + loan.currentBalance }), {});
    const largestStateShare = Math.max(...Object.values(balancesByState)) / deal.loans.reduce((sum, l) => sum + l.currentBalance, 0);
    const concentrationHaircut = largestStateShare > deal.concentrationLimit ? eligibleCollateral * (largestStateShare - deal.concentrationLimit) : 0;
    const reserves = eligibleCollateral * deal.reserveRate;
    return { eligibleCollateral, reserves, concentrationHaircut, maxAdvance: Math.max(0, eligibleCollateral - reserves - concentrationHaircut), results };
}
export function runAbsBoxWaterfall(deal, base) {
    const collections = deal.loans.reduce((sum, loan) => sum + loan.currentBalance * loan.rate / 12, 0) + 260000;
    let remaining = collections;
    return [
        { recipient: 'Servicer fee', priority: 1, amount: Math.min(remaining, deal.servicingFeeDue), status: remaining >= deal.servicingFeeDue ? 'paid' : 'shortfall' },
        { recipient: 'Senior note coupon', priority: 2, amount: Math.min(Math.max(remaining -= deal.servicingFeeDue, 0), deal.couponDue), status: remaining >= deal.couponDue ? 'paid' : 'shortfall' },
        { recipient: 'Principal paydown / borrowing base cure', priority: 3, amount: Math.max((remaining -= deal.couponDue), 0), status: base.maxAdvance > 0 ? 'paid' : 'held' }
    ];
}
export function initiateBankTransfer(waterfall) {
    const payable = waterfall.filter(line => line.status === 'paid').reduce((sum, line) => sum + line.amount, 0);
    return `Treasury transfer staged for $${payable.toLocaleString(undefined, { maximumFractionDigits: 0 })}; awaiting dual approval.`;
}
