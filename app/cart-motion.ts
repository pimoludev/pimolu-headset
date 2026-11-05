type FrameScheduler = {
  requestFrame: (callback: FrameRequestCallback) => number;
  cancelFrame: (id: number) => void;
};

const browserScheduler: FrameScheduler = {
  requestFrame: (callback) => window.requestAnimationFrame(callback),
  cancelFrame: (id) => window.cancelAnimationFrame(id),
};

export function prepareCartEntrance(
  panel: HTMLElement,
  reducedMotion: boolean,
  scheduler: FrameScheduler = browserScheduler,
) {
  // Stop Pimolu's mount-time focus from scrolling a moving panel into view.
  panel.inert = true;
  let cancelled = false;
  let secondFrame = 0;
  const reveal = () => {
    if (cancelled || !panel.isConnected) return;
    panel.inert = false;
    panel.dataset.motionReady = "true";
    panel.focus({ preventScroll: true });
  };
  const firstFrame = scheduler.requestFrame(() => {
    if (reducedMotion) {
      reveal();
    } else {
      // Mounting, scroll locking and image setup finish before the slide starts.
      secondFrame = scheduler.requestFrame(reveal);
    }
  });

  return () => {
    cancelled = true;
    scheduler.cancelFrame(firstFrame);
    scheduler.cancelFrame(secondFrame);
    panel.inert = false;
    delete panel.dataset.motionReady;
  };
}
