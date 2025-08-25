import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'convex/react';
import parsePhoneNumberFromString from 'libphonenumber-js';
import type { Dispatch } from 'react';
import { type FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { api } from '@/convex/_generated/api';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import Selector from './Selector';

const formSchema = z.object({
  businessName: z
    .string()
    .min(2, {
      message: 'Business name must be at least 2 characters',
    })
    .max(50, {
      message: 'Business name must be at most 50 characters.',
    }),
  location: z
    .string()
    .refine((value) => value, { message: 'Please select a location' }),
  description: z
    .string()
    .min(3, {
      message: 'Description must be at least 2 characters',
    })
    .max(250, {
      message: 'Description must be at most 250 characters',
    }),
  phoneNumber: z.string().transform((arg, ctx) => {
    const phone = parsePhoneNumberFromString(arg, {
      // set this to use a default country when the phone number omits country code
      defaultCountry: 'NG',

      // set to false to require that the whole string is exactly a phone number,
      // otherwise, it will search for a phone number anywhere within the string
      extract: false,
    });

    // when it's good
    if (phone && phone.isValid()) {
      return phone.number;
    }

    // when it's not
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid phone number',
    });
    return z.NEVER;
  }),
});

const StageTwo = ({ setStage }: { setStage: Dispatch<1 | 2 | 3 | 4> }) => {
  const create = useMutation(api.store.createStore);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: '',
      location: '',
      description: '',
      phoneNumber: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values)

    const promise = create({
      name: values.businessName,
      location: values.location,
      description: values.description,
      phone: values.phoneNumber,
    });
    toast.promise(promise, {
      loading: 'Saving store details...',
      success: 'Details saved  succesfully',
      error: 'Failed to create store',
    });
    setStage(3);
  }

  // Handle Error
  function onError(
    error: FieldErrors<{
      businessName: string;
      location: string;
      description: string;
      phoneNumber: string & {
        __tag: 'E164Number';
      };
    }>
  ) {
    console.log(error);
  }
  const locations: string[] = ['enugu', 'nsukka'];
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <h2 className="mb-1 font-medium text-3xl capitalize md:text-4xl">
          Create store
        </h2>
        <p className="mb-8 font-light text-flickmart-gray text-sm md:text-base">
          Fill in the form to create your store
        </p>
        <section className="space-y-2 text-left">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="absolute top-[-9999px]">
                  Business Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-[56px]"
                    placeholder="Business name*"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Selector
            className="text-sm"
            form={form}
            label="location"
            name="location"
            options={locations}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="absolute top-[-9999px]">
                  Phone number
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-[56px]"
                    placeholder="Phone Number*"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="absolute top-[-9999px]">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your business"
                    // className="h-[56px]"
                    rows={7}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
        <button
          className="submit-btn mb-4 rounded-lg text-white capitalize"
          type="submit"
        >
          next
        </button>
      </form>
    </Form>
  );
};
export default StageTwo;
