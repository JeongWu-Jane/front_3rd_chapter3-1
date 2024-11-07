import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

import { Heading, HStack, IconButton, Select, VStack } from '@chakra-ui/react';
import { WeekView } from './WeekView';
import { Event } from '../types';
import { MonthView } from './MonthView';

interface CalendarViewProps {
  navigate: (direction: 'prev' | 'next') => void;
  view: 'week' | 'month';
  setView: React.Dispatch<React.SetStateAction<'week' | 'month'>>;
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: string[];
  holidays: { [key: string]: string };
}

export function CalendarView({
  navigate,
  view,
  holidays,
  setView,
  currentDate,
  filteredEvents,
  notifiedEvents,
}: CalendarViewProps) {
  return (
    <VStack flex={1} spacing={5} align="stretch">
      <Heading>일정 보기</Heading>

      <HStack mx="auto" justifyContent="space-between">
        <IconButton
          aria-label="Previous"
          icon={<ChevronLeftIcon />}
          onClick={() => navigate('prev')}
        />
        <Select
          aria-label="view"
          value={view}
          onChange={(e) => setView(e.target.value as 'week' | 'month')}
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
        </Select>
        <IconButton
          aria-label="Next"
          icon={<ChevronRightIcon />}
          onClick={() => navigate('next')}
        />
      </HStack>

      {view === 'week' && (
        <WeekView
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
        />
      )}
      {view === 'month' && (
        <MonthView
          currentDate={currentDate}
          holidays={holidays}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
        />
      )}
    </VStack>
  );
}
