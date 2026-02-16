"use client"

import React, { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2, AlertCircle } from "lucide-react"
import { userService } from "@/services/user.service"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<LoginValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      const toastId = toast.loading("Verifying credentials...")

      try {
        const res = await userService.login({
          email: value.email,
          password: value.password,
        })

        if (res.error) {
          toast.error(res.error.message || "Login failed", { id: toastId })
          setIsSubmitting(false)
        } else {
          toast.success("Login successful! Welcome back.", { id: toastId })
          router.push("/")
          router.refresh()
        }
      } catch (err: any) {
        toast.error("An unexpected error occurred", { id: toastId })
        setIsSubmitting(false)
      }
    },
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <FieldGroup className="space-y-4">
              <form.Field name="email">
                {(field: any) => (
                  <Field className="space-y-1.5">
                    <FieldLabel className={field.state.meta.errors.length ? "text-red-500" : ""}>Email</FieldLabel>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={field.state.meta.errors.length ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="password">
                {(field: any) => (
                  <Field className="space-y-1.5">
                    <div className="flex items-center">
                      <FieldLabel className={field.state.meta.errors.length ? "text-red-500" : ""}>Password</FieldLabel>
                      <Link
                        href="/forgot-password"
                        className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={field.state.meta.errors.length ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <div className="flex flex-col gap-3 pt-2">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</>
                  ) : (
                    "Login"
                  )}
                </Button>
                <Button variant="outline" type="button" className="w-full" onClick={() => toast.info("Google login coming soon!")}>
                  Login with Google
                </Button>
              </div>

              <FieldDescription className="text-center mt-4">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function FieldError({ errors }: { errors: any[] }) {
  if (!errors || errors.length === 0) return null
  return (
    <div className="flex items-center gap-1.5 text-red-500 mt-1">
      <AlertCircle size={12} />
      <p className="text-[12px] font-medium">
        {errors.map((err) => (typeof err === "object" ? err.message : err)).join(", ")}
      </p>
    </div>
  )
}