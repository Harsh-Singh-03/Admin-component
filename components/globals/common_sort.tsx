import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Fragment, useState } from "react"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"

interface props {
  children: React.ReactNode,
  data: {
    name: string,
    label: string,
    type: string
  }[]
  onApplied: (data: any) => void
}
export function SortComponent({ children, data, onApplied }: props) {
  const [values, setValues] = useState({
    field: '',
    value: ''
  })

  const onChange = (field: string, value: string) => {
    setValues({ field, value })
  }

  const onApply = () => {
    if (values.field && values.value) {
      onApplied({ [values.field]: +values.value })
    }
  }

  return (
    <Fragment>
      {/* Sorting component for desktop */}
      <div className="hidden md:block">
        <Sheet>
          <SheetTrigger asChild>
            {children}
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Select Sorting</SheetTitle>
              <SheetDescription>
                Select & apply to sort the data
              </SheetDescription>
            </SheetHeader>
            {/* Main Content */}
            <div className="space-y-4 my-4">
              {data?.map((item, i) => (
                <div key={i} className="space-y-2">
                  <Label>{item.label} :</Label>
                  <Select
                    onValueChange={(val) => onChange(item.name, val)}
                    value={values.field === item.name ? values.value : ''}
                  >
                    <SelectTrigger className="w-full" >
                      <SelectValue placeholder="-- SELECT --" className="placeholder:text-muted-foreground text-sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="text-muted-foreground font-medium">Sort By {item.label}</SelectLabel>
                        <SelectItem value="1">{item.type === 'date' ? "Oldest Document First" : 'A - Z ' }</SelectItem>
                        <SelectItem value="-1">{item.type === 'date' ? "Newest Document First" : 'Z - A '  }</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            {/* End of main content */}
            <SheetFooter>
              <SheetClose asChild>
                <Button onClick={onApply} className="tracking-wider" >Apply</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      {/* Sorting component for mobile */}
      <div className="block md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            {children}
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Select Sorting</DrawerTitle>
                <DrawerDescription>Select & apply to sort the data</DrawerDescription>
              </DrawerHeader>

              {/* Main Content */}
              <div className="space-y-4 mb-4 px-4">
                {data?.map((item, i) => (
                  <div key={i} className="space-y-2">
                    <Label>{item.label} :</Label>
                    <Select
                      onValueChange={(val) => onChange(item.name, val)}
                      value={values.field === item.name ? values.value : ''}
                    >
                      <SelectTrigger className="w-full" >
                        <SelectValue placeholder="-- SELECT --" className="placeholder:text-muted-foreground text-sm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="text-muted-foreground font-medium">Sort By {item.label}</SelectLabel>
                          <SelectItem value="1">Ascending</SelectItem>
                          <SelectItem value="-1">Descending</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              {/* End of main content */}
              <DrawerFooter className="justify-center gap-2 px-4">
                <DrawerClose asChild className="flex -1">
                  <Button className="flex-1 w-full" onClick={onApply}>Apply</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </Fragment>
  )
}
