import { BigCardWithImage } from '@/components/cards/big-card-with-image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n.config';
import { Event } from '@/lib/definitions';
import { Team } from '@/app/[lang]/(unprotected)/teams/page';
import { transformDate } from '@/lib/utils/date-and-time';

interface BigCardsWithImageFieldProps {
  cards: Event[] | Team[];
  type: 'event' | 'team';
  scrollToTop?: () => void;
  lang: Locale;
}

export function BigCardsWithImageField({
  cards,
  type,
  scrollToTop,
  lang,
}: BigCardsWithImageFieldProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedCards, setDisplayedCards] = useState<any[]>([]); // fix "any"
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isUpButtonShown, setIsUpButtonShown] = useState<boolean>(false);
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
            tags={
              type === 'team'
                ? card.sportTypes.join(', ')
                : card.sports_in_matches.join(', ')
            }
            title={
              type === 'event' && card.start_datetime
                ? transformDate(card.start_datetime)
                : `${card.captain.sirname} ${card.captain.name} ${card.captain.fathername}`
            }
            subtitle={card.location}
            description={card.description}
            image={card.image_field}
            lang={lang}
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
