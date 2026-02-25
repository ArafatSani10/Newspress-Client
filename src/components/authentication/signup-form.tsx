"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userService } from "@/services/user.service";
import { useForm } from "@tanstack/react-form";
import { AlertCircle, Loader2, UploadCloud } from "lucide-react";
import Image from "next/image"
import Link from "next/link";
import { useRouter } from "next/navigation"
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profileImage: z.instanceof(File).optional().nullable(),
})

type SignupValues = z.infer<typeof signupSchema>

export function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const router = useRouter()

  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("image", file)
    const apiKey = "fef551d0252d6e6b41362bdb5b2b0f99"
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    })
    if (!response.ok) throw new Error("Image upload failed")
    const data = await response.json()
    return data.data.url
  }

  const defaultValues: SignupValues = {
    name: "",
    email: "",
    password: "",
    profileImage: null,
  };

  const form = useForm({
    defaultValues,
    validators: {
      onChange: signupSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      const toastId = toast.loading("Creating account...");

      try {
        let imageUrl = "";
        if (value.profileImage) {
          imageUrl = await uploadToImgBB(value.profileImage);
        }

        const res = await userService.register({
          name: value.name,
          email: value.email,
          password: value.password,
          image: imageUrl || undefined,
        });

        if (res.error) {
          toast.error(res.error.message, { id: toastId });
          setIsSubmitting(false);
        } else {
          toast.success("Account created! Redirecting...", { id: toastId });

          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to register", { id: toastId });
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Card className="max-w-md mx-auto border-zinc-200 shadow-xl dark:border-zinc-800">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Join us today! Please fill in the details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-5"
        >
          <form.Field name="name">
            {(field: any) => (
              <div className="space-y-1.5">
                <Label className={field.state.meta.errors.length ? "text-red-500" : ""}>Full Name</Label>
                <Input
                  placeholder="John Doe"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={field.state.meta.errors.length ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          </form.Field>

          <form.Field name="email">
            {(field: any) => (
              <div className="space-y-1.5">
                <Label className={field.state.meta.errors.length ? "text-red-500" : ""}>Email</Label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={field.state.meta.errors.length ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          </form.Field>

          <form.Field name="password">
            {(field: any) => (
              <div className="space-y-1.5">
                <Label className={field.state.meta.errors.length ? "text-red-500" : ""}>Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={field.state.meta.errors.length ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          </form.Field>

          <form.Field name="profileImage">
            {(field: any) => (
              <div className="space-y-2">
                <Label className={field.state.meta.errors.length ? "text-red-500" : ""}>Profile Picture (Optional)</Label>
                <div className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${field.state.meta.errors.length ? "border-red-500 bg-red-50/10" : "border-dashed border-zinc-200"}`}>
                  <div className="relative size-14 shrink-0 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                    {previewUrl ? (
                      <Image src={previewUrl} alt="Avatar" fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-400">
                        <UploadCloud size={20} />
                      </div>
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    className="cursor-pointer h-9 text-[12px]"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      field.handleChange(file)
                      if (file) setPreviewUrl(URL.createObjectURL(file))
                    }}
                  />
                </div>
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          </form.Field>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizing Account...</>
            ) : (
              "Sign Up"
            )}
          </Button>

          <div className="text-center text-sm text-zinc-500">
            Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function FieldError({ errors }: { errors: any[] }) {
  if (!errors || errors.length === 0) return null
  return (
    <div className="flex items-center gap-1.5 text-red-500 mt-1">
      <AlertCircle size={12} />
      <p className="text-[12px] font-medium">
        {errors.map((err) => (typeof err === 'object' ? err.message : err)).join(", ")}
      </p>
    </div>
  )
}