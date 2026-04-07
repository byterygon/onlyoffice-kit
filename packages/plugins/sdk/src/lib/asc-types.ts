// ---------------------------------------------------------------------------
// Auxiliary types
// Source: https://api.onlyoffice.com/docs/plugin-and-macros/interacting-with-editors/text-document-api/Methods
// ---------------------------------------------------------------------------

export interface CommentData {
  UserName?: string;
  UserId?: string;
  Date?: string;
  Text: string;
  Time?: number;
  Solved?: boolean;
  Replies?: CommentData[];
}

/** 1 = block, 2 = inline, 3 = row, 4 = cell */
export type ContentControlType = 1 | 2 | 3 | 4;

export interface ContentControlProperties {
  Id?: number;
  Tag?: string;
  Lock?: number;
}

export interface ContentControlCheckBoxProperties {
  Checked?: boolean;
  CheckedSymbol?: string;
  UncheckedSymbol?: string;
}

export interface ContentControl {
  Tag?: string;
  InternalId?: string;
}

export interface AddinFieldData {
  FieldId: string;
  Value: string;
  Content?: string;
}

export interface OLEObjectData {
  [key: string]: unknown;
}

export interface FontInfo {
  m_wsFontName: string;
  m_bBold?: boolean;
  m_bItalic?: boolean;
}

export interface Macros {
  [key: string]: unknown;
}

export type TextPartType = 'entirely' | 'partial';

export interface GetSelectedTextProps {
  Numbering: boolean;
  Math: boolean;
  TableCellSeparator?: string;
  TableRowSeparator?: string;
  ParaSeparator?: string;
  TabSymbol?: string;
  NewLineSeparator?: string;
}

export interface GetSelectedContentProps {
  type?: 'text' | 'html';
}

export interface SearchAndReplaceProps {
  searchString: string;
  replaceString: string;
  matchCase?: boolean;
}

export interface SearchNextProps {
  searchString: string;
  matchCase?: boolean;
}

export interface SetPropertiesObj {
  copyoutenabled?: boolean;
  hideContentControlTrack?: boolean;
  watermark_on_draw?: string;
  disableAutostartMacros?: boolean;
  fillForms?: string;
}

// ---------------------------------------------------------------------------
// Method map
// Each entry: { args: [...param tuple]; result: ReturnType }
// ---------------------------------------------------------------------------

export type TextDocumentMethodMap = {
  AcceptReviewChanges: { args: []; result: void };
  AddAddinField: { args: [data: AddinFieldData]; result: void };
  AddComment: { args: [oCommentData: CommentData]; result: string | null };
  AddContentControl: {
    args: [type: ContentControlType, commonPr?: ContentControlProperties];
    result: ContentControl;
  };
  AddContentControlCheckBox: {
    args: [
      checkBoxPr?: ContentControlCheckBoxProperties,
      commonPr?: ContentControlProperties,
    ];
    result: void;
  };
  AddContentControlDatePicker: {
    args: [datePr?: unknown, commonPr?: ContentControlProperties];
    result: void;
  };
  AddContentControlList: {
    args: [listPr?: unknown, commonPr?: ContentControlProperties];
    result: void;
  };
  AddContentControlPicture: {
    args: [picturePr?: unknown, commonPr?: ContentControlProperties];
    result: void;
  };
  AddOleObject: { args: [data: OLEObjectData]; result: void };
  AnnotateParagraph: {
    args: [paragraphRef: unknown, annotationData: unknown];
    result: void;
  };
  CanRedo: { args: []; result: boolean };
  CanUndo: { args: []; result: boolean };
  ChangeComment: {
    args: [sId: string, oCommentData: CommentData];
    result: void;
  };
  ChangeOleObject: { args: [internalId: string]; result: void };
  ChangeOleObjects: { args: [objects: OLEObjectData[]]; result: void };
  ConvertDocument: {
    args: [
      sConvertType?: 'markdown' | 'html',
      bHtmlHeadings?: boolean,
      bBase64img?: boolean,
      bDemoteHeadings?: boolean,
      bRenderHTMLTags?: boolean,
    ];
    result: string;
  };
  EditOleObject: { args: [ref: OLEObjectData]; result: void };
  FocusEditor: { args: []; result: void };
  GetAllAddinFields: { args: []; result: AddinFieldData[] };
  GetAllComments: { args: []; result: CommentData[] };
  GetAllContentControls: { args: []; result: ContentControl[] };
  GetAllForms: { args: []; result: ContentControl[] };
  GetAllOleObjects: { args: [sPluginId: string]; result: OLEObjectData[] };
  GetCurrentSentence: { args: []; result: string };
  GetCurrentWord: { args: []; result: string };
  GetDocumentLang: { args: []; result: string };
  GetFields: { args: []; result: string[] };
  GetFileHTML: { args: []; result: string };
  GetFileToDownload: { args: [format?: string]; result: string };
  GetFontList: { args: []; result: FontInfo[] };
  GetFormValue: {
    args: [internalId: string];
    result: null | string | boolean;
  };
  GetSelectedContent: { args: [prop: GetSelectedContentProps]; result: string };
  GetSelectedText: { args: [prop: GetSelectedTextProps]; result: string };
  GetVersion: { args: []; result: string };
  InputText: { args: [text: string, textReplace: string]; result: void };
  InsertOleObject: {
    args: [newObject: OLEObjectData, bSelect: boolean];
    result: void;
  };
  InstallPlugin: { args: [config: unknown]; result: object };
  IsEditingOFormMode: { args: []; result: boolean };
  IsFillingFormMode: { args: []; result: boolean };
  MoveCursorToEnd: { args: []; result: void };
  MoveCursorToStart: { args: []; result: void };
  PasteHtml: { args: [htmlText: string]; result: void };
  PasteText: { args: [text: string]; result: void };
  Redo: { args: []; result: void };
  RemoveSelectedContent: { args: []; result: void };
  ReplaceCurrentSentence: { args: [replaceString: string]; result: void };
  ReplaceCurrentWord: {
    args: [replaceString: string, type?: TextPartType];
    result: void;
  };
  SearchAndReplace: {
    args: [oProperties: SearchAndReplaceProps];
    result: void;
  };
  SearchNext: {
    args: [oProperties: SearchNextProps, isForward?: boolean];
    result: boolean;
  };
  SetFormValue: {
    args: [internalId: string, value: string | boolean];
    result: void;
  };
  SetMacros: { args: [data: Macros]; result: void };
  SetProperties: { args: [obj: SetPropertiesObj]; result: void };
  Undo: { args: []; result: void };
};

// ---------------------------------------------------------------------------
// Asc instance
// ---------------------------------------------------------------------------

export interface AscInstance {
  plugin: {
    cfg?: { channelId?: string };
    init: () => void;
    button: () => void;
    executeMethod: <K extends keyof TextDocumentMethodMap>(
      name: K,
      args: TextDocumentMethodMap[K]['args'],
      callback?: (result: TextDocumentMethodMap[K]['result']) => void,
    ) => void;
  };
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const Asc = (window as Window & { Asc?: AscInstance }).Asc!;
