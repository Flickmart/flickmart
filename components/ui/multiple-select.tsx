'use client';

import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import {
  type HTMLAttributes,
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

export type TTag = {
  key: string;
  name: string;
};

type MultipleSelectProps = {
  tags: TTag[];
  customTag?: (item: TTag) => ReactNode | string;
  onChange?: (value: TTag[]) => void;
  defaultValue?: TTag[];
};

export const MultipleSelect = ({
  tags,
  customTag,
  onChange,
  defaultValue,
}: MultipleSelectProps) => {
  const [selected, setSelected] = useState<TTag[]>(defaultValue ?? []);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollBy({
        left: containerRef.current?.scrollWidth,
        behavior: 'smooth',
      });
    }
    onValueChange(selected);
  }, [selected]);

  const onValueChange = (value: TTag[]) => {
    onChange?.(value);
  };

  const onSelect = (item: TTag) => {
    setSelected((prev) => [...prev, item]);
  };

  const onDeselect = (item: TTag) => {
    setSelected((prev) => prev.filter((i) => i !== item));
  };

  return (
    <AnimatePresence mode={'popLayout'}>
      <div className={'flex w-[450px] flex-col gap-2'}>
        <strong>TAGS</strong>
        <motion.div
          className="selected flex min-h-[3rem] w-full flex-wrap items-center gap-2 rounded-md border border-gray-200 border-solid bg-gray-50 p-2"
          layout
          ref={containerRef}
        >
          <motion.div className="flex flex-wrap items-center gap-2" layout>
            {selected?.map((item) => (
              <Tag
                className={'bg-white shadow'}
                key={item?.key}
                name={item?.key}
              >
                <div className="flex items-center gap-2">
                  <motion.span className={'text-nowrap'} layout>
                    {item?.name}
                  </motion.span>
                  <button className={''} onClick={() => onDeselect(item)}>
                    <X size={14} />
                  </button>
                </div>
              </Tag>
            ))}
          </motion.div>
        </motion.div>
        {tags?.length > selected?.length && (
          <div className="flex w-full flex-wrap gap-2 rounded-md border border-gray-200 border-solid p-2">
            {tags
              ?.filter((item) => !selected?.some((i) => i.key === item.key))
              .map((item) => (
                <Tag
                  key={item?.key}
                  name={item?.key}
                  onClick={() => onSelect(item)}
                >
                  {customTag ? (
                    customTag(item)
                  ) : (
                    <motion.span className={'text-nowrap'} layout>
                      {item?.name}
                    </motion.span>
                  )}
                </Tag>
              ))}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

type TagProps = PropsWithChildren &
  Pick<HTMLAttributes<HTMLDivElement>, 'onClick'> & {
    name?: string;
    className?: string;
  };

export const Tag = ({ children, className, name, onClick }: TagProps) => {
  return (
    <motion.div
      className={`cursor-pointer rounded-md bg-gray-200 px-2 py-1 text-sm ${className}`}
      layout
      layoutId={name}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
