import { useCallback, useContext, useState } from 'react';

import Modal from '@/components/Common/Modal';
import TypeSelector from '@/components/Record//TypeSelector';
import RecordListContainer from '@/components/Record/RecordListContainer';
import Template from '@/components/Template';
import { MainContext } from '@/store';

export default function Record() {
  const [templateCategory, setTemplateCategory] = useState('INTERVIEW');
  const changeListType = useCallback((type: string) => {
    setTemplateCategory(type);
  }, []);
  const { recordModalOpen, setRecordModalState, selectedTemplateTitle } =
    useContext(MainContext);

  return (
    <>
      <TypeSelector
        templateType={templateCategory}
        changeListType={changeListType}
      />
      <RecordListContainer category={templateCategory} />
      {recordModalOpen && (
        <Modal
          width={selectedTemplateTitle.length === 0 ? 700 : undefined}
          height={selectedTemplateTitle.length === 0 ? 400 : undefined}
          setIsOpen={setRecordModalState}
        >
          <Template />
        </Modal>
      )}
    </>
  );
}
