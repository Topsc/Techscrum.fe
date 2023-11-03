import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { EditorState, Modifier, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import DraftEditor from '@draft-js-plugins/editor';
import createMentionPlugin, { MentionData } from '@draft-js-plugins/mention';
import '@draft-js-plugins/mention/lib/plugin.css';
import createImagePlugin from '@draft-js-plugins/image';
import styles from './Editor.module.scss';
import { upload } from '../../../../../../../api/upload/upload';
import mention from '../../../../../../../assets/mention.svg';
import insertImage from '../../../../../../../assets/insertImage.svg';

interface IEditor {
  onClickPublish: (content: string) => void;
  onClickDiscard?: () => void;
  readOnly?: boolean;
  content?: string;
  users: MentionData[];
  imageInputId: string;
  submitting: boolean;
}
function initialEditorState(content) {
  if (content) {
    const rawState = JSON.parse(content);
    const contentState = convertFromRaw(rawState);
    return EditorState.createWithContent(contentState);
  }
  return EditorState.createEmpty();
}
function Editor(props: IEditor) {
  const {
    onClickPublish,
    readOnly,
    content,
    onClickDiscard = () => {},
    users,
    imageInputId,
    submitting
  } = props;
  const ref = useRef<DraftEditor>(null);
  const [editorState, setEditorState] = useState(initialEditorState(content));
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(users);
  useEffect(() => {
    setSuggestions(users);
  }, [users]);

  const { MentionSuggestion, editorPlugins, editorImagePlugin } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
      mentionPrefix: '@',
      supportWhitespace: true
    });
    const { MentionSuggestions } = mentionPlugin;
    const imagePlugin = createImagePlugin();
    const plugins = [mentionPlugin, imagePlugin];
    return {
      MentionSuggestion: MentionSuggestions,
      editorPlugins: plugins,
      editorImagePlugin: imagePlugin
    };
  }, []);

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);

  const onSearchChange = useCallback(() => {
    setSuggestions(users);
  }, [users]);

  function handleMentionClick() {
    const newContentState = Modifier.insertText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      ' @ '
    );

    const newEditorState = EditorState.push(editorState, newContentState, 'insert-fragment');

    const selectionState = editorState.getSelection();
    const updatedSelection = selectionState.merge({
      focusOffset: selectionState.getFocusOffset() + 3,
      anchorOffset: selectionState.getFocusOffset() + 3
    });

    setEditorState(() => EditorState.forceSelection(newEditorState, updatedSelection));
  }

  const emptyEditor = () => {
    const newEditorState = EditorState.push(
      editorState,
      ContentState.createFromText(''),
      'change-block-data'
    );
    setEditorState(newEditorState);
  };

  const onHandleDiscard = () => {
    if (content) {
      onClickDiscard();
      setEditorState(initialEditorState(content));
    } else {
      emptyEditor();
    }
  };
  const onHandlePublish = () => {
    const data = editorState.getCurrentContent();
    if (submitting) {
      return;
    }
    if (!data.hasText()) {
      return;
    }

    const currentContent = JSON.stringify(convertToRaw(data));
    onClickPublish(currentContent);
    if (!content) {
      emptyEditor();
    }
  };
  function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }
    const uploadData = new FormData();
    uploadData.append('photos', e.target.files[0]);

    upload(uploadData).then((res: any) => {
      const value = editorImagePlugin.addImage(editorState, res.data[0].location, {});
      setEditorState(value);
    });
  }
  const className = readOnly ? [styles.editor, styles.readOnly].join(' ') : styles.editor;

  return (
    <div className={className}>
      <DraftEditor
        editorState={editorState}
        onChange={setEditorState}
        plugins={editorPlugins}
        ref={ref}
        readOnly={readOnly}
        placeholder="Comment below..."
      />
      <MentionSuggestion
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
      />
      {!readOnly && (
        <div className={styles.editorFooter}>
          <div className={styles.insertImage}>
            <label htmlFor={imageInputId}>
              <img src={insertImage} alt="insertImage" />
              <input
                type="file"
                accept="image/*"
                name="insertImage"
                id={imageInputId}
                onChange={uploadFile}
              />
            </label>
          </div>
          <div
            aria-hidden="true"
            onClick={handleMentionClick}
            onKeyDown={handleMentionClick}
            className={styles.mention}
          >
            <img src={mention} alt="mention" />
          </div>
          <button type="button" onClick={onHandleDiscard} className={styles.discardButton}>
            Discard
          </button>
          <button
            type="button"
            onClick={onHandlePublish}
            className={styles.publishButton}
            disabled={submitting}
          >
            {content ? 'Save' : 'Publish'}
          </button>
        </div>
      )}
    </div>
  );
}
Editor.defaultProps = {
  readOnly: false,
  content: '',
  onClickDiscard: () => {}
};
export default Editor;
