import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Dog {
  id: string;
  name: string;
  imageUrl?: string | null;
}

interface DogAvatarProps {
  dog: Dog;
  size?: number;
  className?: string;
  onClick?: () => void;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export function DogAvatar({
  dog,
  size = 56,
  className,
  onClick,
}: DogAvatarProps) {
  const initials = getInitials(dog.name);

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width: size }}
      className={cn("flex flex-col items-center gap-1.5 group", className)}
    >
      <div
        style={{ width: size, height: size }}
        className="relative rounded-full overflow-hidden bg-primary/70 flex items-center justify-center ring-2 ring-transparent group-hover:ring-primary/40 transition-all shrink-0"
      >
        {dog.imageUrl ? (
          <img
            src={dog.imageUrl}
            alt={dog.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-primary-foreground font-semibold text-sm select-none">
            {initials}
          </span>
        )}
      </div>
      <span
        className="text-xs text-foreground font-medium leading-tight text-center truncate w-full"
        title={dog.name}
      >
        {dog.name}
      </span>
    </button>
  );
}

interface DogAvatarListProps {
  dogs: Dog[];
  onDogPress?: (dog: Dog) => void;
  className?: string;
}

export function DogAvatarList({
  dogs,
  onDogPress,
  className,
}: DogAvatarListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [dogs, updateArrows]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -120 : 120,
      behavior: "smooth",
    });
  };

  if (!dogs.length) return null;

  return (
    <div className={cn("relative", className)}>
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Desplazar izquierda"
          className="absolute left-0 top-[28px] -translate-y-1/2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-secondary border border-border shadow-sm text-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Scrollable list */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-none px-1"
        style={{ scrollbarWidth: "none" }}
      >
        {dogs.map((dog) => (
          <DogAvatar
            key={dog.id}
            dog={dog}
            onClick={() => onDogPress?.(dog)}
            className="shrink-0"
          />
        ))}
      </div>

      {/* Right arrow */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Desplazar derecha"
          className="absolute right-0 top-[28px] -translate-y-1/2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-secondary border border-border shadow-sm text-foreground hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
