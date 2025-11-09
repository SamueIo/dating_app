import { ref, reactive } from "vue";

/**
 * Composable to manage draggable chat bubbles, including drag start, movement, and drop logic.
 * Handles dragging inside the window bounds and interaction with a "trash" area for deletion.
 * 
 * @param {Ref} trashRef - Vue ref to the trash container element.
 * @param {Object} bubbleRefs - Object mapping bubble IDs to their DOM elements.
 * @param {Object} positions - Reactive object storing current x/y positions for each bubble by ID.
 * @param {Function} emit - Vue emit function for sending events to the parent component.
 * @param {Function} closeBubble - Function to close a bubble given its ID.
 * 
 * @returns {Object} - Contains reactive states and drag event handlers:
 *  - onDragStart: Function to call when a bubble drag starts.
 *  - onDragMove: Function to call during bubble dragging.
 *  - onDragEnd: Function to call when dragging ends.
 *  - positions: Reactive object with current bubble positions.
 *  - bubbleInTrash: Ref indicating whether the currently dragged bubble is in the trash zone.
 *  - showTrash: Ref indicating whether the trash icon should be shown.
 *  - currentDraggingId: Ref storing the ID of the currently dragged bubble.
 *  - isDragging: Ref indicating whether any bubble is currently being dragged.
 */
export function useDraggableBubbles(trashRef, bubbleRefs, positions, emit, closeBubble) {
    const isDragging = ref(false);             // True while a bubble is being dragged
    const currentDraggingId = ref(null);       // ID of the currently dragged bubble
    const bubbleInTrash = ref(false);          // True if bubble is over the trash area
    const showTrash = ref(false);              // Controls visibility of the trash area
    const lockBounds = ref(null);              // Optional bounds to lock bubble position
    let hasMoved = false;                      // Tracks if the bubble has actually moved
    let dragStart = { x: 0, y: 0 };           // Mouse/touch position at drag start
    let elementStart = { x: 0, y: 0 };        // Bubble position at drag start
    let pointerOffset = { x: 0, y: 0 };       // Offset between pointer and bubble top-left
    let wasInTrash = false;                    // Tracks whether bubble was in trash previously

    /**
     * Returns the bounding rectangle of the trash container.
     */
    function getTrashRect() {
      return trashRef.value?.$el?.getBoundingClientRect() || null;
    }

    /**
     * Handles the start of dragging for a bubble.
     * Initializes positions, offsets, and adds global event listeners.
     */
    function onDragStart(id, event) {
        currentDraggingId.value = id;
        showTrash.value = true;
        hasMoved = false;
        emit('drag-start', id);

        isDragging.value = true;

        const e = event.type.startsWith('touch') ? event.touches[0] : event;

        dragStart.x = e.clientX;
        dragStart.y = e.clientY;

        elementStart.x = positions[id]?.x || 0;
        elementStart.y = positions[id]?.y || 0;

        pointerOffset = {
            x: e.clientX - elementStart.x,
            y: e.clientY - elementStart.y
        };

        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragEnd);
        window.addEventListener('touchmove', onDragMove, { passive: false });
        window.addEventListener('touchend', onDragEnd);
    }

    /**
     * Handles dragging movement.
     * Updates bubble position and checks if it's over the trash area.
     */
    function onDragMove(event) {
        if (!isDragging.value) return;

        hasMoved = true;

        if (event.cancelable) event.preventDefault();

        const e = event.type.startsWith('touch') ? event.touches[0] : event;
        const clientX = e.clientX;
        const clientY = e.clientY;

        const trashRect = getTrashRect();
        if (!trashRect) return;

        const TRASH_PADDING = 5;
        const isNearBottom = clientY > window.innerHeight * 0.66;

        const pointerInTrashZone =
            isNearBottom &&
            clientX >= trashRect.left - TRASH_PADDING &&
            clientX <= trashRect.right + TRASH_PADDING &&
            clientY >= trashRect.top - TRASH_PADDING &&
            clientY <= trashRect.bottom + TRASH_PADDING;

        bubbleInTrash.value = pointerInTrashZone;

        if (pointerInTrashZone && !wasInTrash) {
            wasInTrash = true;
            
            const bubbleEl = bubbleRefs[currentDraggingId.value];
            let bubbleWidth = 80;
            let bubbleHeight = 80;
            
            if (bubbleEl) {
              const rect = bubbleEl.getBoundingClientRect();
              bubbleWidth = rect.width;
              bubbleHeight = rect.height;
            }
      
            const centerX = trashRect.left + trashRect.width / 2 - bubbleWidth / 2;
            const centerY = trashRect.top + trashRect.height / 2 - bubbleHeight / 2;
            
            positions[currentDraggingId.value] = { x: centerX, y: centerY };
            
            lockBounds.value = {
              minX: centerX,
              maxX: centerX,
              minY: centerY,
              maxY: centerY,
            };
        } else if (!pointerInTrashZone && wasInTrash) {
          wasInTrash = false;
          lockBounds.value = null;
          updatePosition(clientX, clientY);
        } else {
          updatePosition(clientX, clientY);
        }
    } 
    
    /**
     * Updates the position of the currently dragged bubble, respecting lock bounds and window limits.
     */
    function updatePosition(clientX, clientY) {
      const maxX = window.innerWidth - 55;
      const maxY = window.innerHeight - 120;

      if (
        lockBounds.value &&
        lockBounds.value.minX === lockBounds.value.maxX &&
        lockBounds.value.minY === lockBounds.value.maxY
      ) {
        positions[currentDraggingId.value] = { x: lockBounds.value.minX, y: lockBounds.value.minY };
        return;
      }

      let newX = clientX - pointerOffset.x;
      let newY = clientY - pointerOffset.y;

      if (lockBounds.value) {
        newX = Math.max(lockBounds.value.minX, Math.min(newX, lockBounds.value.maxX));
        newY = Math.max(lockBounds.value.minY, Math.min(newY, lockBounds.value.maxY));
      } else {
        newX = Math.min(Math.max(newX, 0), maxX);
        newY = Math.min(Math.max(newY, 0), maxY);
      }

      positions[currentDraggingId.value] = { x: newX, y: newY };
    }

    /**
     * Handles the end of dragging. Cleans up event listeners and resets states.
     */
    function onDragEnd() {
        if (!isDragging.value) return;

        isDragging.value = false;

        if (hasMoved && bubbleInTrash.value) {
          closeBubble(currentDraggingId.value);
        }
    
        showTrash.value = false;
        bubbleInTrash.value = false;
        wasInTrash = false;
        currentDraggingId.value = null;
    
        lockBounds.value = null;   
    
        window.removeEventListener('mousemove', onDragMove);
        window.removeEventListener('mouseup', onDragEnd);
        window.removeEventListener('touchmove', onDragMove);
        window.removeEventListener('touchend', onDragEnd);
    
        emit('drag-end');
    }   



    return {
        onDragStart,
        onDragMove,
        onDragEnd,
        positions,
        bubbleInTrash,
        showTrash,
        currentDraggingId,
        isDragging,
    };       
}
