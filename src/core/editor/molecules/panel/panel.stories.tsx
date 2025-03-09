import type { Meta, StoryObj } from '@storybook/react';
import Panel from './panel';
import React from 'react';

const meta = {
  title: 'editor/molecules/panel',
  component: Panel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    children: <div>Contenido del Panel</div>, // 🔥 Se debe pasar JSX válido
  },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const basic: Story = {
  args: {
    children: <div>Dyna-Flux</div>,
    width: '40%',
  },
};
