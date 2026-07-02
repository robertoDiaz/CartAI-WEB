import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductImageCarousel } from "../../../features/catalog/components/ProductImageCarousel";

// Mock de i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

// Mock de useEmblaCarousel
vi.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: () => {
    const mainApi = {
      selectedScrollSnap: () => 0,
      scrollTo: vi.fn(),
      scrollPrev: vi.fn(),
      scrollNext: vi.fn(),
      canScrollPrev: () => true,
      canScrollNext: () => true,
      on: vi.fn(),
    };
    return [vi.fn(), mainApi];
  },
}));

describe("ProductImageCarousel component", () => {
  it("should render placeholder when no images are provided", () => {
    render(<ProductImageCarousel alt="Test Product" />);
    expect(screen.getByText("Sin imagen")).toBeInTheDocument();
  });

  it("should render zoom button and toggle zoom modal", async () => {
    const images = ["image1.png", "image2.png"];
    render(<ProductImageCarousel imageFileIds={images} alt="Test Product" />);

    // Verifica que el botón de zoom esté en el DOM
    const zoomBtn = screen.getByTitle("Ampliar imagen");
    expect(zoomBtn).toBeInTheDocument();

    // El modal de zoom no debe estar visible inicialmente
    expect(screen.queryByTitle("Cerrar")).not.toBeInTheDocument();

    // Abre el modal de zoom haciendo click en el botón
    fireEvent.click(zoomBtn);

    // Ahora el modal debe estar visible (comprobamos botón Cerrar)
    const closeBtn = screen.getByTitle("Cerrar");
    expect(closeBtn).toBeInTheDocument();

    // Cierra el modal de zoom
    fireEvent.click(closeBtn);

    // El modal de zoom debe volver a estar cerrado
    expect(screen.queryByTitle("Cerrar")).not.toBeInTheDocument();
  });
});
