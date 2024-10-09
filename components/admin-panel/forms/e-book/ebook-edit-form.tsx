import * as React from "react";
import { CalendarIcon, CaretSortIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckIcon } from "lucide-react";

const categories = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

function EbookEditForm({ isEditDialogOpen, setIsEditDialogOpen }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [date, setDate] = React.useState<Date>();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = React.useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, setValue] = React.useState("");
  return (
    <Dialog
      open={isEditDialogOpen}
      onOpenChange={isEditDialogOpen ? setIsEditDialogOpen : false}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit e-book</DialogTitle>
          <DialogDescription>
            {"Make changes to your e-book here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="image">Image</Label>
            <Input id="image" type="file" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value="Very, Edward W. (Edward Wilson), 1847-1910	"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value="Navies of the world : giving concise descriptions of the plans, armament and armor of the naval vessels of twenty of the principal nations."
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="category">Category</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild className="col-span-3">
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {value
                    ? categories.find((framework) => framework.value === value)
                        ?.label
                    : "Select category..."}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Command>
                  <CommandInput
                    placeholder="Search categories..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((framework) => (
                        <CommandItem
                          key={framework.value}
                          value={framework.value}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          {framework.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              value === framework.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="pages">Pages</Label>
            <Input id="pages" value="452" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="publication">Publication</Label>
            <Input
              id="publication"
              value="New York: John Wiley & Sons, 1880.	"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="release_date">Release date</Label>
            <Popover>
              <PopoverTrigger asChild className="col-span-3">
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value="Naval battles,Navies,Torpedoes,Naval architecture,Ordnance, naval	"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EbookEditForm;