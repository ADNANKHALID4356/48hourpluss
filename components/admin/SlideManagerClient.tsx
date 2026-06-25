// components/admin/SlideManagerClient.tsx
'use client';

import { useState } from 'react';
import { HeroSlide } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Loader2, 
  Upload, 
  X, 
  Search, 
  Sliders 
} from 'lucide-react';
import Image from 'next/image';

interface SlideManagerClientProps {
  initialSlides: HeroSlide[];
}

export default function SlideManagerClient({ initialSlides }: SlideManagerClientProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setSubtitle('');
    setImageUrl('');
    setLinkUrl('');
    setOrder(0);
    setIsActive(true);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setEditId(slide.id);
    setTitle(slide.title);
    setSubtitle(slide.subtitle || '');
    setImageUrl(slide.imageUrl);
    setLinkUrl(slide.linkUrl || '');
    setOrder(slide.order);
    setIsActive(slide.isActive);
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
        setImageUrl(data.url);
      } else {
        alert(data.error || 'Failed to upload banner image');
      }
    } catch (err) {
      console.error('Banner upload failure:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const compiledSlide = {
      id: editId, // Keep null if creating to let API generate UUID
      title,
      subtitle: subtitle || undefined,
      imageUrl,
      linkUrl: linkUrl || undefined,
      order: Number(order),
      isActive,
    };

    try {
      const response = await fetch('/api/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compiledSlide),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save slide specifications');
      }

      // Re-query active list
      const updatedResponse = await fetch('/api/hero-slides');
      const updatedList = await updatedResponse.json();
      setSlides(updatedList);
      setIsSheetOpen(false);
      resetForm();
    } catch (err: any) {
      alert(err.message || 'Saving failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this banner slide?')) return;

    try {
      const response = await fetch(`/api/hero-slides/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSlides(slides.filter((s) => s.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete slide');
      }
    } catch (err) {
      console.error('Delete API trigger failure:', err);
    }
  };

  const filteredSlides = slides.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Hero Slides Manager</h2>
          <p className="text-gray-400 mt-1">Manage, sort, and update your main storefront banner carousels [1].</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold flex gap-2 self-start">
          <Plus className="w-4 h-4" />
          Add Slide
        </Button>
      </div>

      <div className="flex items-center border border-gray-800 rounded-md bg-gray-900/30 px-3 max-w-md">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search slides..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent py-2 text-sm text-white focus:outline-none placeholder-gray-500"
        />
      </div>

      {/* Main slides table grid */}
      <div className="overflow-x-auto border border-gray-800 rounded-lg bg-gray-900/20">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-black text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-800">
            <tr>
              <th className="p-4">Banner Preview</th>
              <th className="p-4">Title</th>
              <th className="p-4">Order</th>
              <th className="p-4">Link URL Target</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredSlides.map((slide) => (
              <tr key={slide.id} className="hover:bg-gray-900/30">
                <td className="p-4">
                  <div className="relative w-28 h-16 rounded bg-gray-950 overflow-hidden border border-gray-800">
                    <Image
                      src={slide.imageUrl || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&auto=format&fit=crop&q=80'}
                      alt={slide.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="p-4 font-semibold text-white max-w-xs truncate">{slide.title}</td>
                <td className="p-4 font-mono text-yellow-400">{slide.order}</td>
                <td className="p-4 text-gray-500 text-xs truncate max-w-xs">{slide.linkUrl || '—'}</td>
                <td className="p-4">
                  {slide.isActive ? (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</Badge>
                  ) : (
                    <Badge className="bg-gray-800 text-gray-500 border border-gray-700">Draft</Badge>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button onClick={() => handleOpenEdit(slide)} variant="ghost" size="icon" className="hover:bg-gray-800 text-gray-400 hover:text-white">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDeleteSlide(slide.id)} variant="ghost" size="icon" className="hover:bg-red-950/20 text-gray-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide Entry Form Panel Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent 
          side="right" 
          className="bg-black border-gray-800 text-white flex flex-col h-full p-0 w-full sm:max-w-lg"
        >
          <form onSubmit={handleSaveSlide} className="flex flex-col h-full m-0">
            {/* Header */}
            <div className="p-6 border-b border-gray-900 bg-black">
              <SheetTitle className="text-yellow-400 flex items-center gap-2">
                <Sliders className="w-5 h-5" />
                {editId ? 'Edit Slide Details' : 'Add New Banner Slide'}
              </SheetTitle>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-black/40">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Slide Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
                  placeholder="e.g. Premium Clinical Formulations"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Slide Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full rounded bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none resize-none"
                  placeholder="e.g. Discover organic Matcha and medical-grade Hyaluronic serums..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400">Explore Link Target URL</label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full rounded bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
                    placeholder="e.g. /products/hydrating-hyaluronic-serum"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400">Display Order Index</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                    className="w-full rounded bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Banner Image Upload */}
              <div className="space-y-2 border-t border-gray-900 pt-4">
                <label className="text-xs font-semibold text-gray-400 block">Banner Background Image</label>
                <div className="flex flex-col gap-4">
                  {imageUrl ? (
                    <div className="relative w-full aspect-video rounded border border-gray-800 overflow-hidden bg-gray-950 group max-w-sm">
                      <Image src={imageUrl} alt="slide banner" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-full aspect-video rounded border-2 border-dashed border-gray-800 hover:border-yellow-500/50 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-950 max-w-sm">
                      {uploadingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500 mt-1">Upload Landscape Banner</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                  )}
                  <div className="text-xs text-gray-500 leading-normal">
                    Upload a high-resolution landscape banner image. For optimal presentation, use a 16:9 aspect ratio or a resolution of 1920x1080 pixels.
                  </div>
                </div>
              </div>

              {/* Active Toggle Switch */}
              <div className="flex items-center justify-between border-t border-gray-900 pt-4">
                <div>
                  <div className="text-sm font-semibold text-white">Active Banner Visibility</div>
                  <div className="text-xs text-gray-500">Draft slides remain hidden from the storefront home page carousel.</div>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-10 h-6 rounded-full bg-gray-800 border-gray-700 checked:bg-yellow-500 cursor-pointer accent-yellow-500"
                />
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
                  'Save Slide'
                )}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}