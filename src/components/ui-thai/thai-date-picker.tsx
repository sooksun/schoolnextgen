'use client'

import * as React from 'react'
import { th } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatThaiShort, toBeYear } from '@/lib/date/thai'
import { cn } from '@/lib/utils'

type Props = {
  value: Date | null
  onChange: (d: Date | null) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
  maxDate?: Date
  minDate?: Date
}

const THAI_MONTH_NAMES = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]
const THAI_MONTH_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
]

export function ThaiDatePicker({
  value,
  onChange,
  placeholder = 'เลือกวันที่',
  disabled,
  id,
  className,
  maxDate,
  minDate,
}: Props) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground',
              className,
            )}
          >
            <CalendarIcon />
            {value ? formatThaiShort(value) : placeholder}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={(d) => {
            onChange(d ?? null)
            setOpen(false)
          }}
          locale={th}
          disabled={(date) =>
            (maxDate ? date > maxDate : false) || (minDate ? date < minDate : false)
          }
          formatters={{
            formatCaption: (d: Date) => `${THAI_MONTH_NAMES[d.getMonth()]} พ.ศ. ${toBeYear(d.getFullYear())}`,
            formatMonthDropdown: (d: Date) => THAI_MONTH_NAMES[d.getMonth()],
            formatYearDropdown: (d: Date) => String(toBeYear(d.getFullYear())),
            formatWeekdayName: (d: Date) => ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'][d.getDay()],
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export { THAI_MONTH_NAMES, THAI_MONTH_SHORT }
