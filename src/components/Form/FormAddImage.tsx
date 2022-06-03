import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

type PostImageType = {
  url: string;
  title: string | unknown;
  description: string | unknown;
};

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: 'Insira uma imagem',
      validate: {
        lessThan10MB: (value: FileList) =>
          value[0].size < 1048576 || 'O arquivo deve ser menor que 10MB',
        cceptedFormats: (value: FileList) =>
          ['image/gif', 'image/png', 'image/jpeg'].findIndex(el => {
            if (value[0].type === '') {
              return false;
            }
            return el === value[0].type;
          }) !== -1 || 'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    title: {
      required: 'Insira um título',
      minLength: { value: 2, message: 'Tamanho mínimo' },
      maxLength: { value: 20, message: 'Tamanho máximo' },
    },
    description: {
      required: 'Insira uma descrição',
      maxLength: { value: 65, message: 'Tamanho máximo' },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    // TODO MUTATION API POST REQUEST,
    (body: PostImageType) => {
      return api.post(`/api/images`, body);
    },

    {
      // TODO ONSUCCESS MUTATION
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      // TODO EXECUTE ASYNC MUTATION
      // TODO SHOW SUCCESS TOAST
      console.log(data.title);
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      } else {
        mutation.mutateAsync(
          {
            url: imageUrl,
            title: data.title,
            description: data.description,
          },
          {
            onSuccess: () => {
              toast({
                title: 'Imagem cadastrada',
                description: 'Sua imagem foi cadastrada com sucesso.',
                status: 'success',
                duration: 5000,
                isClosable: true,
              });
            },
          }
        );
      }
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      setImageUrl('');
      setLocalImageUrl('');
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          name="image"
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          name="title"
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          name="description"
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
