"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, db, googleProvider } from "@/lib/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { IconLoader2 } from "@tabler/icons-react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Update Firebase Auth Profile
      await updateProfile(user, { displayName: email.split("@")[0] });

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: email.split("@")[0],
        email: email,
        photoURL: "",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        role: "user",
      });

      router.push('/');
      router.refresh();
    } catch (error: any) {
      // English Error Handling
      if (error.code === 'auth/email-already-in-use') {
        setError("This email is already in use.");
      } else if (error.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp(),
        role: "user",
      }, { merge: true });

      router.push('/');
      router.refresh();
    } catch (error: any) {
      setError("Google sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 font-sans", className)} {...props}>
      <form onSubmit={handleSignUp}>
        <FieldGroup className="space-y-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Account</h1>
            <FieldDescription className="text-xs font-bold uppercase tracking-wide">
              Already have an account?{" "}
              <a href="/login" className="text-primary font-bold hover:underline">
                Sign in
              </a>
            </FieldDescription>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-md text-center font-bold border border-destructive/20">
              {error}
            </div>
          )}

          <Field className="space-y-1">
            <FieldLabel htmlFor="email" className="text-xs font-bold uppercase text-muted-foreground">Email Address</FieldLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              placeholder="name@example.com"
              className="h-11 rounded-md font-medium"
              required
              disabled={isLoading}
            />
          </Field>

          <Field className="space-y-1">
            <FieldLabel htmlFor="password"  className="text-xs font-bold uppercase text-muted-foreground">Password</FieldLabel>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type="password"
              placeholder="••••••••"
              className="h-11 rounded-md font-medium"
              required
              disabled={isLoading}
            />
          </Field>

          <Field className="space-y-1">
            <FieldLabel htmlFor="confirm-password" className="text-xs font-bold uppercase text-muted-foreground">Confirm Password</FieldLabel>
            <Input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className="h-11 rounded-md font-medium"
              required
              disabled={isLoading}
            />
          </Field>

          <Button type="submit" className="w-full h-11 font-bold uppercase text-xs tracking-widest rounded-md" disabled={isLoading}>
            {isLoading ? <IconLoader2 className="animate-spin size-4 mr-2" /> : "Create Account"}
          </Button>

          <FieldSeparator className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Or</FieldSeparator>

          <Button variant="outline" type="button" className="w-full h-11 font-bold uppercase text-xs tracking-widest rounded-md border-border" onClick={handleGoogleSignIn} disabled={isLoading}>
            <FcGoogle className="size-5 mr-2" />
            Continue with Google
          </Button>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center text-[10px] font-medium leading-relaxed">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline font-bold hover:text-primary">Terms of Service</a>{" "}
        and <a href="#" className="underline font-bold hover:text-primary">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}