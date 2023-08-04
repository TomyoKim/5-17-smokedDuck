import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';

import { getLinkDetails, LINK_URL } from '@/apis/Media';
import useCategory from '@/hooks/useCategory';
import { useYoutubeVideo } from '@/hooks/UseYoutubeVideo';
import { MainContext } from '@/store/index';
import { CategoryResponseDTO } from '@/types/category.interface';
import { FormData } from '@/types/media.interface';
import { getLinkUrlInfo } from '@/utils/validations/linkUtils';

interface LinkFormProps {
  onSubmit: (data: FormData) => void;
  linkId?: number;
}

export default function LinkForm({ onSubmit, linkId }: LinkFormProps) {
  const { loginToken } = useContext(MainContext);
  const { data: media } = useSWR(
    linkId ? [`${LINK_URL}${linkId}`, loginToken || ''] : null,
    linkId && loginToken
      ? ([_, accessToken]) => getLinkDetails(linkId, accessToken)
      : null
  );

  const [linkUrl, setLinkUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const { youtubeVideo, handler } = useYoutubeVideo();

  const [isTitleChanged, setIsTitleChanged] = useState(false);
  const [isDescriptionChanged, setIsDescriptionChanged] = useState(false);

  const isRequiredFieldsEmpty = !category || !linkUrl || !title;

  const handleLinkChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const link = event.target.value;
      setLinkUrl(link);
      handler(link);
    },
    [handler]
  );
  const { categoryListData: categories } = useCategory();

  useEffect(() => {
    if (media) {
      setLinkUrl(linkUrl || getLinkUrlInfo(media?.url).linkUrl);
      if (categories) {
        setCategory(media?.category?.id);
      }
    }

    setIsFormComplete(true);
  }, [media, categories, linkUrl]);

  useEffect(() => {
    const updateFormCompletion = () => {
      const isTitleValid =
        title.trim() !== '' ||
        (youtubeVideo && youtubeVideo.title.trim() !== '');

      setIsFormComplete(!!isTitleValid);
    };

    updateFormCompletion();

    setDescription(
      isDescriptionChanged
        ? description
        : youtubeVideo?.description || media?.description || ''
    );

    setTitle(
      isTitleChanged ? title : youtubeVideo?.title || media?.title || ''
    );
  }, [
    youtubeVideo,
    media,
    isDescriptionChanged,
    isTitleChanged,
    title,
    description,
  ]);

  const handleSubmit = useCallback(() => {
    if (isRequiredFieldsEmpty) {
      return;
    }
    const formData = {
      category: category || -1,
      linkUrl: linkUrl || getLinkUrlInfo(media?.url || '').linkUrl,
      title,
      description,
    };

    onSubmit({
      ...formData,
      thumbnailUrl:
        (youtubeVideo && youtubeVideo.thumbnailUrl) ||
        getLinkUrlInfo(media?.url || '').thumbnailUrl ||
        '',
      title: isTitleChanged
        ? title
        : (youtubeVideo && youtubeVideo.title) || '',
    });
  }, [
    isRequiredFieldsEmpty,
    category,
    linkUrl,
    media?.url,
    title,
    description,
    onSubmit,
    youtubeVideo,
    isTitleChanged,
  ]);

  return (
    <Container>
      <CreateHeader>
        <Heading as="h5" size="sm">
          센터 링크
        </Heading>
        <p>센터에 미리 운동 영상 링크를 정리하세요.</p>
        <p>회원에게 발송하는 메시지에 간편하게 활용할 수 있습니다.</p>
      </CreateHeader>

      <FormControl isRequired>
        <FormLabel>카테고리</FormLabel>
        <Select
          placeholder="카테고리를 선택해 주세요."
          marginBottom="10px"
          value={category}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            setCategory(Number(event.target.value));
          }}
        >
          {categories?.categories.map((categoryInfo: CategoryResponseDTO) => (
            <option key={categoryInfo.id} value={categoryInfo.id}>
              {categoryInfo.title}
            </option>
          ))}
        </Select>

        <FormLabel>링크</FormLabel>

        <InputWrapper>
          <Input
            type="text"
            onChange={handleLinkChange}
            placeholder="URL을 입력해주세요"
            width="800px"
            marginBottom="10px"
            value={linkUrl}
          />
        </InputWrapper>

        <FormLabel>링크 제목</FormLabel>

        <Input
          type="text"
          value={isTitleChanged ? title : youtubeVideo?.title || ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTitle(event.target.value);
            setIsTitleChanged(true);
          }}
          placeholder="링크 제목을 입력해 주세요."
          width="800px"
          marginBottom="10px"
        />
      </FormControl>
      <InputTitle>메모</InputTitle>

      <DescriptionBox>
        <Textarea
          value={
            isDescriptionChanged ? description : youtubeVideo?.description || ''
          }
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const { value } = event.target;
            setDescription(value.slice(0, 500));
            setIsDescriptionChanged(true);
          }}
          placeholder="링크를 식별하기 위한 간단한 메모를 작성해 주세요. (500자 이내)"
          resize="none"
          height="120px"
          width="800px"
        />

        <CharacterCount>{description.length} / 500</CharacterCount>
      </DescriptionBox>
      <ButtonPlace>
        <StyledButton
          border="none"
          backgroundColor="#2D62EA"
          color="#FFFFFF"
          borderRadius="70"
          width="40px"
          height="24px"
          disabled={!isFormComplete || isRequiredFieldsEmpty}
          onClick={handleSubmit}
        >
          완료
        </StyledButton>
      </ButtonPlace>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 800px;
`;

const CreateHeader = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 5px;
`;

const InputTitle = styled.h4`
  margin-bottom: 5px;
  margin-top: 5px;
`;

const DescriptionBox = styled.div`
  position: relative;
`;

const CharacterCount = styled.p`
  position: absolute;
  bottom: 5px;
  right: 5px;
  font-size: 12px;
  color: #777;
`;

const ButtonPlace = styled.div`
  position: absolute;
  right: 34px;
  bottom: 14px;
`;

const StyledButton = styled(Button)`
  border: none;
  border-radius: 70;
  width: 40px;
  font-size: 12px;
  height: 24px;
  background-color: ${props => (props.disabled ? '#f4f4f4' : '#2D62EA')};
  color: ${props => (props.disabled ? '#aeaeae' : '#ffffff')};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
`;
