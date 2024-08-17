'use client'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { format } from "date-fns"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from '@/lib/utils/shadcn/utils'
import { TenderFormValues } from '@/schema'
import { SectorEnum } from "@/constant/text"
import { Button } from "@/components/ui/button"
import { MultiSelect } from '../../profile/forms/components/multiselect'

type TenderFormStep1Props = {
  form: UseFormReturn<TenderFormValues>
  isLoading: boolean
}

export function TenderFormStep1({ form, isLoading }: TenderFormStep1Props) {
  const sectorOptions = Object.entries(SectorEnum).map(([key, value]) => ({
    id: key,
    name: value,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter title" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="end_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>End Date and Time</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    {field.value ? (
                      format(field.value, "PPP HH:mm")
                    ) : (
                      <span>Pick a date and time</span>
                    )}
                    <div className="ml-auto flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                      <Clock className="h-4 w-4 opacity-50" />
                    </div>
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 space-y-4">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) {
                        const currentDate = field.value || new Date();
                        date.setHours(currentDate.getHours());
                        date.setMinutes(currentDate.getMinutes());
                        field.onChange(date);
                      }
                    }}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                  <div className="flex items-center justify-center">
                    <Input
                      type="time"
                      value={field.value ? format(field.value, "HH:mm") : ""}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':');
                        const newDate = new Date(field.value || new Date());
                        newDate.setHours(parseInt(hours));
                        newDate.setMinutes(parseInt(minutes));
                        field.onChange(newDate);
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="col-span-1 md:col-span-2">
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter summary" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="col-span-1 md:col-span-2">
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Terms</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter terms" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="col-span-1 md:col-span-2">
        <FormField
          control={form.control}
          name="scope_of_works"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scope of Works</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter scope of works" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-1 md:col-span-2">
        <FormField
          control={form.control}
          name="tender_sectors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sectors</FormLabel>
              <FormControl>
                <MultiSelect
                  options={sectorOptions}
                  selected={field.value?.map(sector => sector.toString()) || []}
                  onChange={(selected) => {
                    const sectorEnums = selected.map(s => SectorEnum[s as keyof typeof SectorEnum]);
                    field.onChange(sectorEnums);
                  }}
                  placeholder="Select sectors"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}