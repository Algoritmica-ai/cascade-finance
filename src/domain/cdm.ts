export type AssetClass = 'warehouse_abs' | 'rmbs' | 'consumer_loan_abs';

export interface CdmParty { id: string; name: string; role: 'issuer'|'servicer'|'trustee'|'lender'|'paying_agent'; }
export interface CdmLoan { id:string; borrowerFico:number; state:string; currentBalance:number; rate:number; daysDelinquent:number; ltv:number; documentationComplete:boolean; }
export interface CdmDeal { id:string; assetClass:AssetClass; parties:CdmParty[]; advanceRate:number; concentrationLimit:number; reserveRate:number; couponDue:number; servicingFeeDue:number; loans:CdmLoan[]; }
export interface EligibilityResult { loanId:string; eligible:boolean; reasons:string[]; advanceValue:number; }
export interface BorrowingBase { eligibleCollateral:number; reserves:number; concentrationHaircut:number; maxAdvance:number; results:EligibilityResult[]; }
export interface WaterfallLine { recipient:string; priority:number; amount:number; status:'paid'|'shortfall'|'held'; }
export interface AgentEvidence { primitive:string; cdmEvent:string; summary:string; risk:'low'|'medium'|'high'; }
export interface AgentRun { deal:CdmDeal; borrowingBase:BorrowingBase; waterfall:WaterfallLine[]; transferStatus:string; evidence:AgentEvidence[]; }
