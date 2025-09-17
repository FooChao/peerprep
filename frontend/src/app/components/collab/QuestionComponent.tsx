import { Badge } from "@/components/ui/badge";

export default function QuestionComponent() {
  const difficultyMapping = {
    Difficult: "bg-",
  };

  return (
    <div className="h-full flex flex-col bg-stone-900">
      {/* Criteria */}
      <div className="flex-1 pt-5 px-3">
        <Badge variant="destructive">Difficult</Badge>
        <Badge variant="destructive">Difficult</Badge>
        <Badge variant="destructive">Difficult</Badge>
        <Badge variant="destructive">Difficult</Badge>
      </div>

      {/* Question Description */}
      <div className="flex-1"></div>

      {/* Examples Section */}
      <div className="flex-1"></div>

      {/* Constraints Section */}
      <div className="flex-1"></div>
    </div>
  );
}
