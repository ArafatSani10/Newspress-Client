"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { newsService } from '@/services/news.service';
import { categoryService, Category } from '@/services/category.service';

export default function PostNews() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      const res = await categoryService.getAll();
      if (!res.error) setCategories(res.data);
    };
    fetchCats();
  }, []);

  const handleImageUpload = async (file: File, field: any) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        field.handleChange(data.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed!");
      }
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const form = useForm({
    defaultValues: {
      title: '' as string,
      content: '' as string,
      summary: '' as string,
      featuredImage: '' as string,
      imageCaption: '' as string,
      videoUrl: '' as string,
      categoryId: '' as string,
      status: 'PUBLISHED' as string,
      isFeatured: false as boolean,
      isBreaking: false as boolean,
    },
    validators: {
      onChange: ({ value }) => {
        if (!value.title || value.title.length < 5) return 'Title too short';
        if (!value.content || value.content.length < 20) return 'Content too short';
        if (!value.categoryId) return 'Category is required';
        if (!value.featuredImage) return 'Image is required';
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      const res = await newsService.create(value);
      if (res.success) {
        toast.success(res.message);
        form.reset();
      } else {
        toast.error(res.message);
      }
    },
  });

  return (
    <div className="max-w-full mx-auto p-6 bg-white shadow-xl rounded-sm mt-5 border border-gray-100">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 border-b pb-4">Create New Post</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <form.Field name="title">
          {(field) => (
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={`w-full p-3 border rounded-sm outline-none transition-all ${field.state.meta.errors.length ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'}`}
                placeholder="Enter a catchy title..."
              />
            </div>
          )}
        </form.Field>

        <form.Field name="categoryId">
          {(field) => (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={`w-full p-3 border rounded-sm outline-none transition-all cursor-pointer ${field.state.meta.errors.length ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'}`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}
        </form.Field>

        <form.Field name="status">
          {(field) => (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          )}
        </form.Field>

        <form.Field name="featuredImage">
          {(field) => (
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Featured Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, field);
                }}
                className={`w-full p-2 border rounded-sm outline-none ${field.state.meta.errors.length ? 'border-red-500' : 'border-gray-300'}`}
              />
              {field.state.value && (
                <img src={field.state.value} alt="Preview" className="mt-2 h-20 w-32 object-cover rounded-sm border" />
              )}
              {isUploading && <p className="text-xs text-blue-500 mt-1">Uploading to ImgBB...</p>}
            </div>
          )}
        </form.Field>

        <form.Field name="imageCaption">
          {(field) => (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Image Caption <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Describe the image..."
              />
            </div>
          )}
        </form.Field>

        <form.Field name="videoUrl">
          {(field) => (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Video URL <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="YouTube link..."
              />
            </div>
          )}
        </form.Field>

        <form.Field name="summary">
          {(field) => (
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Summary <span className="text-gray-400 font-normal">(Optional)</span></label>
              <textarea
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none h-20"
                placeholder="Brief overview..."
              />
            </div>
          )}
        </form.Field>

        <form.Field name="content">
          {(field) => (
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Content</label>
              <textarea
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={`w-full p-3 border rounded-sm outline-none h-48 ${field.state.meta.errors.length ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'}`}
                placeholder="Write the main news body..."
              />
            </div>
          )}
        </form.Field>

        <div className="flex flex-wrap gap-8 md:col-span-2 py-4 bg-gray-50 p-4 rounded-sm border border-dashed border-gray-200">
          <form.Field name="isFeatured">
            {(field) => (
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name={field.name}
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded-sm border-gray-300 focus:ring-indigo-500"
                />
                <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600">Mark as Featured</span>
              </label>
            )}
          </form.Field>

          <form.Field name="isBreaking">
            {(field) => (
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name={field.name}
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="w-5 h-5 text-red-600 rounded-sm border-gray-300 focus:ring-red-500"
                />
                <span className="text-sm font-bold text-gray-700 group-hover:text-red-600">Breaking News</span>
              </label>
            )}
          </form.Field>
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={!canSubmit || (isSubmitting as boolean) || isUploading}
                className="w-full py-4 bg-indigo-600 text-white rounded-sm font-bold text-lg hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-100"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}