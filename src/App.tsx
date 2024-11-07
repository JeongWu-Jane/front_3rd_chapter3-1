import { Box, Flex } from '@chakra-ui/react';
import { useState } from 'react';

import { useCalendarView } from './hooks/useCalendarView.ts';
import { useEventForm } from './hooks/useEventForm.ts';
import { useEventOperations } from './hooks/useEventOperations.ts';
import { useNotifications } from './hooks/useNotifications.ts';
import { useSearch } from './hooks/useSearch.ts';
import { Event } from './types';
import { CalendarView } from './components/CalendarView.tsx';
import { EventSearch } from './components/EventSearch.tsx';
import { Notification } from './components/Notification.tsx';
import { EventEditor } from './components/EventEditor.tsx';
import { EventAlert } from './components/EventAlert.tsx';

function App() {
  const {
    title,
    date,
    startTime,
    endTime,
    description,
    location,
    category,
    isRepeating,
    repeatType,
    repeatInterval,
    repeatEndDate,
    notificationTime,
    editingEvent,
    setEditingEvent,
    editEvent,
  } = useEventForm();

  const { events, saveEvent, deleteEvent } = useEventOperations(Boolean(editingEvent), () =>
    setEditingEvent(null)
  );

  const { notifiedEvents } = useNotifications(events);
  const { view, currentDate } = useCalendarView();

  const { searchTerm, filteredEvents } = useSearch(events, currentDate, view);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <EventEditor
          events={events}
          setOverlappingEvents={setOverlappingEvents}
          saveEvent={saveEvent}
          setIsOverlapDialogOpen={setIsOverlapDialogOpen}
        />

        <CalendarView filteredEvents={filteredEvents} notifiedEvents={notifiedEvents} />

        <EventSearch
          events={events}
          currentDate={currentDate}
          view={view}
          searchTerm={searchTerm}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          editEvent={editEvent}
          deleteEvent={deleteEvent}
        />
      </Flex>

      <EventAlert
        isOverlapDialogOpen={isOverlapDialogOpen}
        setIsOverlapDialogOpen={setIsOverlapDialogOpen}
        overlappingEvents={overlappingEvents}
        saveEvent={saveEvent}
        editingEvent={editingEvent}
        title={title}
        date={date}
        startTime={startTime}
        endTime={endTime}
        description={description}
        location={location}
        category={category}
        isRepeating={isRepeating}
        repeatType={repeatType}
        repeatInterval={repeatInterval}
        repeatEndDate={repeatEndDate}
        notificationTime={notificationTime}
      />

      <Notification events={events} />
    </Box>
  );
}

export default App;
