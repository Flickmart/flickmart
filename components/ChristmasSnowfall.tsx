'use client';

import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile'; // Import the hook

type ItemType = 'snow' | 'gift' | 'santa' | 'tree' | 'goat';

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
  const isMobile = useIsMobile(); // Use the hook

  useEffect(() => {
    const snowCount = 100; // Increased frequency
    const giftCount = 4;
    const santaCount = 2;
    const treeCount = 8;
    const goatCount = 4;

    const createItem = (i: number, type: ItemType): FallingItem => {
      let maxDelay = 5;
      if (type === 'gift') maxDelay = 25;
      else if (type === 'santa') maxDelay = 40;
      else if (type === 'tree') maxDelay = 30;
      else if (type === 'goat') maxDelay = 45;
      
      const minDuration = 20;
      const additionalDuration = 15;

      return {
        id: i,
        left: `${Math.random() * 100}vw`,
        animationDuration: `${Math.random() * additionalDuration + minDuration}s`, 
        animationDelay: `${Math.random() * maxDelay}s`,
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

    // Add Trees
    for (let i = 0; i < treeCount; i++) {
      newItems.push(createItem(idCounter++, 'tree'));
    }

    // Add Goats
    for (let i = 0; i < goatCount; i++) {
      newItems.push(createItem(idCounter++, 'goat'));
    }

    setItems(newItems);
  }, []);

  const getIcon = (type: ItemType) => {
    switch (type) {
      case 'gift':
        return '🎁';
      case 'santa':
        return '🎅';
      case 'tree':
        return '🎄';
      case 'goat':
        return '🐐';
      default:
        return '❄';
    }
  };

  const getSize = (type: ItemType) => {
    switch (type) {
      case 'gift':
        return '1.2rem';
      case 'santa':
        return '1.5rem';
      case 'tree':
        return '1.4rem';
      case 'goat':
        return '1.3rem';
      default:
        // Adjust snow size based on mobile
        return isMobile ? '1rem' : '1.5rem'; 
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
