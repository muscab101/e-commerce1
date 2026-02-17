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
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { IconLoader2 } from "@tabler/icons-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // 1. Admin Bypass (Manual check before Firebase)
    if (email === "admin1@gmail.com" && password === "admin123") {
      router.push("/admin/dashboard");
      router.refresh();
      setIsLoading(false);
      return; 
    }

    try {
      // 2. Standard User Authentication via Firebase
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
      router.refresh();
    } catch (error: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
      router.refresh();
    } catch (error: any) {
      setError("An error occurred during Google sign-in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 font-sans", className)} {...props}>
      <form onSubmit={handleLogin}>
        <FieldGroup className="space-y-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
            <FieldDescription className="font-medium text-xs uppercase tracking-wide">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="text-primary font-bold hover:underline">
                Sign up
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
              id="email"
              type="email"
              placeholder="name@example.com"
              className="h-11 rounded-md font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </Field>

          <Field className="space-y-1">
            <FieldLabel htmlFor="password"  className="text-xs font-bold uppercase text-muted-foreground">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="h-11 rounded-md font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </Field>

          <Field>
            <Button type="submit" className="w-full h-11 font-bold uppercase text-xs tracking-widest rounded-md" disabled={isLoading}>
              {isLoading ? <IconLoader2 className="animate-spin size-4 mr-2" /> : "Login"}
            </Button>
          </Field>

          <FieldSeparator className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Or Continue With</FieldSeparator>

          <div className="w-full">
            <Button variant="outline" type="button" className="w-full h-11 font-bold uppercase text-xs tracking-widest rounded-md border-border" onClick={handleGoogleSignIn} disabled={isLoading}>
              <FcGoogle className="size-5 mr-2" />
              Google
            </Button>
          </div>
        </FieldGroup>
      </form>
      
      <FieldDescription className="px-6 text-center text-[10px] font-medium leading-relaxed">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline font-bold hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline font-bold hover:text-primary">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}