import { Event } from '../../types';
import { getFilteredEvents, containsTerm, searchEvents } from '../../utils/eventUtils';

//getFilteredEvents안에 있는 searchEvents 나 filterEventsByDateRangeAtWeek 먼저 테스트 검증을 해보고싶은데? eventUtil의 함수를 export해야하나?
//내부함수를 호출하고있는 외부 함수를 테스트 하는 것으로 간접 테스트하는 게 낫다.
// describe('containsTerm', () => {
//   it('특정 검색어가 포함되어있으면 true를 반환한다', () => {
//     //it을 작성할때 "특정 검색어가 포함되어있으면~"라고만 표현해도 되나?
//     // 아니면 구체적으로 "'회의' 검색어가 포함되어있으면~" 이라고 작성해야 맞을까 ?
//     const term = '회의';
//     const target = '팀 회의';
//     expect(containsTerm(target, term)).toBe(true);
//   });

//   it('특정 검색어가 포함되어있지 않으면 false를 반환한다', () => {
//     const term = '미팅';
//     const target = '팀 회의';
//     expect(containsTerm(target, term)).toBe(false);
//   });
// });

// describe('searchEvents', () => {
//   it('특정 단어가 포함된 이벤트가 있으면 모든 이벤트를 반환한다', () => {
//     const events: Event[] = [
//       {
//         id: '1',
//         title: '팀 회의',
//         date: '2024-11-10',
//         startTime: '09:00',
//         endTime: '10:00',
//         description: '매주 월요일에 진행되는 팀 회의',
//         location: '회의실 A',
//         category: '회의',
//         repeat: {
//           type: 'weekly',
//           interval: 1,
//           endDate: '2024-12-31',
//         },
//         notificationTime: 30,
//       },
//       {
//         id: '2',
//         title: '프로젝트 발표',
//         date: '2024-11-15',
//         startTime: '14:00',
//         endTime: '15:00',
//         description: '프로젝트 결과 발표회',
//         location: '대강당',
//         category: '발표',
//         repeat: {
//           type: 'monthly',
//           interval: 1,
//           endDate: '2025-05-15',
//         },
//         notificationTime: 60,
//       },
//     ];
//     const term = '회의';
//     expect(searchEvents(events, term)).toEqual([
//       {
//         id: '1',
//         title: '팀 회의',
//         date: '2024-11-10',
//         startTime: '09:00',
//         endTime: '10:00',
//         description: '매주 월요일에 진행되는 팀 회의',
//         location: '회의실 A',
//         category: '회의',
//         repeat: {
//           type: 'weekly',
//           interval: 1,
//           endDate: '2024-12-31',
//         },
//         notificationTime: 30,
//       },
//     ]);
//   });

//   it('특정 단어가 포함된 이벤트가 없으면 빈 배열을 반환한다', () => {
//     const events: Event[] = [
//       {
//         id: '1',
//         title: '팀 회의',
//         date: '2024-11-10',
//         startTime: '09:00',
//         endTime: '10:00',
//         description: '매주 월요일에 진행되는 팀 회의',
//         location: '회의실 A',
//         category: '회의',
//         repeat: {
//           type: 'weekly',
//           interval: 1,
//           endDate: '2024-12-31',
//         },
//         notificationTime: 30,
//       },
//       {
//         id: '2',
//         title: '프로젝트 발표',
//         date: '2024-11-15',
//         startTime: '14:00',
//         endTime: '15:00',
//         description: '프로젝트 결과 발표회',
//         location: '대강당',
//         category: '발표',
//         repeat: {
//           type: 'monthly',
//           interval: 1,
//           endDate: '2025-05-15',
//         },
//         notificationTime: 60,
//       },
//     ];
//     const term = '테스트';
//     expect(searchEvents(events, term)).toEqual([]);
//   });
// });

describe('getFilteredEvents', () => {
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
  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const filteredEvents = getFilteredEvents(events, '이벤트 2', new Date('2024-11-01'), 'month');
    expect(filteredEvents).toEqual([
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

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const filteredEvents = getFilteredEvents(events, '', new Date('2024-07-01'), 'week');
    expect(filteredEvents).toEqual([
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
    ]);
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const filteredEvents = getFilteredEvents(events, '', new Date('2024-07-01'), 'month');
    expect(filteredEvents).toEqual([
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
    ]);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const filteredEvents = getFilteredEvents(events, '이벤트', new Date('2024-07-01'), 'week');
    expect(filteredEvents).toEqual([]);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const filteredEvents = getFilteredEvents(events, '', new Date('2024-07-01'), 'week');
    expect(filteredEvents).toEqual([
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
    ]);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const filteredEvents = getFilteredEvents(events, 'AA', new Date('2024-11-01'), 'month');
    expect(filteredEvents).toEqual([
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
    ]);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const filteredEvents = getFilteredEvents(events, '이벤트 2', new Date('2024-11-02'), 'month');
    expect(filteredEvents).toEqual([
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

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const events: Event[] = [];
    const searchTerm = '';
    const currentDate = new Date('2024-07-01');
    const view = 'week';

    const result = getFilteredEvents(events, searchTerm, currentDate, view);

    expect(result).toEqual([]);
  });
});
