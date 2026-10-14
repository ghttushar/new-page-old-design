import { useEffect } from 'react';

/**
 * While a modal panel is open the page behind it is frozen: it cannot scroll (so no second scrollbar shows next to the
 * panel's own), cannot be clicked, and cannot be reached with the keyboard. The page keeps its width, so nothing shifts.
 */
export default function useModalLock(active: boolean, appRootId = 'root') {
  useEffect(() => {
    if (!active) return undefined;
    const { body, documentElement: html } = document;
    const previous = { bodyOverflow: body.style.overflow, bodyPadding: body.style.paddingRight, htmlOverflow: html.style.overflow };

    // The page's scrollbar goes away, so its width is added back as padding to keep the layout where it was.
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    // The panel is rendered outside the app root, so it stays usable while everything inside the root is inert.
    const appRoot = document.getElementById(appRootId);
    appRoot?.setAttribute('inert', '');

    return () => {
      body.style.overflow = previous.bodyOverflow;
      body.style.paddingRight = previous.bodyPadding;
      html.style.overflow = previous.htmlOverflow;
      appRoot?.removeAttribute('inert');
    };
  }, [active, appRootId]);
}
