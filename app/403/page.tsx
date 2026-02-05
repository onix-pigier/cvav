// app/403/page.tsx
export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-blue-600">403</h1>
      <p className="text-xl mt-4">Accès refusé – Vous n’avez pas les droits nécessaires.</p>
      <a href="/dashboard" className="mt-6 btn btn-primary">Retour au tableau de bord</a>
    </div>
  );
}