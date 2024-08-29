import NotionSearch from "@/components/NotionSearch";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-24">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Notion Maps
      </h1>

      <NotionSearch />
    </main>
  );
}
