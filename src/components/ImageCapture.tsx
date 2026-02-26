import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageCaptureProps {
  onImageSelected: (file: File) => void;
  currentPreview?: string | null;
  onClear?: () => void;
  label?: string;
}

export function ImageCapture({ onImageSelected, currentPreview, onClear, label = "Capture Photo" }: ImageCaptureProps) {
  const [preview, setPreview] = useState<string | null>(currentPreview || null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    onImageSelected(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    setPreview(null);
    onClear?.();
    if (cameraRef.current) cameraRef.current.value = "";
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-border/60">
          <img src={preview} alt="Captured" className="w-full h-48 object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-lg"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl h-11"
            onClick={() => cameraRef.current?.click()}
          >
            <Camera className="h-4 w-4 mr-2" />
            {label}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl h-11"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      )}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
