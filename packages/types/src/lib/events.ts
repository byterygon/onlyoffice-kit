// ─── Event Names ─────────────────────────────────────────────────────

/**
 * Union of all OnlyOffice editor event names.
 *
 * @see https://api.onlyoffice.com/docs/docs-api/usage-api/config/events/
 */
export type EditorEventName =
  | 'onAppReady'
  | 'onCollaborativeChanges'
  | 'onDocumentReady'
  | 'onDocumentStateChange'
  | 'onDownloadAs'
  | 'onError'
  | 'onInfo'
  | 'onMakeActionLink'
  | 'onMetaChange'
  | 'onOutdatedVersion'
  | 'onPluginsReady'
  | 'onRequestClose'
  | 'onRequestCompareFile'
  | 'onRequestCreateNew'
  | 'onRequestEditRights'
  | 'onRequestHistory'
  | 'onRequestHistoryClose'
  | 'onRequestHistoryData'
  | 'onRequestInsertImage'
  | 'onRequestMailMergeRecipients'
  | 'onRequestOpen'
  | 'onRequestReferenceData'
  | 'onRequestReferenceSource'
  | 'onRequestRefreshFile'
  | 'onRequestRename'
  | 'onRequestRestore'
  | 'onRequestSaveAs'
  | 'onRequestSelectDocument'
  | 'onRequestSelectSpreadsheet'
  | 'onRequestSendNotify'
  | 'onRequestSharingSettings'
  | 'onRequestStartFilling'
  | 'onRequestUsers'
  | 'onSubmit'
  | 'onUserActionRequired'
  | 'onWarning';

// ─── Event Data Types ────────────────────────────────────────────────

/** Payload for `onDocumentStateChange`. Indicates whether the document has unsaved edits. */
export interface DocumentStateChangeData {
  /** `true` when the user edits the document; `false` when changes are saved to the server. */
  data: boolean;
}

/** Payload for `onDownloadAs`. Contains the URL and file type of the generated download. */
export interface DownloadAsData {
  data: {
    /** The file extension of the downloaded file (e.g., `"docx"`, `"pdf"`). */
    fileType: string;
    /** Temporary URL to download the converted file. */
    url: string;
  };
}

/** Payload for `onError`. Contains the error code and human-readable description. */
export interface ErrorData {
  data: {
    /** Numeric error code identifying the error type. */
    errorCode: number;
    /** Human-readable error description. */
    errorDescription: string;
  };
}

/** Payload for `onWarning`. Contains a warning code and description. */
export interface WarningData {
  data: {
    /** Numeric warning code. */
    warningCode: number;
    /** Human-readable warning description. */
    warningDescription: string;
  };
}

/** Payload for `onInfo`. Indicates the current editor mode. */
export interface InfoData {
  data: {
    /** The active editor mode. */
    mode: 'view' | 'edit';
  };
}

/** Payload for `onMakeActionLink`. Contains bookmark/position data for generating a deep link. */
export interface MakeActionLinkData {
  /** Bookmark or position data to encode into the action link. Pass this to `setActionLink()`. */
  data: Record<string, unknown>;
}

/** Payload for `onMetaChange`. Fired when document metadata (title, favorite status) changes. */
export interface MetaChangeData {
  data: {
    /** The new document title. */
    title: string;
    /** Whether the document is now marked as a favorite. */
    favorite: boolean;
  };
}

/** Payload for `onRequestHistoryData`. Contains the requested version number. */
export interface RequestHistoryDataData {
  /** The version number the user clicked on in the history panel. Pass the corresponding history data to `setHistoryData()`. */
  data: number;
}

/** Payload for `onRequestInsertImage`. Contains the insertion context. */
export interface RequestInsertImageData {
  data: {
    /** The insertion type identifier (e.g., the image placeholder type). */
    c: string;
  };
}

/** Payload for `onRequestOpen`. Fired when the user clicks "Open source" for an external reference. */
export interface RequestOpenData {
  data: {
    /** The file path or identifier of the source document. */
    path: string;
    /** Reference data identifying the source document. */
    referenceData: Record<string, unknown>;
    /** Suggested `window.open()` target name. */
    windowName: string;
  };
}

