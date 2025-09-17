import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuestionComponent() {
  const difficultyMapping = {
    Hard: "bg-red-900 text-black",
    Medium: "bg-yellow-900 text-black",
    Easy: "bg-green-900 text-black",
  };

  return (
    <Card className="h-full flex flex-col bg-stone-900 border-black">
      {/* Criteria */}
      <CardHeader>
        <CardTitle className="text-white text-4xl">Two Sum</CardTitle>
        <div className="flex flex-1 pt-5 items-start gap-2">
          <Badge className="bg-red-900 text-black">Difficult</Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Question Description */}
        <div className="flex-1"></div>

        {/* Examples Section */}
        <div className="flex-1"></div>

        {/* Constraints Section */}
        <div className="flex-1"></div>
      </CardContent>
    </Card>
  );
}
