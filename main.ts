import { Editor, EditorSelection, Plugin } from 'obsidian';

export default class TextHighlighterPlugin extends Plugin {
  onload() {
    this.addCommand({
      id: 'highlight-text',
      name: 'Highlight Text',
      editorCallback: (editor) => {
        const selectedText = editor.getSelection();
        
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

        const isAlreadyBolded = selectedText.startsWith("<b>") && selectedText.endsWith("</b>");
        let boldedText;

        if (isAlreadyBolded) {
          boldedText = selectedText.replace("<b>", "").replace("</b>", "")
        } else {
          boldedText = `<b>${selectedText}</b>`;
        }
        replaceAndSelect(editor, boldedText)
      }
    });

    this.addCommand({
      id: 'italic-text',
      name: 'Italic Text',
      editorCallback: (editor) => {
        const selectedText = editor.getSelection();

        const isAlreadyItalic = selectedText.startsWith("<i>") && selectedText.endsWith("</i>");
        let boldedText;

        if (isAlreadyItalic) {
          boldedText = selectedText.replace("<i>", "").replace("</i>", "")
        } else {
          boldedText = `<i>${selectedText}</i>`;
        }
        replaceAndSelect(editor, boldedText)
      }
    });
  }
}

function replaceAndSelect(editor: Editor, newText: string) {
  const currentSelection = editor.listSelections()[0];
  const isBackwardsDirection = isSelectionBackwards(currentSelection);

  editor.replaceSelection(newText);

  let newAnchor, newHead;
  if (isBackwardsDirection) {
    newAnchor = { line: currentSelection.head.line, ch: currentSelection.head.ch + newText.length };
    newHead = currentSelection.head;
  } else {
    console.log(1)
    newAnchor = currentSelection.anchor;
    newHead = { line: currentSelection.anchor.line, ch: currentSelection.anchor.ch + newText.length };
  }

  editor.setSelection(newAnchor, newHead);
}

function isSelectionBackwards(selection: EditorSelection): boolean {
  if (selection.anchor.line > selection.head.line) {
    return true;
  }

  if (selection.anchor.line === selection.head.line) {
    return selection.anchor.ch > selection.head.ch;
  }

  return false;
}