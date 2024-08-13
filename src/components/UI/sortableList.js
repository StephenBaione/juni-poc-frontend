import React, { useEffect } from 'react';

import { useState } from 'react';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';

import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';

import SortableListItem from './sortableListItem';

const lodash = require('lodash');

export default function SortableList(props) {
    const {
        defaultItems,
        onUpdate,
    } = props;

    const [items, setItems] = useState(defaultItems);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (onUpdate) {
            onUpdate(items);
        }
    }, [items]);

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = lodash.findIndex(items, (item) => item.id === active.id);
                const newIndex = lodash.findIndex(items, item => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            })
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            handle
        >
            <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
            >
                {items.map((item) => <SortableListItem id={item.id} value={item.value} />)}
            </SortableContext>
        </DndContext>
    )
}


