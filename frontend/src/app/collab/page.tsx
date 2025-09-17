import ChatComponent from "../components/collab/ChatComponent";
import CodingComponent from "../components/collab/CodingComponent";
import QuestionComponent from "../components/collab/QuestionComponent";
import SessionHeader from "../components/collab/SessionHeader";

export default function CollabPage() {
  return (
    <main className="bg-stone-900 min-h-screen flex flex-col items-center">
      <SessionHeader />

      <div className="flex flex-1 w-full bg-stone-800 ">
        <QuestionComponent />
        <CodingComponent />
        <ChatComponent />
      </div>
    </main>
  );
}
