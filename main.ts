import { Editor, Plugin } from 'obsidian';

export default class TextHighlighterPlugin extends Plugin {
  onload() {
    this.addCommand({
      id: 'highlight-text',
      name: 'Highlight Text',
      editorCallback: (editor) => {
        const selectedText = editor.getSelection();

        if (!selectedText) {
          return;
        }
        
        const isAlreadyHighlighted = selectedText.startsWith('<span style="background-color: yellow">') && selectedText.endsWith("</span>")
        let highlightedText;
        
        if (isAlreadyHighlighted) {
          highlightedText = selectedText.replace('<span style="background-color: yellow">', "").replace("</span>", "")
        } else {
          highlightedText = `<span style="background-color: yellow">${selectedText}</span>`;
        }

        replaceAndSelect(editor, highlightedText)
      }
    });

    this.addCommand({
      id: 'underline-text',
      name: 'Underline Text',
      editorCallback: (editor) => {
        const selectedText = editor.getSelection();

        if (!selectedText) {
          return;
        }

        const isAlreadyUnderlined = selectedText.startsWith("<u>") && selectedText.endsWith("</u>")
        let underlinedText

        if (isAlreadyUnderlined) {
          underlinedText = selectedText.replace("<u>", "").replace("</u>", "")
        } else {
          underlinedText = `<u>${selectedText}</u>`;
        }

        replaceAndSelect(editor, underlinedText)
      }
    });

    this.addCommand({
      id: 'bold-text',
      name: 'Bold Text',
      editorCallback: (editor) => {
        const selectedText = editor.getSelection();

        if (!selectedText) {
          return;
        }

        const isAlreadyBolded = selectedText.startsWith("<b>") && selectedText.endsWith("</b>");
        let boldedText;

        if (isAlreadyBolded) {
          boldedText = selectedText.replace("<b>", "").replace("</b>", "")
        } else {
          boldedText = `<b>${selectedText}</b>`;
        }
        replaceAndSelect(editor, boldedText)
      }
    })
  }
}

function replaceAndSelect(editor: Editor, newText: string) {
  const selections = editor.listSelections();
  const currentSelection = selections[0];
  const newHeadChar = currentSelection.anchor.ch + newText.length;
  const newSelection = {
    anchor: currentSelection.anchor,
    head: { line: currentSelection.anchor.line, ch: newHeadChar }
  };
  
  editor.replaceSelection(newText);
  editor.setSelection(newSelection.anchor, newSelection.head);
}