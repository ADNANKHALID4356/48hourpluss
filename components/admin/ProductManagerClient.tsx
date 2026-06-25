// components/admin/ProductManagerClient.tsx
'use client';

import { useState } from 'react';
import { Product, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Loader2, 
  Upload, 
  X, 
  Search, 
  AlertTriangle 
} from 'lucide-react';
import Image from 'next/image';

interface ProductManagerClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductManagerClient({ initialProducts, categories }: ProductManagerClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState(10);
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>(['']);

  const resetForm = () => {
    setEditId(null);
    setName('');
    setSlug('');
    setPrice('');
    setCategorySlug(categories[0]?.slug || '');
    setDescription('');
    setStock(10);
    setIsActive(true);
    setImages([]);
    setIngredients(['']);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditId(product.id);
    setName(product.name);
    setSlug(product.slug);
    setPrice(product.price);
    setCategorySlug(product.categorySlug);
    setDescription(product.description);
    setStock(product.stock);
    setIsActive(product.isActive);
    setImages(product.images);
    setIngredients(product.ingredients.length > 0 ? product.ingredients : ['']);
    setIsSheetOpen(true);
  };

  const handleAddIngredientField = () => setIngredients([...ingredients, '']);
  const handleRemoveIngredientField = (index: number) => {
    setIngredients(ingredients.filter((_, idx) => idx !== index));
  };
  const handleIngredientChange = (value: string, index: number) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
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
        setImages([...images, data.url]);
      } else {
        alert(data.error || 'Failed to upload image asset');
      }
    } catch (err) {
      console.error('Asset upload failure:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const compiledProduct = {
      // Use crypto.randomUUID() to satisfy the strict Supabase PostgreSQL UUID format constraint!
      id: editId || crypto.randomUUID(),
      name,
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      price,
      categorySlug,
      description,
      stock,
      isActive,
      images,
      ingredients: ingredients.filter((ing) => ing.trim() !== ''),
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compiledProduct),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product details');
      }

      // Re-query list from Supabase
      const updatedResponse = await fetch('/api/products?inactive=true');
      const updatedList = await updatedResponse.json();
      setProducts(updatedList);
      setIsSheetOpen(false);
      resetForm();
    } catch (err: any) {
      alert(err.message || 'Saving failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productSlug: string) => {
    if (!confirm('Are you sure you want to permanently delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${productSlug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.slug !== productSlug));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Delete API trigger failure:', err);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Product Inventory</h2>
          <p className="text-gray-400 mt-1">Manage catalog listings, stocking thresholds, and specifications [1].</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold flex gap-2 self-start">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <div className="flex items-center border border-gray-800 rounded-md bg-gray-900/30 px-3 max-w-md">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent py-2 text-sm text-white focus:outline-none placeholder-gray-500"
        />
      </div>

      <div className="overflow-x-auto border border-gray-800 rounded-lg bg-gray-900/20">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-black text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-800">
            <tr>
              <th className="p-4">Thumbnail</th>
              <th className="p-4">Product Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Category</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-900/30">
                <td className="p-4">
                  <div className="relative w-12 h-12 rounded bg-gray-950 overflow-hidden border border-gray-800">
                    <Image
                      src={p.images[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&auto=format&fit=crop&q=80'}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-white">{p.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">/{p.slug}</div>
                </td>
                <td className="p-4 text-yellow-400 font-bold">{p.price}</td>
                <td className="p-4 uppercase tracking-wider text-xs font-medium text-gray-400">{p.categorySlug}</td>
                <td className="p-4">
                  {p.stock < 10 ? (
                    <div className="flex items-center gap-1.5 text-red-400 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {p.stock} units
                    </div>
                  ) : (
                    <span>{p.stock} units</span>
                  )}
                </td>
                <td className="p-4">
                  {p.isActive ? (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</Badge>
                  ) : (
                    <Badge className="bg-gray-800 text-gray-500 border border-gray-700">Draft</Badge>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button onClick={() => handleOpenEdit(p)} variant="ghost" size="icon" className="hover:bg-gray-800 text-gray-400 hover:text-white">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDeleteProduct(p.slug)} variant="ghost" size="icon" className="hover:bg-red-500/10 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 
         RESTYLED RESPONSIVE DRAWER SHEET:
         Presents a Locked Sticky Header, Scrollable input container, and Pinned Bottom Sticky Footer.
         Guarantees zero overflow or cutoff across all desktop, tablet, and mobile device screen sizes.
      */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent 
          side="right" 
          className="bg-black border-gray-800 text-white flex flex-col h-full p-0 w-full sm:max-w-lg md:max-w-xl"
        >
          {/* OPEN THE FORM CONTAINER HERE SO IT ENCLOSES THE STICKY BLOCKS */}
          <form onSubmit={handleSaveProduct} className="flex flex-col h-full m-0">
            {/* 1. FIXED STICKY HEADER */}
            <div className="p-6 border-b border-gray-900 bg-black">
              <SheetTitle className="text-yellow-400">
                {editId ? 'Edit Product Details' : 'Add New Inventory Product'}
              </SheetTitle>
            </div>

            {/* 2. ISOLATED SCROLLABLE BODY CONTAINER */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-black/40">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editId) setSlug(e.target.value.trim().toLowerCase().replace(/\s+/g, '-'));
                  }}
                  className="w-full rounded bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
                  placeholder="e.g. Organic Matcha Powder"
                />
              </div>

              {/* Product URL Slug */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
                  placeholder="e.g. organic-matcha-powder"
                />
              </div>

              {/* Price and Stock row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400">Price Display</label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
                    placeholder="e.g. $19.99 or Rs. 1,500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400">Inventory Stock Volume</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value))}
                    className="w-full rounded bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Category</label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full rounded bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Full Description</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none resize-none"
                  placeholder="Describe your premium formula parameters..."
                />
              </div>

              {/* Dynamic Image assets upload managers */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 block">Product Gallery Images</label>
                <div className="grid grid-cols-4 gap-3">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded border border-gray-800 overflow-hidden bg-gray-950 group">
                      <Image src={url} alt="product" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}

                  {/* Upload button wrapper */}
                  <label className="aspect-square rounded border-2 border-dashed border-gray-800 hover:border-yellow-500/50 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-950">
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
                </div>
              </div>

              {/* Dynamic Ingredients list manager */}
              <div className="space-y-2 border-t border-gray-900 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-400">Ingredients Breakdown</label>
                  <Button type="button" onClick={handleAddIngredientField} variant="ghost" className="text-yellow-400 hover:text-yellow-300 text-xs flex gap-1 h-auto py-1">
                    <Plus className="w-3.5 h-3.5" />
                    Add Ingredient
                  </Button>
                </div>

                <div className="space-y-2">
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={ing}
                        onChange={(e) => handleIngredientChange(e.target.value, idx)}
                        className="w-full rounded bg-gray-900 border border-gray-800 px-3 py-1.5 text-sm focus:border-yellow-500 focus:outline-none"
                        placeholder="e.g. Organic Matcha Powder"
                      />
                      {ingredients.length > 1 && (
                        <Button type="button" onClick={() => handleRemoveIngredientField(idx)} variant="ghost" size="icon" className="hover:bg-red-500/10 text-gray-500 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Toggle Switch */}
              <div className="flex items-center justify-between border-t border-gray-900 pt-4">
                <div>
                  <div className="text-sm font-semibold text-white">Active Product Visibility</div>
                  <div className="text-xs text-gray-500">Draft products remain hidden from the storefront catalog page.</div>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-10 h-6 rounded-full bg-gray-800 border-gray-700 checked:bg-yellow-500 cursor-pointer accent-yellow-500"
                />
              </div>
            </div>

            {/* 3. FIXED STICKY FOOTER */}
// components/admin/ProductManagerClient.tsx (Update the sticky footer block at the bottom)

          {/* 3. FIXED STICKY FOOTER */}
          <div className="p-6 border-t border-gray-900 bg-black flex gap-4">
            <Button 
              type="button" 
              onClick={() => setIsSheetOpen(false)} 
              variant="outline" 
              className="flex-1 border-gray-800 text-gray-300 hover:bg-gray-900" // <-- Swapped 'w-full' with 'flex-1'
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold flex items-center justify-center gap-2" // <-- Swapped 'w-full' with 'flex-1'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Product'
              )}
            </Button>
          </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}