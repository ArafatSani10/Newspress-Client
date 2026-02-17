"use client";

import React from "react";
import { useForm } from "@tanstack/react-form";
import { categoryService } from "@/services/category.service";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

export default function PostCategory() {
    const form = useForm({
        defaultValues: {
            name: "",
        },
        onSubmit: async ({ value }) => {
            const res = await categoryService.create(value.name);

            if (res.success) {
                toast.success(res.message || "Category created successfully!");
                form.reset();
            } else {
                toast.error(res.message);
            }
        },
    });

    return (
        <div className="max-w-md bg-white p-6 rounded-md border border-zinc-100 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-zinc-800">Add New Category</h3>
                <p className="text-xs text-zinc-500 mt-1">Create a unique category for your news press.</p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-4"
            >
                <form.Field
                    name="name"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? "Category name is required" : value.length < 3 ? "Minimum 3 characters" : undefined,
                    }}
                >
                    {(field) => (
                        <div className="space-y-1.5">
                            <label htmlFor={field.name} className="text-xs font-bold text-zinc-700">
                                Category Name
                            </label>
                            <input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="e.g. Technology"
                                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                            {field.state.meta.errors.length > 0 && (
                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">
                                    {field.state.meta.errors[0]?.toString()}
                                </p>
                            )}
                        </div>
                    )}
                </form.Field>

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                    {([canSubmit, isSubmitting]) => (
                        <button
                            type="submit"
                            disabled={!canSubmit || isSubmitting}
                            className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-2.5 rounded-md text-sm font-bold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <>
                                    <Plus className="size-4" /> Create Category
                                </>
                            )}
                        </button>
                    )}
                </form.Subscribe>
            </form>
        </div>
    );
}