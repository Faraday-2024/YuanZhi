
import { useEffect, useRef } from 'react';

const DESKTOP_VIEWPORT_CONTENT = 'width=1280';

/**
 * A hook to manage the viewport meta tag.
 * This is used in ExplorationMode to force a desktop-like layout on mobile devices.
 * @param {boolean} force - Whether to force the desktop viewport.
 */
const useViewportManager = (force: boolean) => {
  const originalContentRef = useRef<string | null>(null);

  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return;

    // Store the original content only once
    if (originalContentRef.current === null) {
      originalContentRef.current = viewport.getAttribute('content');
    }

    if (force) {
      viewport.setAttribute('content', DESKTOP_VIEWPORT_CONTENT);
    } else {
      // Restore original content if it exists
      if (originalContentRef.current) {
        viewport.setAttribute('content', originalContentRef.current);
      }
    }

    // Cleanup function to restore the original viewport on component unmount
    return () => {
      if (originalContentRef.current) {
        viewport.setAttribute('content', originalContentRef.current);
      }
    };
  }, [force]);
};

export default useViewportManager;
