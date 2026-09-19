import { useEffect, useRef } from 'react';

interface UseModalAccessibilityOptions {
  isOpen: boolean;
  onClose: () => void;
  modalRef: React.RefObject<HTMLElement | null>;
  closeOnEscape?: boolean;
}

/**
 * Accessible modal helper:
 * 1. Traps focus within modal while open
 * 2. Restores focus to the previously focused element upon close
 * 3. Listens for Escape key to close modal
 * 4. Automatically focuses the first focusable element or close button upon open
 */
export function useModalAccessibility({
  isOpen,
  onClose,
  modalRef,
  closeOnEscape = true,
}: UseModalAccessibilityOptions) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save previous focus
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // Focus first focusable element inside modal
    const focusTimer = setTimeout(() => {
      if (!modalRef.current) return;
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        modalRef.current.focus();
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown, true);

      // Restore focus
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        try {
          previousFocusRef.current.focus();
        } catch {
          // Ignore if previous element is unmounted
        }
      }
    };
  }, [isOpen, onClose, modalRef, closeOnEscape]);
}
