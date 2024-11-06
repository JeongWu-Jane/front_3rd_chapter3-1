import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const events: Event[] = [
    {
      id: '1',
      title: '이벤트 2',
      date: '2024-11-30',
      startTime: '09:00',
      endTime: '10:00',
      description: '매주 월요일에 진행되는 팀 회의',
      location: '회의실 A',
      category: '회의',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2024-12-31',
      },
      notificationTime: 30,
    },
    {
      id: '2',
      title: '이벤트 3',
      date: '2024-11-05',
      startTime: '14:00',
      endTime: '15:00',
      description: '프로젝트 결과 발표회',
      location: '대강당',
      category: '발표',
      repeat: {
        type: 'monthly',
        interval: 1,
        endDate: '2025-05-15',
      },
      notificationTime: 60,
    },
  ];
  const currentDate = new Date('2024-11-30');
  const { result } = renderHook(() => useSearch(events, currentDate, 'month'));
  expect(result.current.filteredEvents).toEqual([
    {
      id: '1',
      title: '이벤트 2',
      date: '2024-11-30',
      startTime: '09:00',
      endTime: '10:00',
      description: '매주 월요일에 진행되는 팀 회의',
      location: '회의실 A',
      category: '회의',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2024-12-31',
      },
      notificationTime: 30,
    },
    {
      id: '2',
      title: '이벤트 3',
      date: '2024-11-05',
      startTime: '14:00',
      endTime: '15:00',
      description: '프로젝트 결과 발표회',
      location: '대강당',
      category: '발표',
      repeat: {
        type: 'monthly',
        interval: 1,
        endDate: '2025-05-15',
      },
      notificationTime: 60,
    },
  ]);
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
  //밑에 테스트 케이스와 중복되는 것 같다! 지워도 되지않을까..?
  const events: Event[] = [
    {
      id: '1',
      title: '이벤트 2',
      date: '2024-11-30',
      startTime: '09:00',
      endTime: '10:00',
      description: '매주 월요일에 진행되는 팀 회의',
      location: '회의실 A',
      category: '회의',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2024-12-31',
      },
      notificationTime: 30,
    },
    {
      id: '2',
      title: '이벤트 3',
      date: '2024-11-05',
      startTime: '14:00',
      endTime: '15:00',
      description: '프로젝트 결과 발표회',
      location: '대강당',
      category: '발표',
      repeat: {
        type: 'monthly',
        interval: 1,
        endDate: '2025-05-15',
      },
      notificationTime: 60,
    },
  ];
  const currentDate = new Date('2024-11-30');
  const { result } = renderHook(() => useSearch(events, currentDate, 'week'));
  act(() => {
    result.current.setSearchTerm('회의');
  });
  expect(result.current.filteredEvents).toEqual([
    {
      id: '1',
      title: '이벤트 2',
      date: '2024-11-30',
      startTime: '09:00',
      endTime: '10:00',
      description: '매주 월요일에 진행되는 팀 회의',
      location: '회의실 A',
      category: '회의',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2024-12-31',
      },
      notificationTime: 30,
    },
  ]);
});

it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
  const events: Event[] = [
    {
      id: '1',
      title: '이벤트 2',
      date: '2024-11-30',
      startTime: '09:00',
      endTime: '10:00',
      description: '매주 월요일에 진행되는 팀 회의',
      location: '회의실 A',
      category: '회의',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2024-12-31',
      },
      notificationTime: 30,
    },
    {
      id: '2',
      title: '이벤트 3',
      date: '2024-11-05',
      startTime: '14:00',
      endTime: '15:00',
      description: '프로젝트 결과 발표회',
      location: '대강당',
      category: '발표',
      repeat: {
        type: 'monthly',
        interval: 1,
        endDate: '2025-05-15',
      },
      notificationTime: 60,
    },
  ];
  const currentDate = new Date('2024-11-30');
  const { result } = renderHook(() => useSearch(events, currentDate, 'week'));
  act(() => {
    result.current.setSearchTerm('회의');
  });
  expect(result.current.filteredEvents).toEqual([
    {
      id: '1',
      title: '이벤트 2',
      date: '2024-11-30',
      startTime: '09:00',
      endTime: '10:00',
      description: '매주 월요일에 진행되는 팀 회의',
      location: '회의실 A',
      category: '회의',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2024-12-31',
      },
      notificationTime: 30,
    },
  ]);
});

it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
  const events: Event[] = [
    {
      id: '1',
      title: '이벤트 2',
      date: '2024-11-30',
      startTime: '09:00',
      endTime: '10:00',
      description: '매주 월요일에 진행되는 팀 회의',
      location: '회의실 A',
      category: '회의',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2024-12-31',
      },
      notificationTime: 30,
    },
    {
      id: '2',
      title: '이벤트 3',
      date: '2024-11-05',
      startTime: '14:00',
      endTime: '15:00',
      description: '프로젝트 결과 발표회',
      location: '대강당',
      category: '발표',
      repeat: {
        type: 'monthly',
        interval: 1,
        endDate: '2025-05-15',
      },
      notificationTime: 60,
    },
  ];
  const currentDate = new Date('2024-11-01');
  const { result } = renderHook(() => useSearch(events, currentDate, 'month'));
  act(() => {
    result.current.setSearchTerm('회의');
  });
  expect(result.current.filteredEvents).toEqual([
    {
      id: '1',
      title: '이벤트 2',
      date: '2024-11-30',
      startTime: '09:00',
      endTime: '10:00',
      description: '매주 월요일에 진행되는 팀 회의',
      location: '회의실 A',
      category: '회의',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2024-12-31',
      },
      notificationTime: 30,
    },
  ]);
});

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
  const events: Event[] = [
    {
      id: '1',
      title: '이벤트 2',
      date: '2024-11-30',
      startTime: '09:00',
      endTime: '10:00',
      description: '매주 월요일에 진행되는 팀 회의',
      location: '회의실 A',
      category: '회의',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2024-12-31',
      },
      notificationTime: 30,
    },
    {
      id: '2',
      title: '이벤트 3',
      date: '2024-11-05',
      startTime: '14:00',
      endTime: '15:00',
      description: '프로젝트 결과 발표회',
      location: '대강당',
      category: '발표',
      repeat: {
        type: 'monthly',
        interval: 1,
        endDate: '2025-05-15',
      },
      notificationTime: 60,
    },
  ];
  const currentDate = new Date('2024-11-30');
  const { result } = renderHook(() => useSearch(events, currentDate, 'week'));
  act(() => {
    result.current.setSearchTerm('회의');
  });
  act(() => {
    result.current.setSearchTerm('점심');
  });
  expect(result.current.filteredEvents).toEqual([]);
});
