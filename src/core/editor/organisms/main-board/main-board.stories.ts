import type { Meta, StoryObj } from '@storybook/react';
import MainBoard from  './main-board';
import React from 'react';

const meta = {
    title: 'editor/organsims/MainBoard',
    component: MainBoard,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },

} satisfies Meta<typeof MainBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const basic: Story = {
    args: {
        
    },
};