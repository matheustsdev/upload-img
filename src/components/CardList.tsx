import { Grid, GridItem, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { string } from 'yup';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE
  const [imageUrl, setImageUrl] = useState('');

  // TODO SELECTED IMAGE URL STATE

  // TODO FUNCTION HANDLE VIEW IMAGE
  return (
    <>
      {/* TODO CARD GRID */}
      <Grid templateColumns="repeat(3, 1fr)" gap={10}>
        {cards.map(card => (
          <GridItem>
            <Card
              key={card.id}
              data={card}
              viewImage={() => setImageUrl(card.url)}
            />
          </GridItem>
        ))}
      </Grid>

      {/* TODO MODALVIEWIMAGE */}
    </>
  );
}
