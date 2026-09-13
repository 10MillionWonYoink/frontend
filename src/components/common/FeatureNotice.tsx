import { Clock3 } from "lucide-react";
import { Card } from "./Card";

export function FeatureNotice({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-dashed shadow-none">
      <div className="flex items-start gap-3">
        <Clock3 className="mt-0.5 size-5 shrink-0 text-[#6c4cff]" aria-hidden="true" />
        <div>
          <h2 className="text-sm font-black text-[#342953]">{title}</h2>
          <div className="mt-1 text-xs leading-6 text-[#8b85a8]">{children}</div>
        </div>
      </div>
    </Card>
  );
}
