import React from 'react';
import LaserBorderCard, { LaserBorderCardProps } from './LaserBorderCard';

export interface LaserBorderCardsRowProps {
  cards: LaserBorderCardProps[];
  className?: string;
}

export default function LaserBorderCardsRow({
  cards,
  className = '',
}: LaserBorderCardsRowProps) {
  return (
    <div
      className={`flex flex-col md:flex-row gap-6 md:gap-6 justify-center items-center flex-wrap ${className}`}
    >
      {cards.map((card, index) => (
        <LaserBorderCard
          key={index}
          title={card.title}
          description={card.description}
          statValue={card.statValue}
          statLabel={card.statLabel}
          animationDuration={card.animationDuration}
          primaryColor={card.primaryColor}
          className="w-full md:flex-1 md:max-w-[420px]"
        />
      ))}
    </div>
  );
}
