import React, { useRef, useState } from 'react';
import { resolveImageUrl } from '../../../utils/imageUrl';
import { deletePropertyImage, type PropertyImageRow } from '../property.service';

interface PropertyImageUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  existingImages?: PropertyImageRow[];
  onExistingImagesChange?: (images: PropertyImageRow[]) => void;
  propertyId?: number;
  min?: number;
  max?: number;
}

const PropertyImageUploader: React.FC<PropertyImageUploaderProps> = ({
  files,
  onFilesChange,
  existingImages = [],
  onExistingImagesChange,
  propertyId,
  min = 3,
  max = 7,
}) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalCount = existingImages.length + files.length;
  const remainingSlots = Math.max(0, max - totalCount);

  const addFiles = (incoming: FileList | File[]) => {
    const incomingArray = Array.from(incoming).filter((f) => f.type.startsWith('image/'));
    const accepted = incomingArray.slice(0, remainingSlots);
    if (accepted.length === 0) return;
    onFilesChange([...files, ...accepted]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const handleReorderDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const reordered = [...files];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    onFilesChange(reordered);
    setDragIndex(null);
  };

  const handleDeleteExisting = async (image: PropertyImageRow) => {
    if (!propertyId) return;
    if (existingImages.length + files.length <= min) {
      window.alert(`يجب أن يحتوي العقار على ${min} صور على الأقل — أضف صورة بديلة قبل الحذف.`);
      return;
    }
    setDeletingId(image.id);
    try {
      const result = await deletePropertyImage(propertyId, image.id);
      onExistingImagesChange?.(result.images);
    } catch (error) {
      console.error('Error deleting property image:', error);
      window.alert('حدث خطأ أثناء حذف الصورة.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-colors ${
          isDraggingOver ? 'border-primary bg-primary/5' : 'border-slate-300 hover:bg-slate-50'
        }`}
      >
        <span className="material-symbols-outlined text-3xl text-slate-400">cloud_upload</span>
        <p className="text-sm font-semibold text-slate-600">اسحب الصور هنا أو اضغط للاختيار</p>
        <p className="text-xs text-slate-400">
          {totalCount}/{max} صور — الحد الأدنى {min} صور ({remainingSlots > 0 ? `يمكنك إضافة ${remainingSlots} أخرى` : 'اكتمل الحد الأقصى'})
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {(existingImages.length > 0 || files.length > 0) && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {existingImages.map((image) => (
            <div key={`existing-${image.id}`} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200">
              <img src={resolveImageUrl(image.image_url)} alt="صورة العقار" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => handleDeleteExisting(image)}
                disabled={deletingId === image.id}
                className="absolute top-1.5 left-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100"
              >
                <span className="material-symbols-outlined text-base">
                  {deletingId === image.id ? 'hourglass_empty' : 'close'}
                </span>
              </button>
            </div>
          ))}

          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleReorderDrop(index)}
              className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 cursor-move"
            >
              <img src={URL.createObjectURL(file)} alt={`صورة جديدة ${index + 1}`} className="h-full w-full object-cover" />
              {index === 0 && existingImages.length === 0 && (
                <span className="absolute bottom-1 right-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                  الصورة الرئيسية
                </span>
              )}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1.5 left-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyImageUploader;
