export type EditorEventName =
  | 'onReady'
  | 'onDocumentStateChange'
  | 'onDocumentReady'
  | 'onError'
  | 'onWarning'
  | 'onInfo'
  | 'onRequestClose'
  | 'onRequestEditRights'
  | 'onMakeActionLink'
  | 'onRequestSaveAs'
  | 'onRequestInsertImage'
  | 'onRequestMailMergeRecipients'
  | 'onRequestCompareFile'
  | 'onRequestSharingSettings'
  | 'onRequestRename'
  | 'onRequestHistory'
  | 'onRequestHistoryData'
  | 'onRequestHistoryClose'
  | 'onRequestRestore';

export interface EditorEvent<T = unknown> {
  type: EditorEventName;
  data: T;
}
