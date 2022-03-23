import { languages } from 'monaco-editor/esm/vs/editor/editor.api.js';

import { languageId } from './constants';
import {
  createCodeActionProvider,
  createCompletionItemProvider,
  createDefinitionProvider,
  createDiagnosticsAdapter,
  createDocumentFormattingEditProvider,
  createDocumentSymbolProvider,
  createHoverProvider,
  createLinkProvider,
} from './languageFeatures';
import { LanguageServiceDefaults } from './types';
import { createWorkerManager } from './workerManager';

const richEditConfiguration: languages.LanguageConfiguration = {
  comments: {
    lineComment: '#',
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],

  onEnterRules: [
    {
      beforeText: /:\s*$/,
      action: { indentAction: languages.IndentAction.Indent },
    },
  ],
};

export function setupMode(defaults: LanguageServiceDefaults): void {
  const worker = createWorkerManager(defaults);

  languages.registerCompletionItemProvider(languageId, createCompletionItemProvider(worker));
  languages.registerHoverProvider(languageId, createHoverProvider(worker));
  languages.registerDefinitionProvider(languageId, createDefinitionProvider(worker));
  languages.registerDocumentSymbolProvider(languageId, createDocumentSymbolProvider(worker));
  languages.registerDocumentFormattingEditProvider(
    languageId,
    createDocumentFormattingEditProvider(worker),
  );
  languages.registerLinkProvider(languageId, createLinkProvider(worker));
  languages.registerCodeActionProvider(languageId, createCodeActionProvider(worker));
  createDiagnosticsAdapter(worker, defaults);
  languages.setLanguageConfiguration(languageId, richEditConfiguration);
}
