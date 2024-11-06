import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents', () => {
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
    {
      id: '3',
      title: '점심 회식 aa',
      date: '2024-11-20',
      startTime: '12:00',
      endTime: '13:00',
      description: '부서 연말 점심 회식',
      location: '레스토랑 B',
      category: '사교',
      repeat: {
        type: 'monthly',
        interval: 1,
        endDate: '2025-12-20',
      },
      notificationTime: 120,
    },
    {
      id: '4',
      title: '개인 프로젝트 마감일',
      date: '2024-07-05',
      startTime: '09:00',
      endTime: '23:59',
      description: '개인 프로젝트 제출 마감일',
      location: '온라인',
      category: '개인',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 1440,
    },
  ];
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const now = new Date('2024-11-30T08:30');
    const notifiedEvents: string[] = [];
    const result = getUpcomingEvents(events, now, notifiedEvents);
    expect(result).toEqual([
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

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const now = new Date('2024-11-30T09:00');
    const notifiedEvents = ['1'];
    const result = getUpcomingEvents(events, now, notifiedEvents);
    expect(result).toEqual([]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-11-30T09:00');
    const notifiedEvents = ['1'];
    const result = getUpcomingEvents(events, now, notifiedEvents);
    expect(result).toEqual([]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-11-30T09:00');
    const notifiedEvents = ['1'];
    const result = getUpcomingEvents(events, now, notifiedEvents);
    expect(result).toEqual([]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const event: Event = {
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
    };
    expect(createNotificationMessage(event)).toBe('30분 후 이벤트 2 일정이 시작됩니다.');
  });
});
