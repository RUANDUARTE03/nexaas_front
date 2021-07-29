import React, { useMemo } from 'react';
import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router';
import Styles from './btnActionsCrud.module.scss';

type BtnActionsCrudProps = {
  mode: 'edit' | 'create';
  title: string;
  cancel: () => void; // clear inputs
  routerCancel: string;
  action: () => void;
};

export default function BtnActionsCrud({
  mode,
  title,
  routerCancel,
  cancel,
  action,
}: BtnActionsCrudProps) {
  const router = useRouter();
  const titleMode = useMemo(() => {
    if (mode === 'edit') {
      return 'Editar';
    }
    return 'Criar';
  }, [mode]);

  return (
    <div className={Styles.container}>
      <Button onClick={action} className={Styles.btnAction}>
        {`${titleMode} ${title}`}
      </Button>
      <Button
        onClick={() => {
          router.push(routerCancel);
          cancel();
        }}
        className={Styles.btnCancel}
      >
        Cancelar
      </Button>
    </div>
  );
}
