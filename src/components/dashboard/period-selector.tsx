'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface PeriodSelectorProps {
  period: '7d' | '30d' | '90d' | '1y' | 'custom'
  startDate?: Date
  endDate?: Date
  onPeriodChange: (period: '7d' | '30d' | '90d' | '1y' | 'custom') => void
  onDateChange: (startDate: Date | undefined, endDate: Date | undefined) => void
  isLoading?: boolean
}

const PeriodSelector = ({
  period,
  startDate,
  endDate,
  onPeriodChange,
  onDateChange,
  isLoading
}: PeriodSelectorProps) => {
  const [isStartDateOpen, setIsStartDateOpen] = useState(false)
  const [isEndDateOpen, setIsEndDateOpen] = useState(false)

  const periodOptions = [
    { value: '7d', label: '7 ngày qua' },
    { value: '30d', label: '30 ngày qua' },
    { value: '90d', label: '90 ngày qua' },
    { value: '1y', label: '1 năm qua' },
    { value: 'custom', label: 'Tùy chọn' }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bộ Lọc Thời Gian</CardTitle>
        <CardDescription>
          Chọn khoảng thời gian để xem báo cáo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Period Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Khoảng thời gian</label>
            <Select 
              value={period} 
              onValueChange={(value) => onPeriodChange(value as any)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Range */}
          {period === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Từ ngày</label>
                <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "dd/MM/yyyy", { locale: vi })
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        onDateChange(date, endDate)
                        setIsStartDateOpen(false)
                      }}
                      disabled={(date) => {
                        if (date > new Date()) return true
                        if (endDate && date > endDate) return true
                        return false
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Đến ngày</label>
                <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, "dd/MM/yyyy", { locale: vi })
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        onDateChange(startDate, date)
                        setIsEndDateOpen(false)
                      }}
                      disabled={(date) => {
                        if (date > new Date()) return true
                        if (startDate && date < startDate) return true
                        return false
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default PeriodSelector
