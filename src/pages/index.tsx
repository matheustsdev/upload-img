import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

type PageType = {
  data: Card[];
  after: string;
};

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<PageType>(
    'images',
    async ({ pageParam = null }) => {
      const response = await api
        .get(`/api/images`, {
          params: {
            after: pageParam,
          },
        })
        .then(res => {
          return res.data;
        })
        .catch(e => {
          console.log(e);
        });

      return response;
    },
    {
      getNextPageParam: lastPage => {
        const { after } = lastPage;

        if (after) {
          return after;
        }
        return null;
      },
    }
  );

  console.log(data);

  const formattedData = useMemo(() => {
    //  TODO FORMAT AND FLAT DATA ARRAY
    let cards = [];
    if (data !== undefined) {
      cards = data?.pages.flatMap(page => {
        const allCards = page.data.map(card => {
          return card;
        });
        return allCards;
      });
    }
    return cards;
  }, [data]);

  if (isLoading || isFetchingNextPage) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        <button type="button" onClick={() => fetchNextPage}>
          Poceto
        </button>
      </Box>
    </>
  );
}
