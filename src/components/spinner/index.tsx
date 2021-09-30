import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import Styles from './Spinner.module.scss';

interface SpinnerProps {
  spinning: boolean;
  children: JSX.Element;
}

export default function Spinner({
  spinning,
  children,
}: SpinnerProps) {
  return (
    <>
      {spinning ? (
        <FaSpinner className={Styles.spinner} />
      ) : (
        <>{children}</>
      )}
    </>
  );
}
