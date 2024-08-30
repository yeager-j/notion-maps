"use client";

import { ChevronsUpDown, LoaderCircle } from "lucide-react";
import { startTransition, useState } from "react";
import { SearchResponse } from "@notionhq/client/build/src/api-endpoints";
import { isFullDatabase } from "@notionhq/client";
import { CommandLoading } from "cmdk";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { searchNotionDatabase } from "@/app/actions";
import { hasCorrectProperties } from "@/lib/notion";

export default function NotionSearch() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<SearchResponse>();
  const router = useRouter();

  async function handleSearch(query: string) {
    if (query.length > 2) {
      setLoading(true);

      startTransition(async () => {
        const data = await searchNotionDatabase(query); // Call server action
        setSearch(data);
        setLoading(false);
      });
    } else {
      setSearch(undefined);
    }
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className="w-[400px] justify-between"
          role="combobox"
          variant="outline"
        >
          Select Notion Page...
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            onValueChange={handleSearch}
            placeholder="Search Notion pages..."
          />
          <CommandList>
            {!search && !loading && <CommandEmpty>No maps found.</CommandEmpty>}
            {loading && (
              <CommandLoading className="flex items-center justify-center p-6">
                <LoaderCircle className="text-muted-foreground size-4 animate-spin" />
              </CommandLoading>
            )}

            <CommandGroup>
              {search?.results
                .filter((result) => isFullDatabase(result))
                .map((result) => {
                  const isValid = hasCorrectProperties(result);

                  return (
                    <CommandItem
                      disabled={!isValid}
                      key={result.id}
                      onSelect={() => router.push(`/map/${result.id}`)}
                      value={result.id}
                    >
                      {result.title[0].plain_text}

                      {!isValid && <CommandShortcut>Invalid</CommandShortcut>}
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
