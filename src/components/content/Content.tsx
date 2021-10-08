import Styles from './Content.module.scss';

interface ContentProps {
  children: JSX.Element;
}

export default function Content({
  children,
}: ContentProps) {
  return <div className={Styles.content}>{children}</div>;
}
