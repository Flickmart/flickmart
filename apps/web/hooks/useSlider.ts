import { useEffect, useState } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';

export default function useSlider() {
  const [api, setApi] = useState<CarouselApi>();
  const [count, setCount] = useState(0);
  const [current, setCurrent] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (autoScroll) {
      intervalId = setInterval(() => {
        if (current === count) {
          api?.scrollTo(0);
        } else {
          api?.scrollNext();
        }
      }, 2000);
    } else {
      clearTimeout(intervalId);
    }

    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);

    setCurrent(api?.selectedScrollSnap() + 1);

    api.on('select', () => setCurrent(api.selectedScrollSnap() + 1));

    return () => {
      clearTimeout(intervalId);
    };
  }, [api, current, count, autoScroll]);

  return { api, setApi, count, current, setAutoScroll };
}
