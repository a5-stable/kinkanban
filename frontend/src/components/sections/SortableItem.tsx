import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { itemsEqual } from '@dnd-kit/sortable/dist/utilities';
import { randomBytes } from 'crypto';

export function SortableItem(props) {
  
  const {
    setNodeRef,
    attributes,
    listeners,
    transition,
    transform,
    isDragging,
  } = useSortable({ id: props.id })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    border: '2px solid black',
    marginBottom: 5,
    marginTop: 5,
    opacity: isDragging ? 0.5 : 1,
  }

  
  return (
    <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
    >
        {props.id}
    </div>
)
}
