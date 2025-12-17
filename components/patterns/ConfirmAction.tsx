"use client";

import * as React from "react";

type ConfirmActionProps = {
  confirmText: string;
  onConfirm: () => void | Promise<void>;
  children: (props: { onClick: () => void; pending: boolean }) => React.ReactNode;
};

export function ConfirmAction({ confirmText, onConfirm, children }: ConfirmActionProps) {
  const [pending, setPending] = React.useState(false);

  const onClick = async () => {
    if (pending) return;
    const ok = window.confirm(confirmText);
    if (!ok) return;
    try {
      setPending(true);
      await onConfirm();
    } finally {
      setPending(false);
    }
  };

  return <>{children({ onClick, pending })}</>;
}


