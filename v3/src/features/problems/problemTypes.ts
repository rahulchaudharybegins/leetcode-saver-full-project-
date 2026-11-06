export interface ProblemMethod {
  methodName: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  shortNote?: string;
  code?: string;
}

export interface Problem {
  id: string;
  userId?: string;
  problemName?: string;
  platform: string;
  problemUrl: string;
  difficulty?: string;
  tags?: string[];
  timeTaken?: number;
  timeTakenMinutes?: number;
  visitCount?: number;
  firstVisitedAt?: unknown;
  lastVisitedAt?: unknown;
  updatedAt?: unknown;
  createdAt?: unknown;
  methods?: ProblemMethod[];
  shortNote?: string;
}