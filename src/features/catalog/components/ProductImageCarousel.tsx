import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ProductImage } from "./ProductImage";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ProductImageCarousel({ imageFileIds, alt }: { imageFileIds?: string[], alt: string }) {
  const { t: translate } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  
  // Instancias de Embla para la imagen principal y las miniaturas
  const [mainRef, mainApi] = useEmblaCarousel({ loop: false });
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi || !thumbApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi, thumbApi]
  );

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    setSelectedIndex(mainApi.selectedScrollSnap());
    thumbApi.scrollTo(mainApi.selectedScrollSnap());
  }, [mainApi, thumbApi, setSelectedIndex]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
  }, [mainApi, onSelect]);

  const handlePrev = useCallback(() => {
    if (mainApi) mainApi.scrollPrev();
  }, [mainApi]);

  const handleNext = useCallback(() => {
    if (mainApi) mainApi.scrollNext();
  }, [mainApi]);

  // Manejo de eventos de teclado (Escape, Flechas) cuando el modal de zoom está abierto
  useEffect(() => {
    if (!isZoomOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomOpen(false);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomOpen, handlePrev, handleNext]);

  if (!imageFileIds || imageFileIds.length === 0) {
    return (
      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100/80 flex items-center justify-center">
        <ProductImage imageFileIds={[]} alt={alt} iconSize={80} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Viewport Principal */}
      <div className="overflow-hidden w-full aspect-square rounded-2xl bg-slate-50 border border-slate-100/80 relative group" ref={mainRef}>
        <div className="flex w-full h-full touch-pan-y">
          {imageFileIds.map((id, index) => (
            <div className="flex-[0_0_100%] min-w-0 h-full flex items-center justify-center relative select-none" key={id}>
              <ProductImage imageFileIds={[id]} alt={`${alt} ${index}`} iconSize={80} />
            </div>
          ))}
        </div>

        {/* Botón de Lupa / Zoom (visible al hacer hover sobre la imagen) */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-4 right-4 p-3 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-md border border-slate-100/50 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer z-10 flex items-center justify-center hover:shadow-lg md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
          title={translate("catalog.zoomImage")}
        >
          <ZoomIn size={20} className="stroke-[2.5]" />
        </button>
      </div>

      {/* Viewport de Miniaturas */}
      {imageFileIds.length > 1 && (
        <div className="overflow-hidden" ref={thumbRef}>
          <div className="flex gap-3">
            {imageFileIds.map((id, index) => (
              <button
                key={id}
                onClick={() => onThumbClick(index)}
                type="button"
                className={`flex-[0_0_80px] min-w-0 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  index === selectedIndex
                    ? "border-(--color-brand-accent) opacity-100 ring-2 ring-(--color-brand-accent)/20"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <ProductImage imageFileIds={[id]} alt={`thumb-${index}`} iconSize={24} showFallbackText={false} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 animate-fade-in">
          {/* Backdrop click to close */}
          <div className="absolute inset-0 cursor-default" onClick={() => setIsZoomOpen(false)} />

          {/* Modal Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100/80 max-w-3xl w-full flex flex-col items-center justify-center p-6 md:p-8 max-h-[90vh] overflow-hidden z-10 transform scale-100 transition-transform duration-300">
            {/* Botón Cerrar */}
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all duration-200 cursor-pointer"
              title={translate("catalog.close")}
            >
              <X size={20} />
            </button>

            {/* Contenedor Imagen Principal y Flechas de Navegación */}
            <div className="relative w-full flex items-center justify-center flex-1 mt-4">
              {/* Flecha Izquierda */}
              {imageFileIds.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={!mainApi?.canScrollPrev()}
                  className="absolute left-0 p-3 rounded-full bg-slate-100/80 hover:bg-slate-200/90 text-slate-700 hover:text-slate-900 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-20 disabled:pointer-events-none cursor-pointer z-10 flex items-center justify-center shadow-sm border border-slate-200/30"
                  title={translate("catalog.previous")}
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Contenedor Imagen Grande */}
              <div className="w-full h-[55vh] flex items-center justify-center select-none px-12">
                <ProductImage 
                  imageFileIds={[imageFileIds[selectedIndex]]} 
                  alt={`${alt} zoom`} 
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-sm transition-transform duration-300"
                  iconSize={100}
                />
              </div>

              {/* Flecha Derecha */}
              {imageFileIds.length > 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!mainApi?.canScrollNext()}
                  className="absolute right-0 p-3 rounded-full bg-slate-100/80 hover:bg-slate-200/90 text-slate-700 hover:text-slate-900 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-20 disabled:pointer-events-none cursor-pointer z-10 flex items-center justify-center shadow-sm border border-slate-200/30"
                  title={translate("catalog.next")}
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* Indicador de Posición */}
            {imageFileIds.length > 1 && (
              <span className="text-slate-500 text-xs mt-6 select-none font-semibold bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                {selectedIndex + 1} / {imageFileIds.length}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
