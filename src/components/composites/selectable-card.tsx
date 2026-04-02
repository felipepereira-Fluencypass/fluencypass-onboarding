'use client';

import React from 'react';
import { cn } from '@fluencypassdevs/cycle/lib/utils';
import { Badge } from '@fluencypassdevs/cycle';

interface SelectableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  selected: boolean;
  title: string;
  description?: string;
  badge?: string;
  onSelect: () => void;
  icon?: React.ReactNode;
}

export function SelectableCard({
  selected,
  title,
  description,
  badge,
  icon,
  onSelect,
  className,
  ...props
}: SelectableCardProps) {
  return (
    <div
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "relative flex flex-col gap-2 p-6 rounded-xl border-2 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected
          ? "theme-brand border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted/30",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1 w-full max-w-[85%]">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={cn(
                "p-2 rounded-lg shrink-0 transition-colors",
                selected ? "theme-brand bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {icon}
              </div>
            )}
            <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          </div>

          {description && (
            <p className={cn("text-sm text-muted-foreground mt-1 leading-relaxed", icon ? "ml-12" : "")}>
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className={cn(
            "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
            selected ? "theme-brand border-primary bg-primary" : "border-muted-foreground/30"
          )}>
            {selected && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
          </div>

          {badge && (
            <span className="theme-positive">
              <Badge variant={selected ? "default" : "muted"} className="mt-1">
                {badge}
              </Badge>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
