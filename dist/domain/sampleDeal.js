export const sampleDeal = {
    id: 'CF-WH-2026-07', assetClass: 'warehouse_abs', advanceRate: 0.82, concentrationLimit: 0.35, reserveRate: 0.03, couponDue: 185000, servicingFeeDue: 42000,
    parties: [
        { id: 'issuer', name: 'Cascade Funding LLC', role: 'issuer' },
        { id: 'servicer', name: 'Northstar Servicing', role: 'servicer' },
        { id: 'lender', name: 'Institutional Warehouse Bank', role: 'lender' },
        { id: 'paying-agent', name: 'Cascade Treasury Ops', role: 'paying_agent' }
    ],
    loans: [
        { id: 'LN-1001', borrowerFico: 742, state: 'CA', currentBalance: 210000, rate: 0.081, daysDelinquent: 0, ltv: 0.69, documentationComplete: true },
        { id: 'LN-1002', borrowerFico: 681, state: 'TX', currentBalance: 145000, rate: 0.092, daysDelinquent: 5, ltv: 0.74, documentationComplete: true },
        { id: 'LN-1003', borrowerFico: 618, state: 'FL', currentBalance: 118000, rate: 0.104, daysDelinquent: 31, ltv: 0.81, documentationComplete: true },
        { id: 'LN-1004', borrowerFico: 703, state: 'NY', currentBalance: 275000, rate: 0.076, daysDelinquent: 0, ltv: 0.66, documentationComplete: false },
        { id: 'LN-1005', borrowerFico: 766, state: 'CA', currentBalance: 310000, rate: 0.073, daysDelinquent: 0, ltv: 0.62, documentationComplete: true }
    ]
};
