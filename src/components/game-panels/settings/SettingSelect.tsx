import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectProps } from "@radix-ui/react-select";

export type SelectOption = {
  label: string;
  value: string;
};

export type SettingSelectProps = {
  options: SelectOption[];
} & SelectProps;

const SettingSelect = ({ options, ...props }: SettingSelectProps) => {
  return (
    <Select dir="rtl" {...props}>
      <SelectTrigger className="w-auto gap-2">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SettingSelect;
