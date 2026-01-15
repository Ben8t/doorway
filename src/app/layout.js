import './globals.css';

export const metadata = {
  title: 'Doorway - Agencement de Meubles',
  description: 'Application de placement de meubles sur plan d\'appartement',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
