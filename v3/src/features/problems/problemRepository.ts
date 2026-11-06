import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firestore";
import type { Problem } from "./problemTypes";

export interface UpdateProblemInput {
  problemName: string;
  difficulty: string;
  tags: string[];
  timeTaken?: number;
  shortNote: string;
  methods: {
    methodName: string;
    timeComplexity?: string;
    spaceComplexity?: string;
    shortNote?: string;
    code?: string;
  }[];
}

function toProblem(snapshot: { id: string; data: () => Record<string, unknown> }): Problem {
  return {
    ...(snapshot.data() as Record<string, unknown>),
    id: snapshot.id,
  } as Problem;
}

export async function getProblems(userId: string): Promise<Problem[]> {
  const problemsRef = collection(db, "users", userId, "problems");
  const snapshot = await getDocs(problemsRef);

  return snapshot.docs.map((docSnapshot) => toProblem(docSnapshot));
}

export async function getProblemById(
  userId: string,
  problemId: string,
): Promise<Problem | null> {
  const problemRef = doc(db, "users", userId, "problems", problemId);
  const snapshot = await getDoc(problemRef);

  if (!snapshot.exists()) {
    return null;
  }

  return toProblem(snapshot);
}

export async function getProblemByIdForEdit(
  userId: string,
  problemId: string,
): Promise<Problem | null> {
  const problemRef = doc(
    db,
    "users",
    userId,
    "problems",
    problemId,
  );

  const snapshot = await getDoc(problemRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    ...snapshot.data(),
    id: snapshot.id,
  } as Problem;
}

export async function updateProblem(
  userId: string,
  problemId: string,
  input: UpdateProblemInput,
): Promise<void> {
  const problemRef = doc(db, "users", userId, "problems", problemId);

  await updateDoc(problemRef, {
    ...input,
    updatedAt: new Date(),
  });
}