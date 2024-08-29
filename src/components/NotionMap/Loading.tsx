import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8">
      <LoaderCircle className="text-primary mr-2 size-12 animate-spin" />
      <span className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Loading
      </span>
    </div>
  );
}
