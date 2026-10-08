import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import languages from "@/lib/languages";

interface LanguageDropDownProps {
  value: string;
  onChange: (value: string) => void;
  isDisabled: boolean;
}

const LanguageDropDown = ({
  value,
  onChange,
  isDisabled,
}: LanguageDropDownProps) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={isDisabled}
    >
      <SelectTrigger className="w-36 text-white">
        <SelectValue placeholder="Languages" />
      </SelectTrigger>

      <SelectContent className="bg-[#1e1e1e] border-[#1e1e1e]">
        <SelectGroup>
          {languages.map((language) => {
            const Icon = language.icon;

            return (
              <SelectItem
                key={language.code}
                value={language.code}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {language.name}
                </span>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LanguageDropDown;