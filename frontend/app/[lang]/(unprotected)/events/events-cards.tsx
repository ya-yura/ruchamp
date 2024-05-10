import { BigCardWithImage } from '@/components/cards/big-card-with-image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn, transformDate } from '@/lib/utils';

interface BigCardsWithImageFieldProps<T> {
  cards: any; // fix "any"
  type: 'event' | 'team';
  scrollToTop: () => void;
}

export function BigCardsWithImageField<T>({
  cards,
  type,
  scrollToTop,
}: BigCardsWithImageFieldProps<T>) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedCards, setDisplayedCards] = useState<any[]>([]); // fix "any"
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isUpButtonShown, setIsUpButtonShown] = useState<boolean>(false);
  const [mapKey, setMapKey] = useState<number>(0); // This state is to reload map with new data
  const cardsPerPage = 12;
  const totalPages = Math.ceil(cards.length / cardsPerPage);

  useEffect(() => {
    setDisplayedCards(cards.slice(0, cardsPerPage));
  }, [cards]);

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);
    return function () {
      document.removeEventListener('scroll', scrollHandler);
    };
  }, [totalPages, currentPage]);

  useEffect(() => {
    if (isFetching) {
      setCurrentPage((prevVal) => prevVal + 1);
      setDisplayedCards(cards.slice(0, (currentPage + 1) * cardsPerPage));
    }
    setIsFetching(false);
  }, [isFetching]);

  function scrollHandler() {
    const scrollHeight = document.documentElement.scrollHeight; // height of an element's content, including content not visible on the screen due to overflow.
    const scrollTop = document.documentElement.scrollTop; //gets or sets the number of pixels that an element's content is scrolled vertically.
    const innerHeight = window.innerHeight; //interior height of the window in pixels, including the height of the horizontal scroll bar

    if (scrollTop > 1000) {
      setIsUpButtonShown(true);
    } else {
      setIsUpButtonShown(false);
    }

    if (
      scrollHeight - (scrollTop + innerHeight) < 500 &&
      currentPage < totalPages
    ) {
      setIsFetching(true);
    }
  }

  return (
    <>
      <ul className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayedCards.map((card) => (
          <BigCardWithImage
            key={card.id}
            type={type}
            id={card.id}
            name={card.name}
            title={
              type === 'event' && card.start_datetime
                ? transformDate(card.start_datetime)
                : ''
            }
            subtitle={card.location}
            description={card.description}
          />
        ))}
      </ul>
      <Button
        variant="ruchampTransparentGreyBorder"
        size="lg"
        className={cn(
          'fixed right-20 top-20 h-12 w-12 rounded-full p-0 text-border transition-all duration-700 hover:text-black',
          isUpButtonShown ? 'visible opacity-100' : 'invisible opacity-0',
        )}
        onClick={scrollToTop}
      >
        <ArrowUp className="h-6 w-6" />
        <span className="sr-only">Наверх</span>
      </Button>
    </>
  );
}
