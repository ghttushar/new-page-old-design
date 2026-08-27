import { DiamondMascot } from '@/app/components/common/diamond-mascot/diamond-mascot';
import { showToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import { TOAST_MESSAGE_TYPES } from '@/enums/toast.enums';
import type { AppDispatch } from '@/redux/store';

const JIVA_TOASTS = [
  { title: 'Nailed it!', description: 'Another one bites the dust. You\'re on fire today.' },
  { title: 'Boom! Done!', description: 'Jiva approves this checkmark. Highly satisfying.' },
  { title: 'Task destroyed!', description: 'That task didn\'t stand a chance.' },
  { title: 'Absolute legend.', description: 'Completing tasks like a pro. Keep going!' },
  { title: 'Another one done!', description: 'Your productivity is inspiring even Jiva.' },
  { title: 'Crushing it!', description: 'That\'s the spirit. More where that came from.' },
  { title: 'Task? What task?', description: 'Gone. Reduced to atoms. Next!' },
  { title: 'Sparkle of approval!', description: 'Jiva sends a diamond emoji your way.' },
  { title: 'Chef\'s kiss.', description: 'Perfectly executed. Flawlessly done.' },
  { title: 'Level up!', description: 'You just gained +1 productivity XP.' },
];

let lastIndex = -1;

export function showJivaToast(dispatch: AppDispatch) {
  let idx: number;
  do {
    idx = Math.floor(Math.random() * JIVA_TOASTS.length);
  } while (idx === lastIndex && JIVA_TOASTS.length > 1);
  lastIndex = idx;

  dispatch(
    showToastMessage({
      title: JIVA_TOASTS[idx].title,
      description: JIVA_TOASTS[idx].description,
      type: TOAST_MESSAGE_TYPES.SUCCESS,
      autoClear: true,
      autoClearTime: 4000,
      customIcon: <DiamondMascot size={32} />,
    }),
  );
}
