'use client';

import { useEffect, useState } from 'react';

type ItemType = 'snow' | 'gift' | 'santa';

interface FallingItem {
  id: number;
  left: string;
  animationDuration: string;
  animationDelay: string;
  opacity: number;
  type: ItemType;
}

const ChristmasSnowfall = () => {
  const [items, setItems] = useState<FallingItem[]>([]);

  useEffect(() => {
    const snowCount = 50;
    const giftCount = 2; // Reduced frequency
    const santaCount = 1;

    const createItem = (i: number, type: ItemType): FallingItem => {
      // Vary delay based on type to spread out the rare items
      const maxDelay = type === 'snow' ? 5 : type === 'gift' ? 25 : 40;
      
      // Even slower speed: Duration between 20s and 35s
      const minDuration = 20;
      const additionalDuration = 15;

      return {
        id: i,
        left: `${Math.random() * 100}vw`,
        animationDuration: `${Math.random() * additionalDuration + minDuration}s`, 
        animationDelay: `${Math.random() * maxDelay}s`,
        // Reduced opacity for all items
        opacity: type === 'snow' ? Math.random() * 0.5 + 0.5 : 0.7, 
        type,
      };
    };

    const newItems: FallingItem[] = [];
    let idCounter = 0;

    // Add Snow
    for (let i = 0; i < snowCount; i++) {
      newItems.push(createItem(idCounter++, 'snow'));
    }

    // Add Gifts
    for (let i = 0; i < giftCount; i++) {
      newItems.push(createItem(idCounter++, 'gift'));
    }

    // Add Santas
    for (let i = 0; i < santaCount; i++) {
      newItems.push(createItem(idCounter++, 'santa'));
    }

    setItems(newItems);
  }, []);

  const getIcon = (type: ItemType) => {
    switch (type) {
      case 'gift':
        return '🎁';
      case 'santa':
        return '🎅';
      default:
        return '❄';
    }
  };

  const getSize = (type: ItemType) => {
    switch (type) {
      case 'gift':
        return '1.2rem'; // Reduced size
      case 'santa':
        return '1.5rem';   // Smaller size
      default:
        return '1.5rem';
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10vh) translateX(0) rotate(0deg);
          }
          100% {
            transform: translateY(105vh) translateX(20px) rotate(10deg);
          }
        }
        .falling-item {
          position: fixed;
          top: -60px;
          z-index: 9999;
          user-select: none;
          pointer-events: none;
          color: white;
          text-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          animation-name: snowfall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
      `}</style>
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="falling-item"
            style={{
              left: item.left,
              animationDuration: item.animationDuration,
              animationDelay: item.animationDelay,
              opacity: item.opacity,
              fontSize: getSize(item.type),
              // Reset color for emojis so they show their native colors
              color: item.type === 'snow' ? 'white' : 'initial',
            }}
          >
            {getIcon(item.type)}
          </div>
        ))}
      </div>
    </>
  );
};

export default ChristmasSnowfall;
