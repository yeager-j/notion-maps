import { ContextMenuTriggerProps } from "@radix-ui/react-context-menu";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { LocationType } from "@/components/NotionMap/types";

export default function MapContextMenu(
  props: ContextMenuTriggerProps & {
    handleCreateLocation: (type: LocationType) => void;
  },
) {
  return (
    <ContextMenu>
      <ContextMenuTrigger {...props} />

      <ContextMenuPortal>
        <ContextMenuContent
          style={{
            zIndex: 10000,
          }}
        >
          <ContextMenuSub>
            <ContextMenuSubTrigger>Settlement</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem
                onSelect={() => props.handleCreateLocation("Megapolis")}
              >
                Create Megapolis
              </ContextMenuItem>
              <ContextMenuItem
                onSelect={() => props.handleCreateLocation("City")}
              >
                Create City
              </ContextMenuItem>
              <ContextMenuItem
                onSelect={() => props.handleCreateLocation("Town")}
              >
                Create Town
              </ContextMenuItem>
              <ContextMenuItem
                onSelect={() => props.handleCreateLocation("Village")}
              >
                Create Village
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuItem
            onSelect={() => props.handleCreateLocation("Point of Interest")}
          >
            Create Point of Interest
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={() => props.handleCreateLocation("Dungeon")}
          >
            Create Dungeon
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenuPortal>
    </ContextMenu>
  );
}
