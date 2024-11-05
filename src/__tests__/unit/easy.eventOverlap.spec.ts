import { Event, EventForm } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const date = '2024-07-01';
    const time = '14:30';
    const result = parseDateTime(date, time);
    const expected = new Date('2024-07-01T14:30');

    expect(result.toISOString()).toBe(expected.toISOString());
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    //toISOString()을 호출하면 에러가 발생하기 때문에, Invalid Date를 확인할 때는 toString()을 사용하는 것이 안전
    const date = '2024-13-40';
    const time = '14:30';
    const result = parseDateTime(date, time);
    expect(result.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const date = '2024-07-01';
    const time = '25:61';
    const result = parseDateTime(date, time);
    expect(result.toString()).toBe('Invalid Date');
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const date = '';
    const time = '14:30';
    const result = parseDateTime(date, time);
    expect(result.toString()).toBe('Invalid Date');
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const event: EventForm = {
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    const result = convertEventToDateRange(event);
    const expectedStart = new Date('2024-10-15T09:00');
    const expectedEnd = new Date('2024-10-15T10:00');
    expect(result).toEqual({
      start: expectedStart,
      end: expectedEnd,
    });
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event: EventForm = {
      title: '기존 회의',
      date: '2024-13-40',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    const result = convertEventToDateRange(event);

    //expect를 두개를 나눠서 해야할까 한번에 합쳐서 해야할까?
    //expect(result.start.toString()).toBe('Invalid Date');
    //expect(result.end.toString()).toBe('Invalid Date');
    expect({
      start: result.start.toString(),
      end: result.end.toString(),
    }).toEqual({
      start: 'Invalid Date',
      end: 'Invalid Date',
    });
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event: EventForm = {
      title: '기존 회의',
      date: '2024-13-40',
      startTime: '09:00',
      endTime: '25:61',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    const result = convertEventToDateRange(event);
    expect({
      start: result.start.toString(),
      end: result.end.toString(),
    }).toEqual({
      start: 'Invalid Date',
      end: 'Invalid Date',
    });
  });
});

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    const event1: EventForm = {
      title: '기존 회의',
      date: '2024-11-06',
      startTime: '09:00',
      endTime: '22:10',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    const event2: EventForm = {
      title: '기존 회의',
      date: '2024-11-06',
      startTime: '09:00',
      endTime: '22:10',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    const result = isOverlapping(event1, event2);
    expect(result).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const event1: EventForm = {
      title: '기존 회의',
      date: '2024-11-06',
      startTime: '09:00',
      endTime: '22:10',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    const event2: EventForm = {
      title: '개인 프로젝트 마감일',
      date: '2024-11-07',
      startTime: '09:00',
      endTime: '22:10',
      description: '개인 프로젝트 제출 마감일',
      location: '온라인',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    const result = isOverlapping(event1, event2);
    expect(result).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const events: Event[] = [
      {
        id: '1',
        title: '팀 회의',
        date: '2024-11-10',
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
        title: '프로젝트 발표',
        date: '2024-11-15',
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
        title: '점심 회식',
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
        date: '2024-12-01',
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

    const newEvent: EventForm = {
      title: '개인 프로젝트 마감일',
      date: '2024-12-01',
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
    };

    const result = findOverlappingEvents(newEvent, events);

    expect(result).toEqual([
      {
        id: '4',
        title: '개인 프로젝트 마감일',
        date: '2024-12-01',
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
    ]);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const events: Event[] = [
      {
        id: '1',
        title: '팀 회의',
        date: '2024-11-10',
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
        title: '프로젝트 발표',
        date: '2024-11-15',
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
        title: '점심 회식',
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
        date: '2024-12-01',
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
    const newEvent: EventForm = {
      title: '개인 프로젝트 마감일',
      date: '2024-11-07',
      startTime: '09:00',
      endTime: '22:10',
      description: '개인 프로젝트 제출 마감일',
      location: '온라인',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    const result = findOverlappingEvents(newEvent, events);
    expect(result).toEqual([]);
  });
});
