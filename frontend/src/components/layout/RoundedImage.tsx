import styles from './RoundedImage.module.css';

export interface IRoundedImageProps {
    src: string;
    alt?: string;
    width?: number;
}

export default function RoundedImage ({src, alt, width = 0}: IRoundedImageProps) {
  return (
    <img className={`${styles.rounded_image} ${styles[width]}`} src={src} alt={alt} />
  );
}
