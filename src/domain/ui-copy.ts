import type { PartySize, TimeTag } from '@/src/domain/menu-types';
import { getIntensityBand } from '@/src/domain/menu-recommender';

export function getHomeHeroState({
  countdown,
  liveIntensity,
  shakeStatus,
  readyForCountdown,
  warning,
  limitMessage,
}: {
  countdown: number | null;
  liveIntensity: number;
  shakeStatus: 'idle' | 'active' | 'ended' | 'unsupported';
  readyForCountdown: boolean;
  warning: string | null;
  limitMessage: string | null;
}) {
  if (limitMessage) {
    return {
      badge: '오늘 제한 도달',
      emoji: '🛑',
      title: '오늘은 충분히 흔들었어요',
      body: limitMessage,
    };
  }

  if (warning) {
    return {
      badge: '센서 안내',
      emoji: '📳',
      title: '센서를 확인해 주세요',
      body: warning,
    };
  }

  if (countdown !== null) {
    return {
      badge: '메뉴 결정 중',
      emoji: '🎯',
      title: `${countdown}`,
      body: '곧 오늘의 메뉴가 정해집니다.',
    };
  }

  if (shakeStatus === 'ended' && !readyForCountdown) {
    return {
      badge: '조금 부족해요',
      emoji: '💨',
      title: '한 번만 더 흔들어!',
      body: '조금 더 세게 흔들면 메뉴를 확정할 수 있어요.',
    };
  }

  if (shakeStatus === 'active' && liveIntensity >= 45) {
    return {
      badge: '강하게 감지 중',
      emoji: '🔥',
      title: '좋아, 지금 느낌 왔어',
      body: '이 정도면 꽤 푸짐한 메뉴가 나올 가능성이 높아요.',
    };
  }

  if (shakeStatus === 'active') {
    return {
      badge: '측정 대기 중',
      emoji: '🍜',
      title: '폰을 흔들어!',
      body: '살살 흔들면 가볍게, 세게 흔들면 푸짐하게 나옵니다.',
    };
  }

  return {
    badge: '준비 완료',
    emoji: '🍚',
    title: '오늘 뭐 먹을까?',
    body: '폰을 흔들면 오늘 메뉴를 바로 정해드릴게요.',
  };
}

export function buildRecommendationReason({
  intensityPercent,
  partySize,
  timeTag,
}: {
  intensityPercent: number;
  partySize: PartySize;
  timeTag: TimeTag;
}) {
  const intensityLabel = {
    light: '가볍게 흔들어서',
    medium: '적당히 흔들어서',
    heavy: '세게 흔들어서',
  }[getIntensityBand(intensityPercent)];

  const partyLabel = {
    solo: '혼밥 기준',
    duo: '2인 기준',
    group: '같이 먹기 좋은 기준',
  }[partySize];

  const timeLabel = {
    breakfast: '아침 타이밍에 맞는',
    lunch: '점심에 잘 맞는',
    dinner: '저녁에 잘 맞는',
    'late-night': '야식으로 끌리는',
  }[timeTag];

  return `${intensityLabel} ${partyLabel}, ${timeLabel} 메뉴가 골라졌어요.`;
}

export function buildIntentRecommendationReason({
  intentLabel,
  partyLabel,
  timeLabel,
}: {
  intentLabel: string;
  partyLabel: string;
  timeLabel: string;
}) {
  return `${intentLabel} 모드에서 ${partyLabel} 기준, ${timeLabel}에 어울리는 메뉴를 랜덤으로 골랐어요.`;
}

export function getBattleStageState(stage: 'intro' | 'player1' | 'player1-ready' | 'player2' | 'complete') {
  switch (stage) {
    case 'intro':
      return {
        badge: '배틀 준비',
        title: '한 대의 폰으로 번갈아 흔들기',
        body: '1P가 먼저 흔들고, 그다음 2P가 도전합니다.',
      };
    case 'player1':
      return {
        badge: '1P 차례',
        title: '1P가 지금 흔드는 중',
        body: '가장 높은 강도를 기록하면 점수가 저장됩니다.',
      };
    case 'player1-ready':
      return {
        badge: '1P 완료',
        title: '이제 2P 차례예요',
        body: '폰을 넘기고 더 세게 흔들어 보세요.',
      };
    case 'player2':
      return {
        badge: '2P 차례',
        title: '2P가 역전할 수 있을까?',
        body: '지금 점수를 넘기면 오늘 메뉴를 가져갑니다.',
      };
    case 'complete':
      return {
        badge: '결과 발표',
        title: '승부가 났어요',
        body: '가장 세게 흔든 사람의 메뉴로 오늘 식사를 정합니다.',
      };
  }
}
