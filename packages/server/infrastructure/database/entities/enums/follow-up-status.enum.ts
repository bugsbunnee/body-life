export enum FollowUpStatus {
   Pending = 'pending',
   Assigned = 'assigned',
   Contacted = 'contacted',
   NotReachable = 'not-reachable',
   Integrated = 'integrated',
}

export enum ContactMethod {
   Call = 'call',
   Sms = 'sms',
   WhatsApp = 'whatsapp',
   Email = 'email',
   Visit = 'visit',
}

export const CONTACT_METHODS = Object.values(ContactMethod);
export const FOLLOW_UP_STATUS = Object.values(FollowUpStatus);
