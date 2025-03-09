import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import TopBar from './top-bar';

const meta = {
  title: 'editor/atoms/TopBar',
  component: TopBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onLogin: fn(),
    onLogout: fn(),
    onCreateAccount: fn(),
  },
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {
    user: {
      name: 'Dyna-Flux',
    },
  },
};

export const LoggedOut: Story = {};
