"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

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
            {name === "password" ? (
              <div className="flex">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="auth-input peer"
                  placeholder={placeholder}
                  {...field}
                />
                <button
                  type="button"
                  className="border-b-2 peer-focus-visible:border-flickmart transition duration-300 hover:text-flickmart"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
            ) : (
              <Input
                className="auth-input"
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
