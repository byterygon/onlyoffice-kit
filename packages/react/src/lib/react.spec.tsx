import { render, act } from '@testing-library/react';
import type { OnlyOfficeConfig } from '@byterygon/onlyoffice-kit-core';
import { Controller } from '@byterygon/onlyoffice-kit-core';
import { useState } from 'react';
import { useEditor, OnlyOfficeEditor } from './react.js';

vi.mock('@byterygon/onlyoffice-kit-core', () => ({
  Controller: vi.fn().mockImplementation(function (
    this: Record<string, unknown>,
  ) {
    this.setConfig = vi.fn();
    this.destroy = vi.fn();
  }),
}));

const MockController = Controller as unknown as ReturnType<typeof vi.fn>;

function makeConfig(title = 'Test.docx'): OnlyOfficeConfig {
  return {
    document: {
      fileType: 'docx',
      key: 'test-key',
      title,
      url: 'https://example.com/test.docx',
    },
    documentType: 'word',
  };
}

const DEFAULT_URL = 'http://localhost:8080/';

// Wrapper that renders the required container div for useEditor
function EditorWrapper({
  documentServerUrl,
  config,
}: {
  documentServerUrl: string;
  config: OnlyOfficeConfig;
}) {
  const { containerRef } = useEditor({ documentServerUrl, config });
  return <div ref={containerRef} data-testid="editor-container" />;
}

describe('useEditor', () => {
  beforeEach(() => {
    MockController.mockClear();
    MockController.mockImplementation(function (this: Record<string, unknown>) {
      this.setConfig = vi.fn();
      this.destroy = vi.fn();
    });
  });

  it('creates Controller on mount with correct args', () => {
    render(
      <EditorWrapper documentServerUrl={DEFAULT_URL} config={makeConfig()} />,
    );

    expect(MockController).toHaveBeenCalledTimes(1);
    expect(MockController).toHaveBeenCalledWith(
      expect.objectContaining({
        documentServerUrl: DEFAULT_URL,
        config: makeConfig(),
        element: expect.any(HTMLDivElement),
      }),
    );
  });

  it('destroys Controller on unmount', () => {
    const { unmount } = render(
      <EditorWrapper documentServerUrl={DEFAULT_URL} config={makeConfig()} />,
    );

    const instance = MockController.mock.instances[0];
    unmount();

    expect(instance.destroy).toHaveBeenCalledTimes(1);
  });

  it('calls setConfig when config changes', () => {
    function Wrapper() {
      const [config, setConfig] = useState(makeConfig('Original.docx'));
      const { containerRef } = useEditor({
        documentServerUrl: DEFAULT_URL,
        config,
      });
      return (
        <div>
          <div ref={containerRef} data-testid="editor-container" />
          <button
            onClick={() => setConfig(makeConfig('Updated.docx'))}
            data-testid="update-btn"
          />
        </div>
      );
    }

    const { getByTestId } = render(<Wrapper />);
    const instance = MockController.mock.instances[0];

    act(() => {
      getByTestId('update-btn').click();
    });

    expect(instance.setConfig).toHaveBeenCalledWith(makeConfig('Updated.docx'));
  });

  it('does not recreate Controller when only config changes', () => {
    function Wrapper() {
      const [config, setConfig] = useState(makeConfig('Original.docx'));
      const { containerRef } = useEditor({
        documentServerUrl: DEFAULT_URL,
        config,
      });
      return (
        <div>
          <div ref={containerRef} data-testid="editor-container" />
          <button
            onClick={() => setConfig(makeConfig('Updated.docx'))}
            data-testid="update-btn"
          />
        </div>
      );
    }

    const { getByTestId } = render(<Wrapper />);
    expect(MockController).toHaveBeenCalledTimes(1);

    act(() => {
      getByTestId('update-btn').click();
    });

    expect(MockController).toHaveBeenCalledTimes(1);
  });

  it('recreates Controller when documentServerUrl changes', () => {
    function Wrapper() {
      const [url, setUrl] = useState('http://server-a:8080/');
      const { containerRef } = useEditor({
        documentServerUrl: url,
        config: makeConfig(),
      });
      return (
        <div>
          <div ref={containerRef} data-testid="editor-container" />
          <button
            onClick={() => setUrl('http://server-b:8080/')}
            data-testid="switch-btn"
          />
        </div>
      );
    }

    const { getByTestId } = render(<Wrapper />);
    const firstInstance = MockController.mock.instances[0];
    expect(MockController).toHaveBeenCalledTimes(1);

    act(() => {
      getByTestId('switch-btn').click();
    });

    expect(firstInstance.destroy).toHaveBeenCalledTimes(1);
    expect(MockController).toHaveBeenCalledTimes(2);
    expect(MockController).toHaveBeenLastCalledWith(
      expect.objectContaining({ documentServerUrl: 'http://server-b:8080/' }),
    );
  });
});

describe('OnlyOfficeEditor', () => {
  beforeEach(() => {
    MockController.mockClear();
    MockController.mockImplementation(function (this: Record<string, unknown>) {
      this.setConfig = vi.fn();
      this.destroy = vi.fn();
    });
  });

  it('renders a div container', () => {
    const { container } = render(
      <OnlyOfficeEditor
        documentServerUrl={DEFAULT_URL}
        config={makeConfig()}
      />,
    );

    expect(container.querySelector('div')).not.toBeNull();
  });

  it('mounts Controller targeting the rendered div', () => {
    const { container } = render(
      <OnlyOfficeEditor
        documentServerUrl={DEFAULT_URL}
        config={makeConfig()}
        className="editor-container"
      />,
    );

    const div = container.querySelector('.editor-container');
    expect(div).not.toBeNull();
    expect(MockController).toHaveBeenCalledTimes(1);
    expect(MockController).toHaveBeenCalledWith(
      expect.objectContaining({ element: div }),
    );
  });

  it('passes className and style to the container div', () => {
    const { container } = render(
      <OnlyOfficeEditor
        documentServerUrl={DEFAULT_URL}
        config={makeConfig()}
        className="my-editor"
        style={{ height: '600px' }}
      />,
    );

    const div = container.querySelector('.my-editor') as HTMLElement;
    expect(div).not.toBeNull();
    expect(div.style.height).toBe('600px');
  });

  it('destroys Controller on unmount', () => {
    const { unmount } = render(
      <OnlyOfficeEditor
        documentServerUrl={DEFAULT_URL}
        config={makeConfig()}
      />,
    );

    const instance = MockController.mock.instances[0];
    unmount();

    expect(instance.destroy).toHaveBeenCalledTimes(1);
  });
});
