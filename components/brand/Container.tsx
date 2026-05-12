import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";

/*
 * Container — the editorial rail used everywhere except full-bleed media.
 *
 * Width and gutters are pinned to spec §5.4:
 *   - max-w-[1200px]
 *   - 24px gutter mobile, 40px tablet (sm), 64px desktop (lg)
 *
 * Polymorphic on `as` so a Container can render as <main>, <section>,
 * <header>, <footer>, <nav>, or <div> without wrapping. Default is <div>.
 *
 * `wide` is an opt-out for the case-study media row (max-w-[920px] is the
 * reading rail, but media goes wider to the same 1200 — same as default,
 * so `wide` simply removes the prose constraint when nested inside Prose).
 */

type ContainerOwnProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
};

type ContainerProps<T extends ElementType> = ContainerOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ContainerOwnProps<T>>;

export default function Container<T extends ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: ContainerProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag
      className={`mx-auto w-full max-w-[1200px] px-6 sm:px-10 lg:px-16 ${className ?? ""}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
