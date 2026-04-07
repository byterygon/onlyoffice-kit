export type {
  // Document
  DocumentConfig,
  DocumentInfo,
  DocumentPermissions,
  DocumentSharingSettings,
  ReferenceData,
  // Editor config
  EditorConfig,
  UserConfig,
  CoEditingConfig,
  RecentFileConfig,
  TemplateConfig,
  EmbeddedConfig,
  PluginsConfig,
  // Customization
  CustomizationConfig,
  AnonymousConfig,
  CloseConfig,
  CustomerConfig,
  FeaturesConfig,
  FeedbackConfig,
  GobackConfig,
  LogoConfig,
  ReviewConfig,
  SpellcheckConfig,
  // Top-level
  OnlyOfficeConfig,
} from './config.js';
export type {
  EditorEventName,
  EditorEvent,
  EditorEventMap,
  EditorEventHandler,
  EditorEventHandlers,
  // Event data types
  DocumentStateChangeData,
  DownloadAsData,
  ErrorData,
  InfoData,
  MakeActionLinkData,
  MetaChangeData,
  RequestHistoryDataData,
  RequestInsertImageData,
  RequestOpenData,
  RequestReferenceDataData,
  RequestReferenceSourceData,
  RequestRenameData,
  RequestRestoreData,
  RequestSaveAsData,
  RequestSelectDocumentData,
  RequestSelectSpreadsheetData,
  RequestSendNotifyData,
  RequestUsersData,
  WarningData,
} from './events.js';
export type {
  EditorMessage,
  CommandMessage,
  EventMessage,
} from './messages.js';
export type {
  PluginDescriptor,
  DefinePluginInput,
  PluginContext,
} from './plugin.js';
