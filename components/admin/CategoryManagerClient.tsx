// components/admin/CategoryManagerClient.tsx
'use client';

import { useState } from 'react';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Loader2, 
  Upload, 
  X, 
  Search, 
  FolderTree 
} from 'lucide-react';
import Image from 'next/image';

interface CategoryManagerClientProps {
  initialCategories: Category[];
}

export default function CategoryManagerClient({ initialCategories }: CategoryManagerClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const resetForm = () => {
    setEditId(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || '');
    setImage(category.image || '');
    setIsSheetOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.url) {
        setImage(data.url);
      } else {
        alert(data.error || 'Failed to upload category image');
      }
    } catch (err) {
      console.error('Image upload failure:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const compiledCategory = {
      // Secure a standard UUID format for relational database safety
      id: editId || crypto.randomUUID(),
      name,
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      description: description || undefined,
      image: image || undefined,
    };

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compiledCategory),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update category details');
      }

      // Re-query list from Supabase
      const updatedResponse = await fetch('/api/categories');
      const updatedList = await updatedResponse.json();
      setCategories(updatedList);
      setIsSheetOpen(false);
      resetForm();
    } catch (err: any) {
      alert(err.message || 'Saving failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categorySlug: string) => {
    if (!confirm('Are you sure you want to permanently delete this category?')) return;

    try {
      const response = await fetch(`/api/categories/${categorySlug}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setCategories(categories.filter((c) => c.slug !== categorySlug));
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Delete API trigger failure:', err);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Categories Management</h2>
          <p className="text-gray-400 mt-1">Add, update, or remove your storefront product category tags [1].</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold flex gap-2 self-start">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      <div className="flex items-center border border-gray-800 rounded-md bg-gray-900/30 px-3 max-w-md">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent py-2 text-sm text-white focus:outline-none placeholder-gray-500"
        />
      </div>

      <div className="overflow-x-auto border border-gray-800 rounded-lg bg-gray-900/20">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-black text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-800">
            <tr>
              <th className="p-4">Banner</th>
              <th className="p-4">Category Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredCategories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-900/30">
                <td className="p-4">
                  <div className="relative w-16 h-16 rounded bg-gray-950 overflow-hidden border border-gray-800">
                    <Image
                      src={category.image || 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=100&auto=format&fit=crop&q=80'}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="p-4 font-semibold text-white">{category.name}</td>
                <td className="p-4 text-gray-500">/{category.slug}</td>
                <td className="p-4 text-gray-400 max-w-xs truncate">{category.description || '—'}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button onClick={() => handleOpenEdit(category)} variant="ghost" size="icon" className="hover:bg-gray-800 text-gray-400 hover:text-white">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDeleteCategory(category.slug)} variant="ghost" size="icon" className="hover:bg-red-950/20 text-gray-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Responsive drawer utilizing the unified sticky layout pattern */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent 
          side="right" 
          className="bg-black border-gray-800 text-white flex flex-col h-full p-0 w-full sm:max-w-lg"
        >
          <form onSubmit={handleSaveCategory} className="flex flex-col h-full m-0">
            {/* Sticky Header */}
            <div className="p-6 border-b border-gray-900 bg-black">
              <SheetTitle className="text-yellow-400 flex items-center gap-2">
                <FolderTree className="w-5 h-5" />
                {editId ? 'Edit Category Details' : 'Add New Category'}
              </SheetTitle>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-black/40">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editId) setSlug(e.target.value.trim().toLowerCase().replace(/\s+/g, '-'));
                  }}
                  className="w-full rounded bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
                  placeholder="e.g. Wellness"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Category Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
                  placeholder="e.g. wellness"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none resize-none"
                  placeholder="Provide an overview of items grouped under this tag..."
                />
              </div>

              {/* Dynamic Banner Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 block">Category Banner Image</label>
                <div className="flex items-center gap-4">
                  {image ? (
                    <div className="relative w-20 h-20 rounded border border-gray-800 overflow-hidden bg-gray-950 group flex-shrink-0">
                      <Image src={image} alt="category banner" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-20 h-20 rounded border-2 border-dashed border-gray-800 hover:border-yellow-500/50 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-950 flex-shrink-0">
                      {uploadingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="text-[10px] text-gray-500 mt-1">Upload</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                  )}
                  <div className="text-xs text-gray-500 leading-normal">
                    Upload an optional landscape or square banner representing the catalog line.
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Symmetrical Footer */}
            <div className="p-6 border-t border-gray-900 bg-black flex gap-4">
              <Button type="button" onClick={() => setIsSheetOpen(false)} variant="outline" className="flex-1 border-gray-800 text-gray-300 hover:bg-gray-900">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Category'
                )}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}