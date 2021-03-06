import React from 'react';
import { Snackbar, Avatar } from '@vkontakte/vkui';
import { Icon16ErrorCircleFill } from '@vkontakte/icons';


const SnackbarError = ({ setSnackbarError, ...props }) => (
  <Snackbar
    duration={4000}
    onClose={() => setSnackbarError(null)}
    before={<Avatar size={24} style={{ background: 'var(--accent)' }}><Icon16ErrorCircleFill width={24} height={24} /></Avatar>}
  >
    {props.children}
  </Snackbar>
);

export default SnackbarError;