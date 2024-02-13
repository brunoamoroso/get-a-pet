import styles from './RoundedImage.module.css';

export interface IRoundedImageProps {
    src: string;
    alt?: string;
    width?: string;
}

export default function RoundedImage ({src, alt, width = ""}: IRoundedImageProps) {
  return (
    <img className={`${styles.rounded_image} ${styles[width]}`} src={src} alt={alt} />
  );
}
