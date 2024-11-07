import { Alert, AlertIcon, AlertTitle, Box, CloseButton, VStack } from '@chakra-ui/react';
import { useNotifications } from '../hooks/useNotifications';
import { Event } from '../types';

export function Notification({ events }: { events: Event[] }) {
  const { notifications, setNotifications } = useNotifications(events);
  return (
    notifications.length > 0 && (
      <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
        {notifications.map((notification, index) => (
          <Alert key={index} status="info" variant="solid" width="auto">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
            </Box>
            <CloseButton
              onClick={() => setNotifications((prev) => prev.filter((_, i) => i !== index))}
            />
          </Alert>
        ))}
      </VStack>
    )
  );
}