/** Payload for `onRequestReferenceData`. Fired when the user clicks "Update values" for an external link. */
export interface RequestReferenceDataData {
  data: {
    /** The external link URL. */
    link: string;
    /** Reference data identifying the linked document. */
    referenceData: Record<string, unknown>;
    /** The file path of the linked document. */
    path: string;
  };
}

/** Payload for `onRequestReferenceSource`. Fired when the user clicks "Change source" for an external link. */
export interface RequestReferenceSourceData {
  data: {
    /** Reference data identifying the current source document. */
    referenceData: Record<string, unknown>;
    /** The file path of the current source document. */
    path: string;
  };
}

/** Payload for `onRequestRename`. Contains the new title entered by the user. */
export interface RequestRenameData {
  /** The new document title. */
  data: string;
}

/** Payload for `onRequestRestore`. Fired when the user clicks "Restore" in version history. */
export interface RequestRestoreData {
  data: {
    /** The version number to restore. */
    version: number;
    /** URL to download the version's file content. */
    url: string;
    /** The file extension of the version. */
    fileType: string;
  };
}

/** Payload for `onRequestSaveAs`. Contains the file the user wants to save a copy of. */
export interface RequestSaveAsData {
  data: {
    /** The file extension for the saved copy. */
    fileType: string;
    /** The suggested file name. */
    title: string;
    /** Temporary URL to download the file content. */
    url: string;
  };
}

/** Payload for `onRequestSelectDocument`. Fired when the user selects a document for comparing, combining, or inserting. */
export interface RequestSelectDocumentData {
  data: {
    /** The selection context identifier. */
    c: string;
  };
}

/** Payload for `onRequestSelectSpreadsheet`. Fired when the user selects a spreadsheet for mail merge. */
export interface RequestSelectSpreadsheetData {
  data: {
    /** The selection context identifier. */
    c: string;
  };
}

/** Payload for `onRequestSendNotify`. Fired when a user is mentioned in a comment. */
export interface RequestSendNotifyData {
  data: {
    /** Action link data for navigating to the comment. */
    actionLink: Record<string, unknown>;
    /** The comment text mentioning the user. */
    message: string;
    /** Email addresses of the mentioned users. */
    emails: string[];
  };
}

/** Payload for `onRequestUsers`. Fired when the editor needs user information (for mentions, protection, or avatars). */
export interface RequestUsersData {
  data: {
    /** The context requesting user data: `"mention"` for @-mentions, `"protect"` for range protection, `"info"` for avatar display. */
    c: 'mention' | 'protect' | 'info';
    /** Array of user IDs to fetch info for (only present when `c` is `"info"`). */
    id?: string[];
  };
}

// ─── Event Map ───────────────────────────────────────────────────────

/**
 * Maps each event name to its payload type. Events with `void` payloads have no callback arguments.
 *
 * Use with {@link EditorEventHandler} for type-safe event listeners.
 */
