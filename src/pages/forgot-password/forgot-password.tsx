import { selectAuthError } from '@selectors';
import { requestPasswordReset, resetAuthError } from '@slices';
import { ForgotPasswordUI } from '@ui-pages';
import { useEffect, useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';
import { RESET_PASSWORD_KEY } from '@utils/constants';

export const ForgotPassword = (): React.JSX.Element => {
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorText = useSelector(selectAuthError);

  useEffect(() => {
    dispatch(resetAuthError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(requestPasswordReset({ email }))
      .unwrap()
      .then(() => {
        localStorage.setItem(RESET_PASSWORD_KEY, 'true');
        void navigate('/reset-password', { replace: true });
      })
      .catch(() => {
        /* Текст ошибки уже лежит в хранилище и выводится под формой. */
      });
  };

  return (
    <ForgotPasswordUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
