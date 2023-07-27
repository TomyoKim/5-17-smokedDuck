import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

import { useYoutubeVideo } from '@/hooks/UseYoutubeVideo';

import EditBox from '../Common/EditBox';
import MediaContent from './MediaContent';

type MediaCardProps = {
  id: number;
  title: string;
  description: string;
  linkUrl: string;
};

export default function MediaCard({
  id,
  title,
  description,
  linkUrl,
}: MediaCardProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const { youtubeVideo, handler } = useYoutubeVideo();

  useEffect(() => {
    handler(linkUrl);
  }, [linkUrl, handler]);

  useEffect(() => {
    if (youtubeVideo) {
      setThumbnailUrl(youtubeVideo.thumbnailUrl);
    }
  }, [youtubeVideo]);

  return (
    <MediaContainer>
      <MediaContent
        title={title}
        description={description}
        thumbnailUrl={thumbnailUrl ? youtubeVideo?.thumbnailUrl : ''}
        onMoreClick={() => setIsEdit(!isEdit)}
      />
      <EditBox top={0} right={13} id={id} />
    </MediaContainer>
  );
}

const MediaContainer = styled('div')`
  position: relative;
  width: 440px;
  height: 176px;
  border-radius: 16px;
  border: 1px solid #cfcfcf;
  background-color: #fff;
  padding: 24px;
  margin: 8px;
  box-shadow: 0px 1px 3px -2px rgba(0, 0, 0, 0.75);
`;