export interface EditorEventMap {
  /** Fired when the editor application is fully initialized. */
  onAppReady: void;
  /** Fired when another user saves changes in strict co-editing mode. */
  onCollaborativeChanges: void;
  /** Fired when the document content is fully loaded into the editor. */
  onDocumentReady: void;
  /** Fired when the document modified state changes (edited / saved). */
  onDocumentStateChange: DocumentStateChangeData;
  /** Fired when a `downloadAs` call completes. */
  onDownloadAs: DownloadAsData;
  /** Fired when an error occurs. */
  onError: ErrorData;
  /** Fired on document open with the current editor mode. */
  onInfo: InfoData;
  /** Fired when the user requests a deep link to a bookmarked position. */
  onMakeActionLink: MakeActionLinkData;
  /** Fired when document metadata (title, favorite) changes. */
  onMetaChange: MetaChangeData;
  /**
   * Fired when the document key is outdated.
   * @deprecated Use `onRequestRefreshFile` instead.
   */
  onOutdatedVersion: void;
  /** Fired when all editor plugins have loaded. */
  onPluginsReady: void;
  /** Fired when the user clicks the close button. */
  onRequestClose: void;
  /**
   * Fired when the user selects a document for comparison.
   * @deprecated Use `onRequestSelectDocument` instead.
   */
  onRequestCompareFile: void;
  /** Fired when the user clicks the "Create New" button. */
  onRequestCreateNew: void;
  /** Fired when the user requests to switch from view to edit mode. */
  onRequestEditRights: void;
  /** Fired when the user opens the version history panel. Call `refreshHistory()` in response. */
  onRequestHistory: void;
  /** Fired when the user closes the version history panel. */
  onRequestHistoryClose: void;
  /** Fired when the user selects a specific version. Call `setHistoryData()` in response. */
  onRequestHistoryData: RequestHistoryDataData;
  /** Fired when the user clicks "Image from Storage". Call `insertImage()` in response. */
  onRequestInsertImage: RequestInsertImageData;
  /**
   * Fired when the user selects mail merge recipients.
   * @deprecated Use `onRequestSelectSpreadsheet` instead.
   */
  onRequestMailMergeRecipients: void;
  /** Fired when the user clicks "Open source" for an external reference. */
  onRequestOpen: RequestOpenData;
  /** Fired when the user clicks "Update values" for an external link. Call `setReferenceData()` in response. */
  onRequestReferenceData: RequestReferenceDataData;
  /** Fired when the user clicks "Change source" for an external link. Call `setReferenceSource()` in response. */
  onRequestReferenceSource: RequestReferenceSourceData;
  /** Fired when the document needs to be refreshed (replaces `onOutdatedVersion`). Call `refreshFile()` in response. */
  onRequestRefreshFile: void;
  /** Fired when the user renames the document from within the editor. */
  onRequestRename: RequestRenameData;
  /** Fired when the user clicks "Restore" in version history. Call `refreshHistory()` after restoring. */
  onRequestRestore: RequestRestoreData;
  /** Fired when the user clicks "Save Copy as...". */
  onRequestSaveAs: RequestSaveAsData;
  /** Fired when the user selects a document for comparing, combining, or inserting. Call `setRequestedDocument()` in response. */
  onRequestSelectDocument: RequestSelectDocumentData;
  /** Fired when the user selects a spreadsheet for mail merge. Call `setRequestedSpreadsheet()` in response. */
  onRequestSelectSpreadsheet: RequestSelectSpreadsheetData;
  /** Fired when a user is mentioned in a comment. Send notifications to the mentioned users. */
  onRequestSendNotify: RequestSendNotifyData;
  /** Fired when the user clicks "Change access rights". Call `setSharingSettings()` in response. */
  onRequestSharingSettings: void;
  /** Fired when the user clicks "Start filling" in PDF form mode. Call `startFilling()` in response. */
  onRequestStartFilling: void;
  /** Fired when the editor needs user data (for mentions, protection, or avatars). Call `setUsers()` in response. */
  onRequestUsers: RequestUsersData;
  /** Fired when a PDF form is submitted (force save type 3). */
  onSubmit: void;
  /** Fired when user action is required (e.g., password entry, encoding selection). */
  onUserActionRequired: void;
  /** Fired when a warning occurs. */
  onWarning: WarningData;
}

// ─── Event Handler Types ─────────────────────────────────────────────

/** Derives the callback signature for a specific event. Events with `void` payloads produce `() => void`; others produce `(event: Payload) => void`. */
export type EditorEventHandler<K extends EditorEventName> =
  EditorEventMap[K] extends void
    ? () => void
    : (event: EditorEventMap[K]) => void;

/** A record mapping every event name to its type-safe handler. Used in {@link import('./config.js').OnlyOfficeConfig.events}. */
export type EditorEventHandlers = {
  [K in EditorEventName]: EditorEventHandler<K>;
};

// ─── Generic Event Envelope ──────────────────────────────────────────

/** A generic event envelope used for internal message passing. */
export interface EditorEvent<T = unknown> {
  /** The event name. */
  type: EditorEventName;
  /** The event payload data. */
  data: T;
}
