'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface AboutSection {
  id: string;
  heading: string;
  content: string;
  image?: string;
  order: number;
}

interface AboutSectionManagerProps {
  sections: AboutSection[];
  onSectionsChange: (sections: AboutSection[]) => void;
  onImageUpload: (sectionId: string, file: File) => Promise<string>;
}

export default function AboutSectionManager({ sections, onSectionsChange, onImageUpload }: AboutSectionManagerProps) {
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());

  const addSection = () => {
    const newSection: AboutSection = {
      id: `section-${Date.now()}`,
      heading: '',
      content: '',
      order: sections.length,
    };
    onSectionsChange([...sections, newSection]);
  };

  const updateSection = (id: string, updates: Partial<AboutSection>) => {
    const updatedSections = sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    );
    onSectionsChange(updatedSections);
  };

  const removeSection = (id: string) => {
    const filteredSections = sections.filter(section => section.id !== id);
    // Reorder sections
    const reorderedSections = filteredSections.map((section, index) => ({
      ...section,
      order: index,
    }));
    onSectionsChange(reorderedSections);
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(section => section.id === id);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap sections
    [newSections[currentIndex], newSections[targetIndex]] = 
    [newSections[targetIndex], newSections[currentIndex]];
    
    // Update order
    newSections.forEach((section, index) => {
      section.order = index;
    });

    onSectionsChange(newSections);
  };

  const handleImageUpload = async (sectionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB.');
      return;
    }

    setUploadingImages(prev => new Set(prev).add(sectionId));

    try {
      const imageUrl = await onImageUpload(sectionId, file);
      updateSection(sectionId, { image: imageUrl });
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(sectionId);
        return newSet;
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">About Sections</h2>
        <Button onClick={addSection} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Section
        </Button>
      </div>

      {sections.length === 0 && (
        <Alert>
          <AlertDescription>
            No sections yet. Click "Add Section" to create your first about section.
          </AlertDescription>
        </Alert>
      )}

      {sections.map((section, index) => (
        <Card key={section.id} className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Section {index + 1}</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveSection(section.id, 'up')}
                disabled={index === 0}
              >
                ↑
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveSection(section.id, 'down')}
                disabled={index === sections.length - 1}
              >
                ↓
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeSection(section.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Section Heading */}
            <div>
              <Label htmlFor={`heading-${section.id}`}>Heading</Label>
              <Input
                id={`heading-${section.id}`}
                value={section.heading}
                onChange={(e) => updateSection(section.id, { heading: e.target.value })}
                placeholder="Enter section heading..."
                className="mt-1"
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor={`image-${section.id}`}>Section Image (Optional)</Label>
              <div className="mt-1 space-y-2">
                <input
                  id={`image-${section.id}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(section.id, e)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById(`image-${section.id}`)?.click()}
                  disabled={uploadingImages.has(section.id)}
                  className="flex items-center gap-2"
                >
                  {uploadingImages.has(section.id) ? (
                    <>Uploading...</>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </Button>
                {section.image && (
                  <div className="mt-2">
                    <img
                      src={section.image}
                      alt={section.heading}
                      className="max-w-xs h-auto rounded border"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Rich Text Content */}
            <div>
              <Label htmlFor={`content-${section.id}`}>Content</Label>
              <div className="mt-1">
                <RichTextEditor
                  content={section.content}
                  onChange={(content) => updateSection(section.id, { content })}
                  placeholder="Enter section content..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
