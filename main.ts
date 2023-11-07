import { Plugin, Notice } from 'obsidian';

export default class TextHighlighterPlugin extends Plugin {
  onload() {
    this.addCommand({
      id: 'highlight-text',
      name: 'Highlight Text',
      editorCallback: (editor) => {
        const selectedText = editor.getSelection();

        if (!selectedText) {
          new Notice('No text selected!');
          return;
        }
        const highlighted = `<span style="background-color: yellow">${selectedText}</span>`;
        editor.replaceSelection(highlighted);
      }
    });
  }
}