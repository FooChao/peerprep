import ContentPage from "../components/collab/ContentPage";
import SessionHeader from "../components/collab/SessionHeader";

export default function CollabPage() {
  return (
    <main className="bg-stone-900 h-screen flex flex-col items-center">
      <SessionHeader />
      <ContentPage />
    </main>
  );
}
