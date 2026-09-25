import { selectAuthError } from '@selectors';
import { resetAuthError, resetPassword } from '@slices';
import { ResetPasswordUI } from '@ui-pages';
import { useEffect, useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';
import { RESET_PASSWORD_KEY } from '@utils/constants';

export const ResetPassword = (): React.JSX.Element => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorText = useSelector(selectAuthError);

  useEffect(() => {
    dispatch(resetAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (!localStorage.getItem(RESET_PASSWORD_KEY)) {
      void navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(resetPassword({ password, token }))
      .unwrap()
      .then(() => {
        localStorage.removeItem(RESET_PASSWORD_KEY);
        void navigate('/login');
      })
      .catch(() => {
        /* Текст ошибки уже лежит в хранилище и выводится под формой. */
      });
  };

  return (
    <ResetPasswordUI
      errorText={errorText}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
