export type AgentRow = {
  id: string;
  name: string;
  email: string;
  submittedAt: string;
  status: 'pending' | 'verified' | 'rejected';
};

export type TravelAppRow = {
  id: string;
  applicant: string;
  destination: string;
  type: string;
  submittedAt: string;
  status: 'new' | 'in_review' | 'approved' | 'declined';
};

export type InquiryRow = {
  id: string;
  from: string;
  subject: string;
  channel: string;
  receivedAt: string;
  read: boolean;
};

export const MOCK_AGENTS: AgentRow[] = [
  { id: 'a1', name: 'Kemi Adeyemi', email: 'kemi@example.com', submittedAt: '2026-04-18', status: 'pending' },
  { id: 'a2', name: 'Tunde Bakare', email: 'tunde@example.com', submittedAt: '2026-04-17', status: 'pending' },
  { id: 'a3', name: 'Amaka Obi', email: 'amaka@example.com', submittedAt: '2026-04-10', status: 'verified' },
];

export const MOCK_TRAVEL_APPS: TravelAppRow[] = [
  {
    id: 't1',
    applicant: 'Chidi Eze',
    destination: 'Canada',
    type: 'Study permit',
    submittedAt: '2026-04-19',
    status: 'in_review',
  },
  {
    id: 't2',
    applicant: 'Funke Lawal',
    destination: 'United Kingdom',
    type: 'Visitor visa',
    submittedAt: '2026-04-18',
    status: 'new',
  },
  {
    id: 't3',
    applicant: 'Ibrahim Musa',
    destination: 'UAE',
    type: 'Work route',
    submittedAt: '2026-04-15',
    status: 'approved',
  },
];

export const MOCK_INQUIRIES: InquiryRow[] = [
  {
    id: 'i1',
    from: 'visitor@email.com',
    subject: 'Luxury villa in Ibadan',
    channel: 'Web form',
    receivedAt: '2026-04-20 09:12',
    read: false,
  },
  {
    id: 'i2',
    from: '+234 803 …',
    subject: 'Callback request — Lagos listing',
    channel: 'Phone',
    receivedAt: '2026-04-19 14:40',
    read: true,
  },
  {
    id: 'i3',
    from: 'investor@corp.ng',
    subject: 'Commercial space viewing',
    channel: 'Email',
    receivedAt: '2026-04-18 11:05',
    read: false,
  },
];
