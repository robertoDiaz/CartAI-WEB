import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ProductImageProps } from "./models";

export function ProductImage({ 
  imageFileIds, 
  alt, 
  className = "w-full h-full object-cover", 
  iconSize = 48,
  showFallbackText = true 
}: ProductImageProps) {
  const { t: translate } = useTranslation();
  const [imageFailed, setImageFailed] = useState(false);

  const hasImage = imageFileIds && imageFileIds.length > 0 && !imageFailed;

  if (hasImage) {
    return (
      <img
        src={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/storage/files/${imageFileIds[0]}`}
        alt={alt}
        className={className}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 text-slate-300 w-full h-full bg-slate-50">
      <ShoppingBag size={iconSize} className="stroke-1" />
      {showFallbackText && (
        <span className="text-xs font-semibold text-slate-400">
          {translate("catalog.noImage", "Sin imagen")}
        </span>
      )}
    </div>
  );
}
