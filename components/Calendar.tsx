import { DayPicker } from "react-day-picker"
import { es } from "react-day-picker/locale";

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export default function Calendar({
  ...props
}: CalendarProps) {
  return (
    <div className="w-full max-w-md mx-auto shadow-lg rounded-lg overflow-hidden p-4">
      <DayPicker
        {...props}
        showOutsideDays
        locale={es}
        captionLayout="dropdown"
      />
    </div>
  )
}