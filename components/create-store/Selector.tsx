import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormMessage } from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type FormType = {
  businessName: string;
  location: string;
  description: string;
  phoneNumber: string & { __tag: 'E164Number' };
};

export default function Selector({
  name,
  options,
  label = '',
  form,
  className = '',
}: {
  name: 'businessName' | 'location' | 'description' | 'phoneNumber';
  options: string[];
  label?: string;
  form: UseFormReturn<FormType>;
  className?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        let value = '';
        if (typeof field.value === 'string') {
          value = field.value;
        }
        return (
          <FormItem>
            <div className="lg:py- rounded-lg border border-gray-300 py-2.5">
              <Select
                onValueChange={field.onChange}
                required
                {...field}
                defaultValue={value}
                value={value}
              >
                <SelectTrigger
                  className={`w-full border-none text-lg capitalize shadow-none outline-none focus:ring-0 ${className}`}
                >
                  <SelectValue placeholder={`${label || name}*`} />
                </SelectTrigger>
                <SelectContent
                  align="center"
                  className="rounded-lg py-3 capitalize shadow-lg"
                  side="bottom"
                >
                  {options.map((item) => (
                    <SelectItem
                      className="rounded-lg px-5 py-3 hover:bg-slate-100"
                      key={item}
                      value={item}
                    >
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
