/** Client-safe agent session shape (mirrors middleware viewer headers). */
export type AgentViewer = {
  userId: string;
  email: string | null;
  fullName: string | null;
  role: string | null;
  status: string | null;
  onboardingPaid: boolean;
  photoUrl: string | null;
  phone: string | null;
  agentState: string | null;
  agentLga: string | null;
};
