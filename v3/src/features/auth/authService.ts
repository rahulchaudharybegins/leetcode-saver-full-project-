import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";

import { auth } from "../../firebase/auth";

export async function signUp(
  name: string,
  email: string,
  password: string,
) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  try {
    await updateProfile(credential.user, {
      displayName: name.trim(),
    });

    await sendEmailVerification(credential.user);
  } catch (error) {
    // Do not silently leave a partially configured account.
    // The account may already exist, so surface the original error.
    throw error;
  }

  return credential.user;
}

export async function logIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  return credential.user;
}

export async function logOut() {
  await signOut(auth);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email.trim());
}

export async function resendVerificationEmail() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be signed in to verify your email.");
  }

  await sendEmailVerification(user);
}

export async function sendVerificationEmailToCurrentUser() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be signed in to verify your email.");
  }

  if (user.emailVerified) {
    return;
  }

  await sendEmailVerification(user);
}