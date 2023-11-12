import { App, Editor, EditorSelection, Plugin, Modal } from 'obsidian';

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

        replaceAndSelect(editor, highlightedText, selectedText)
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

        replaceAndSelect(editor, underlinedText, selectedText)
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
        replaceAndSelect(editor, boldedText, selectedText)
      }
    });

    this.addCommand({
      id: 'italic-text',
      name: 'Italic Text',
      editorCallback: (editor) => {
        const selectedText = editor.getSelection();

        const isAlreadyItalic = selectedText.startsWith("<i>") && selectedText.endsWith("</i>");
        let italicText;

        if (isAlreadyItalic) {
          italicText = selectedText.replace("<i>", "").replace("</i>", "")
        } else {
          italicText = `<i>${selectedText}</i>`;
        }
        replaceAndSelect(editor, italicText, selectedText)
      }
    });

    this.addCommand({
      id: 'wrap-text',
      name: 'Wrapping Text',
      editorCallback: (editor: Editor) => {
        new TagPromptModal(this.app, (tagName: string) => {
          if (tagName) {
            const selectedText = editor.getSelection();
            const wrappedText = `<${tagName}>${selectedText}</${tagName}>`;
            replaceAndSelect(editor, wrappedText, selectedText);
          }
        }).open();
      }
    });
  }
}

class TagPromptModal extends Modal {
  onChooseTag: (tagName: string) => void;

  constructor(app: App, onChooseTag: (tagName: string) => void) {
    super(app);
    this.onChooseTag = onChooseTag;
  }

  onOpen() {

    this.contentEl.createEl('h3', { text: 'Enter Tag Name' });

    const input = this.contentEl.createEl('input', {
      type: 'text',
      attr: {
        placeholder: 'Type tag name here and press Enter'
      }
    });

    input.setCssStyles({
      width: '100%',
      fontSize: '1em'
    });

    input.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.onChooseTag(input.value);
        this.close();
      }
    });

    input.focus();
  }

  onClose() {
    this.contentEl.empty();
  }
}

function replaceAndSelect(editor: Editor, newText: string, selectedText: string) {
  const currentSelection = editor.listSelections()[0];
  const isBackwardsDirection = isSelectionBackwards(currentSelection);

  editor.replaceSelection(newText);

  let newAnchor, newHead;
  
  if (selectedText.length === 0) {

    let openingTagLength = 1
    for (let i = 0; i < newText.length; i++) {
      if (newText[i] === ">") {
        break;
      }
      openingTagLength += 1;
  }

    const middlePosition = {
      line: currentSelection.anchor.line,
      ch: currentSelection.anchor.ch + openingTagLength
    };

    newAnchor = middlePosition;
    newHead = middlePosition;

  } else {

    if (isBackwardsDirection) {
      newAnchor = { line: currentSelection.head.line, ch: currentSelection.head.ch + newText.length };
      newHead = currentSelection.head;
    } else {
      console.log(1)
      newAnchor = currentSelection.anchor;
      newHead = { line: currentSelection.anchor.line, ch: currentSelection.anchor.ch + newText.length };
    }

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