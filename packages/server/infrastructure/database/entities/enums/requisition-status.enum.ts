export enum RequisitionStatus {
   Pending = 'pending',
   Approved = 'approved',
   Disbursed = 'disbursed',
   Rejected = 'rejected',
}

export const REQUISITION_STATUS = Object.values(RequisitionStatus);
