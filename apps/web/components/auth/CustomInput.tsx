'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const CustomInput = ({
  control,
  placeholder,
  name,
}: {
  control: any;
  placeholder: string;
  name: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="auth-form-label">{placeholder}</FormLabel>
          <FormControl>
            {name.includes('password') || name.includes('Password') ? (
              <div className="flex">
                <Input
                  className="auth-input peer !ring-0"
                  placeholder={placeholder}
                  type={showPassword ? 'text' : 'password'}
                  {...field}
                />
                <button
                  className="border-b-2 text-flickmart-gray transition duration-300 hover:text-flickmart peer-focus-visible:border-flickmart"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  type="button"
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
            ) : (
              <Input
                className="auth-input !ring-0"
                placeholder={placeholder}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default CustomInput;
