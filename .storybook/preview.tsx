import type { Preview } from '@storybook/react-vite'
import '../src/styles/tokens.css'
import '../src/styles/components.css'
import { ThemeProvider, themes, type Theme } from '../src'

const preview: Preview = {
  // Theme picker in the toolbar: every story is wrapped in a ThemeProvider.
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: ['auto', ...themes],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'paper' },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
  },
  tags: ['autodocs'],
  decorators: [
    (Story, { globals, viewMode }) => (
      <ThemeProvider
        theme={globals.theme as Theme}
        style={{ padding: 24, minHeight: viewMode === 'story' ? '100vh' : undefined }}
      >
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default preview
