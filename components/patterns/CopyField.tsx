"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, Copy } from "lucide-react";

export type CopyFieldProps = {
  value: string;
  placeholder?: string;
  className?: string;
  copiedText?: string;
};

export function CopyField({
  value,
  placeholder = "생성 중...",
  className,
  copiedText = "복사완료!",
}: CopyFieldProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 flex items-center justify-between gap-2",
        className,
      )}
    >
      <code className="text-xs text-neutral-500 truncate flex-1 font-mono bg-white px-2 py-1 rounded border border-neutral-100">
        {value || placeholder}
      </code>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 text-neutral-500 hover:text-primary"
        onClick={handleCopy}
        title="복사"
        disabled={!value}
      >
        {copied ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}


