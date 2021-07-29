import React from 'react';
import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router';

type btnActionsProps = {
  icon: null | React.ReactElement;
  disabled?: boolean;
  label: string;
  className: string;
  actionButton: string;
};

export default function BtnActions({
  icon,
  label,
  disabled = false,
  className,
  actionButton,
}: btnActionsProps) {
  const router = useRouter();

  return (
    <Button
      variant="contained"
      startIcon={icon}
      disabled={disabled}
      className={className}
      onClick={() => {
        router.push(actionButton);
      }}
    >
      {label}
    </Button>
  );
}
