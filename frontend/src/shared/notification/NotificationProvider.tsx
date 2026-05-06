import { useCallback, useState, type ReactNode } from 'react';
import { Alert, Snackbar } from '@mui/material';
import {
  NotificationContext,
  type NotificationSeverity,
} from './notification.context';

interface Notification {
  message: string;
  severity: NotificationSeverity;
  key: number;
}

export default function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [current, setCurrent] = useState<Notification>({
    message: '',
    severity: 'info',
    key: 0,
  });
  const [open, setOpen] = useState(false);

  const notify = useCallback(
    (message: string, severity: NotificationSeverity = 'info') => {
      setCurrent({ message, severity, key: Date.now() });
      setOpen(true);
    },
    [],
  );

  const handleClose = () => setOpen(false);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <Snackbar
        key={current.key}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={current.severity}
          onClose={handleClose}
          variant="filled"
          sx={{ minWidth: 280 }}
        >
          {current.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}
