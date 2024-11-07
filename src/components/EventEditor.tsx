import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { RepeatType, Event } from '../types';
import { categories, notificationOptions } from '../const';
import { getTimeErrorMessage } from '../utils/timeValidation';

interface EventEditorProps {
  editingEvent: Event | null;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  startTimeError: string | null;
  startTime: string;
  handleStartTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  endTime: string;
  endTimeError: string | null;
  handleEndTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  isRepeating: boolean;
  setIsRepeating: React.Dispatch<React.SetStateAction<boolean>>;
  notificationTime: number;
  setNotificationTime: React.Dispatch<React.SetStateAction<number>>;
  repeatType: RepeatType;
  setRepeatType: React.Dispatch<React.SetStateAction<RepeatType>>;
  repeatInterval: number;
  setRepeatInterval: React.Dispatch<React.SetStateAction<number>>;
  repeatEndDate: string;
  setRepeatEndDate: React.Dispatch<React.SetStateAction<string>>;
  addOrUpdateEvent: () => Promise<void>;
}

export function EventEditor({
  editingEvent,
  title,
  setTitle,
  date,
  setDate,
  startTimeError,
  startTime,
  handleStartTimeChange,
  endTime,
  endTimeError,
  handleEndTimeChange,
  description,
  setDescription,
  location,
  setLocation,
  category,
  setCategory,
  isRepeating,
  setIsRepeating,
  notificationTime,
  setNotificationTime,
  repeatType,
  setRepeatType,
  repeatInterval,
  setRepeatInterval,
  repeatEndDate,
  setRepeatEndDate,
  addOrUpdateEvent,
}: EventEditorProps) {
  return (
    <VStack w="400px" spacing={5} align="stretch">
      <Heading>{editingEvent ? '일정 수정' : '일정 추가'}</Heading>

      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>날짜</FormLabel>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </FormControl>

      <HStack width="100%">
        <FormControl>
          <FormLabel>시작 시간</FormLabel>
          <Tooltip label={startTimeError} isOpen={!!startTimeError} placement="top">
            <Input
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              onBlur={() => getTimeErrorMessage(startTime, endTime)}
              isInvalid={!!startTimeError}
            />
          </Tooltip>
        </FormControl>
        <FormControl>
          <FormLabel>종료 시간</FormLabel>
          <Tooltip label={endTimeError} isOpen={!!endTimeError} placement="top">
            <Input
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              onBlur={() => getTimeErrorMessage(startTime, endTime)}
              isInvalid={!!endTimeError}
            />
          </Tooltip>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>설명</FormLabel>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>위치</FormLabel>
        <Input value={location} onChange={(e) => setLocation(e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>카테고리</FormLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">카테고리 선택</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>반복 설정</FormLabel>
        <Checkbox isChecked={isRepeating} onChange={(e) => setIsRepeating(e.target.checked)}>
          반복 일정
        </Checkbox>
      </FormControl>

      <FormControl>
        <FormLabel>알림 설정</FormLabel>
        <Select
          value={notificationTime}
          onChange={(e) => setNotificationTime(Number(e.target.value))}
        >
          {notificationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>

      {isRepeating && (
        <VStack width="100%">
          <FormControl>
            <FormLabel>반복 유형</FormLabel>
            <Select
              value={repeatType}
              onChange={(e) => setRepeatType(e.target.value as RepeatType)}
            >
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
              <option value="monthly">매월</option>
              <option value="yearly">매년</option>
            </Select>
          </FormControl>
          <HStack width="100%">
            <FormControl>
              <FormLabel>반복 간격</FormLabel>
              <Input
                type="number"
                value={repeatInterval}
                onChange={(e) => setRepeatInterval(Number(e.target.value))}
                min={1}
              />
            </FormControl>
            <FormControl>
              <FormLabel>반복 종료일</FormLabel>
              <Input
                type="date"
                value={repeatEndDate}
                onChange={(e) => setRepeatEndDate(e.target.value)}
              />
            </FormControl>
          </HStack>
        </VStack>
      )}

      <Button data-testid="event-submit-button" onClick={addOrUpdateEvent} colorScheme="blue">
        {editingEvent ? '일정 수정' : '일정 추가'}
      </Button>
    </VStack>
  );
}
