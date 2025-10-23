import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateIcon } from '@/assets/icons';
import Icon from '@/components/common/Icon/Icon';
import { useAuthStore } from '@/stores/useAuthStore';
import Modal from '@/components/common/Modal/Modal';
import { LoginModal } from '@/components/auth';
import { PAGEHEADER_TEXTS } from '@/constants';

export const MainTypeHeader = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isLoggedIn) {
      setIsMessageModalOpen(true);
      return;
    }
    navigate('/blog/write');
  };

  const handleLoginConfirm = () => {
    setIsMessageModalOpen(false);
    setTimeout(() => {
      setIsLoginModalOpen(true);
    }, 0);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="hover:bg-gray-10 flex cursor-pointer items-center justify-center gap-1 rounded-[25px] px-3 py-2 text-sm font-normal leading-[160%] tracking-[-0.07px] text-gray"
      >
        <Icon size="lg">
          <CreateIcon />
        </Icon>
        <span>{PAGEHEADER_TEXTS.MAIN.WRITE_BUTTON}</span>
      </div>

      <Modal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        onDelete={handleLoginConfirm}
        cancelButtonText={PAGEHEADER_TEXTS.MAIN.MODAL.CANCEL}
        confirmButtonText={PAGEHEADER_TEXTS.MAIN.MODAL.GO_TO_LOGIN}
        confirmButtonVariant="primary"
      >
        <p className="text-center text-sm">{PAGEHEADER_TEXTS.MAIN.MODAL.LOGIN_REQUIRED}</p>
      </Modal>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};
