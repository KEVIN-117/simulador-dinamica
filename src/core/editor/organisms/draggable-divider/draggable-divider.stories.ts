import type { Meta, StoryObj } from '@storybook/react';
import DraggableDivider from  './draggable-divider';
import React from 'react';

const meta = {
    title: 'editor/organsims/DraggableDivider',
    component: DraggableDivider,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },

} satisfies Meta<typeof DraggableDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const basic: Story = {
    args: {
        
    },
};