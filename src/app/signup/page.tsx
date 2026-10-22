"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setServerError("");

    const validation = signupSchema.safeParse(values);

    if (!validation.success) {
      for (const issue of validation.error.issues) {
        const field = issue.path[0];

        if (
          field === "name" ||
          field === "email" ||
          field === "password" ||
          field === "confirmPassword"
        ) {
          setError(field, { message: issue.message });
        }
      }

      return;
    }

    try {
      const { confirmPassword: _, ...signupData } = validation.data;

      await api.post("/api/auth/signup", signupData);

      toast.success("Account created successfully. Please sign in.");
      router.replace("/login");
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const response = (
          error as {
            response?: {
              data?: { message?: string };
            };
          }
        ).response;

        setServerError(
          response?.data?.message ?? "Signup failed. Please try again.",
        );
      } else {
        setServerError("Unable to connect to the server. Please try again.");
      }
    }
  };

  return (
    <main className='flex min-h-screen items-center justify-center bg-muted/30 p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl'>Create an account</CardTitle>
          <CardDescription>
            Sign up as a student to submit your project for review.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Full name</Label>
              <Input
                id='name'
                autoComplete='name'
                placeholder='Your full name'
                {...register("name")}
              />
              {errors.name && (
                <p className='text-sm text-destructive'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                autoComplete='email'
                placeholder='you@example.com'
                {...register("email")}
              />
              {errors.email && (
                <p className='text-sm text-destructive'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                autoComplete='new-password'
                placeholder='At least 8 characters'
                {...register("password")}
              />
              {errors.password && (
                <p className='text-sm text-destructive'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm password</Label>
              <Input
                id='confirmPassword'
                type='password'
                autoComplete='new-password'
                placeholder='Re-enter your password'
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className='text-sm text-destructive'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {serverError && (
              <p role='alert' className='text-sm text-destructive'>
                {serverError}
              </p>
            )}

            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>

            <p className='text-center text-sm text-muted-foreground'>
              Already have an account?{" "}
              <Link
                href='/login'
                className='font-medium text-primary underline-offset-4 hover:underline'>
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
