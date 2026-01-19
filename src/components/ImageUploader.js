import { useRef } from 'react';
import styles from './ImageUploader.module.css';

export default function ImageUploader({ onImageUpload, onCreatePlan, onSelectPlan }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.uploader}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={styles.content}>
          <svg
            className={styles.icon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className={styles.title}>Charger un Plan d&apos;Appartement</h3>
          <p className={styles.description}>
            Cliquez ou glissez-déposez une image (JPG, PNG)
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
      </div>

      <div className={styles.divider}>
        <span>ou</span>
      </div>

      <div className={styles.alternatives}>
        <button
          className={styles.alternativeButton}
          onClick={(e) => {
            e.stopPropagation();
            onCreatePlan();
          }}
        >
          <span className={styles.buttonIcon}>✏️</span>
          <span>Créer un Nouveau Plan</span>
        </button>
        <button
          className={styles.alternativeButton}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPlan();
          }}
        >
          <span className={styles.buttonIcon}>📋</span>
          <span>Choisir un Plan Sauvegardé</span>
        </button>
      </div>
    </div>
  );
}
