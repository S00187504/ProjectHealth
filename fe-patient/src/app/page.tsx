import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Button >
        Get Started
      </Button>
      <Input type="text" />
    </div>
  );
}
