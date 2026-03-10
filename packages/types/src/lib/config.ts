import type { EditorEventHandlers } from './events.js';

// ─── Document ────────────────────────────────────────────────────────

/** Permission flags controlling what actions users can perform on the document. */
export interface DocumentPermissions {
  /** Allow chat functionality. */
  chat?: boolean;
  /** Allow commenting on the document. */
  comment?: boolean;
  /** Restrict commenting to specific user groups. Keys are action types (`edit`, `remove`, `view`), values are group name arrays. */
  commentGroups?: Record<string, string[]>;
  /** Allow copying content to the clipboard. */
  copy?: boolean;
  /** Only allow the comment author to delete their own comments. */
  deleteCommentAuthorOnly?: boolean;
  /** Allow downloading the document. */
  download?: boolean;
  /** Allow editing the document. */
  edit?: boolean;
  /** Only allow the comment author to edit their own comments. */
  editCommentAuthorOnly?: boolean;
  /** Allow filling forms in the document. */
  fillForms?: boolean;
  /** Allow modifying content controls (e.g., date pickers, combo boxes). */
  modifyContentControl?: boolean;
  /** Allow modifying spreadsheet filter settings. */
  modifyFilter?: boolean;
  /** Allow printing the document. */
  print?: boolean;
  /** Allow protecting the document (e.g., password-protecting ranges in spreadsheets). */
  protect?: boolean;
  /** Allow renaming the document from within the editor. */
  rename?: boolean;
  /** Allow reviewing (tracking changes) the document. */
  review?: boolean;
  /** Restrict review visibility to specific user groups. */
  reviewGroups?: string[];
  /** Restrict user info visibility to specific groups. */
  userInfoGroups?: string[];
}

/** Metadata about the document displayed in the editor info panel. */
export interface DocumentInfo {
  /** Whether the document is marked as a favorite. */
  favorite?: boolean;
  /** The folder path where the document is stored. */
  folder?: string;
  /** The name of the document owner. */
  owner?: string;
  /** List of users the document is shared with, along with their permissions. */
  sharingSettings?: DocumentSharingSettings[];
  /** The date the document was last uploaded, as an ISO 8601 string. */
  uploaded?: string;
}

/** Describes a single sharing entry for a document. */
export interface DocumentSharingSettings {
  /** Whether this sharing entry is a public link rather than a specific user. */
  isLink?: boolean;
  /** The permission level (e.g., `"Full Access"`, `"Read Only"`). */
  permissions?: string;
  /** The name of the user or the label for the link. */
  user?: string;
}

/** Data used to uniquely identify a document for cross-document references (e.g., external links in spreadsheets). */
export interface ReferenceData {
  /** Application-specific file identifier. */
  fileKey?: string;
  /** Identifier of the document server instance. */
  instanceId?: string;
  /** Unique document key matching {@link DocumentConfig.key}. */
  key?: string;
}

/** Configuration for the document being edited. */
export interface DocumentConfig {
  /** The file extension (e.g., `"docx"`, `"xlsx"`, `"pptx"`, `"pdf"`). */
  fileType: string;
  /** Unique document identifier used by the service to recognize the document. Must change when the document is modified externally. */
  key: string;
  /** The file name displayed in the editor title bar. */
  title: string;
  /** The absolute URL where Document Server can download the file. */
  url: string;
  /** Additional metadata displayed in the editor info panel. */
  info?: DocumentInfo;
  /** Permission flags controlling user actions on the document. */
  permissions?: DocumentPermissions;
  /** Reference data for cross-document linking. */
  referenceData?: ReferenceData;
}

// ─── Editor Config ───────────────────────────────────────────────────

/** Configuration for the current user. */
export interface UserConfig {
  /** Unique user identifier. Used for tracking changes, comments, and mentions. */
  id?: string;
  /** Display name shown in collaboration features. */
  name?: string;
  /** User group name for restricting commenting/reviewing to specific groups. */
  group?: string;
  /** URL to the user's avatar image displayed in the editor header and comments. */
  image?: string;
}

/** Real-time co-editing mode settings. */
export interface CoEditingConfig {
  /** Co-editing mode: `"fast"` shows changes in real time; `"strict"` shows changes only after saving. */
  mode?: 'fast' | 'strict';
  /** Whether users can switch between co-editing modes in the editor. */
  change?: boolean;
}

/** An entry in the "Recent files" list shown in the File menu. */
export interface RecentFileConfig {
  /** The folder path of the recent file. */
  folder?: string;
  /** The file name displayed in the list. */
  title?: string;
  /** The URL to open the recent file. */
  url?: string;
}

/** A template entry shown in the "Create New" dialog. */
export interface TemplateConfig {
  /** URL to a thumbnail image for the template. */
  image?: string;
  /** Display name of the template. */
  title?: string;
  /** URL to create a new document from this template. */
  url?: string;
}

/** Configuration for the editor in embedded mode (e.g., for previewing documents on a web page). */
export interface EmbeddedConfig {
  /** URL for the "Embed" button that opens the document in a new tab. */
  embedUrl?: string;
  /** URL for the "Full Screen" button. */
  fullscreenUrl?: string;
  /** URL for the "Save" button in embedded mode. */
  saveUrl?: string;
  /** URL for the "Share" button. */
  shareUrl?: string;
  /** Position of the embedded toolbar. */
  toolbarDocked?: 'top' | 'bottom';
}

/** Configuration for editor plugins. */
export interface PluginsConfig {
  /** Array of plugin GUIDs that should start automatically when the editor loads. */
  autostart?: string[];
  /** Key-value options passed to plugins at initialization. */
  options?: Record<string, unknown>;
  /** Array of URLs to `config.json` files describing each plugin. */
  pluginsData?: string[];
  /** Base URL for loading plugin assets. */
  url?: string;
}

// ─── Customization ──────────────────────────────────────────────────

/** Settings for anonymous user identification in collaborative editing. */
export interface AnonymousConfig {
  /** Whether to prompt anonymous users for a name before entering the editor. */
  request?: boolean;
  /** The default display label for anonymous users (e.g., `"Guest"`). */
  label?: string;
}

/** Branding information displayed in the "About" dialog and editor footer. */
export interface CustomerConfig {
  /** Company address. */
  address?: string;
  /** Additional company information. */
  info?: string;
  /** URL to the company logo image. */
  logo?: string;
  /** URL to the company logo for dark themes. */
  logoDark?: string;
  /** Company email address. */
  mail?: string;
  /** Company name. */
  name?: string;
  /** Company phone number. */
  phone?: string;
  /** Company website URL. */
  www?: string;
}

/** Custom logo displayed in the editor header. */
export interface LogoConfig {
  /** URL to the logo image for the standard (light) theme. */
  image?: string;
  /** URL to the logo image for the dark theme. */
  imageDark?: string;
  /** URL to the logo image used in embedded mode. */
  imageEmbedded?: string;
  /** URL the logo links to when clicked. */
  url?: string;
  /** Whether the logo is visible. Defaults to `true`. */
  visible?: boolean;
}

/** Configuration for the "Go back" button in the editor header. */
export interface GobackConfig {
  /** Whether to open the URL in a new browser tab. */
  blank?: boolean;
  /** Whether clicking "Go back" triggers `onRequestClose` instead of navigating. */
  requestClose?: boolean;
  /** Custom text for the "Go back" button. */
  text?: string;
  /** URL to navigate to when the button is clicked. */
  url?: string;
}

/** Configuration for the review (track changes) UI. */
export interface ReviewConfig {
  /** Hide the review display mode switcher. */
  hideReviewDisplay?: boolean;
  /** Show review changes on hover rather than inline. */
  hoverMode?: boolean;
  /** Default review display mode (e.g., `"markup"`, `"simple"`, `"final"`, `"original"`). */
  reviewDisplay?: string;
  /** Show the review changes panel on editor load. */
  showReviewChanges?: boolean;
  /** Enable track changes mode on editor load. */
  trackChanges?: boolean;
}

/** Configuration for editor features like tab styling and spellcheck. */
export interface FeaturesConfig {
  /** Enable the roles UI in form editing. */
  roles?: boolean;
  /** Background color for sheet tabs (spreadsheets only). */
  tabBackground?: string;
  /** Style for sheet tabs: `"fill"` for colored backgrounds, `"line"` for a colored underline. */
  tabStyle?: 'fill' | 'line';
  /** Spellcheck configuration. */
  spellcheck?: SpellcheckConfig;
}

/** Spellcheck settings. */
export interface SpellcheckConfig {
  /** Whether spellcheck is enabled by default. */
  mode?: boolean;
  /** Whether users can toggle spellcheck on/off. */
  change?: boolean;
}

/** Extensive UI customization options for the editor. */
export interface CustomizationConfig {
  /** Anonymous user settings for collaborative editing. */
  anonymous?: AnonymousConfig;
  /** Enable automatic saving. Defaults to `true`. */
  autosave?: boolean;
  /** Configuration for the close button. */
  close?: CloseConfig;
  /** Show the comments panel button in the toolbar. */
  comments?: boolean;
  /** Use a compact editor header (merges the menu bar and toolbar). */
  compactHeader?: boolean;
  /** Use a compact (single-line) toolbar. */
  compactToolbar?: boolean;
  /** Enable compatibility mode with older document formats. */
  compatibleFeatures?: boolean;
  /** Branding information shown in the "About" dialog. */
  customer?: CustomerConfig;
  /** Feature toggles for tabs, roles, and spellcheck. */
  features?: FeaturesConfig;
  /** Feedback/support button configuration. */
  feedback?: FeedbackConfig;
  /** Enable manual "Force Save" button. */
  forcesave?: boolean;
  /** "Go back" button configuration in the editor header. */
  goback?: GobackConfig;
  /** Show the "Help" menu item. */
  help?: boolean;
  /** Hide the notes panel in presentations. */
  hideNotes?: boolean;
  /** Hide the right-side panel. */
  hideRightMenu?: boolean;
  /** Hide the horizontal and vertical rulers (documents only). */
  hideRulers?: boolean;
  /** Set to `"embed"` to enable a minimal embedded integration mode. */
  integrationMode?: 'embed';
  /** Custom logo configuration for the editor header. */
  logo?: LogoConfig;
  /** Enable the macros button in the toolbar. */
  macros?: boolean;
  /** Default macros execution policy: `"warn"` prompts, `"enable"` runs automatically, `"disable"` blocks execution. */
  macrosMode?: 'warn' | 'enable' | 'disable';
  /** Enable mention sharing (shows the sharing dialog when mentioning a non-collaborator). */
  mentionShare?: boolean;
  /** Force the mobile view mode regardless of screen size. */
  mobileForceView?: boolean;
  /** Show the plugins button in the toolbar. */
  plugins?: boolean;
  /** Review (track changes) UI configuration. */
  review?: ReviewConfig;
  /** Show the "Submit Form" button for PDF form editing. */
  submitForm?: boolean;
  /** Hide the file name in the toolbar. */
  toolbarHideFileName?: boolean;
  /** Hide the tab bar below the toolbar (shows all tools in a single strip). */
  toolbarNoTabs?: boolean;
  /** UI theme identifier (e.g., `"theme-light"`, `"theme-dark"`, `"theme-contrast-dark"`). */
  uiTheme?: string;
  /** Default measurement unit for rulers and dialogs. */
  unit?: 'cm' | 'pt' | 'inch';
  /** Default zoom percentage (e.g., `100`). */
  zoom?: number;
}

/** Configuration for the close button in the editor header. */
export interface CloseConfig {
  /** Whether the close button is visible. */
  visible?: boolean;
  /** Custom text for the close button. */
  text?: string;
}

/** Configuration for the feedback/support button. */
export interface FeedbackConfig {
  /** URL to the feedback or support page. */
  url?: string;
  /** Whether the feedback button is visible. */
  visible?: boolean;
}

// ─── EditorConfig ───────────────────────────────────────────────────

/** Editor-level configuration controlling user identity, language, plugins, and UI customization. */
export interface EditorConfig {
  /** An action link object used to scroll to a specific bookmark or position on editor load. Typically received from `onMakeActionLink`. */
  actionLink?: Record<string, unknown>;
  /** The absolute URL Document Server will POST save/autosave requests to. */
  callbackUrl?: string;
  /** Real-time co-editing mode configuration. */
  coEditing?: CoEditingConfig;
  /** URL for the "Create New" button; opens a blank document at this address. */
  createUrl?: string;
  /** UI customization options (branding, layout, toolbars, etc.). */
  customization?: CustomizationConfig;
  /** Embedded mode URLs (share, save, embed, fullscreen). Only used when `type` is `"embedded"`. */
  embedded?: EmbeddedConfig;
  /** Editor interface language as a locale code (e.g., `"en"`, `"fr"`, `"de"`). */
  lang?: string;
  /** Deprecated. Use `region` instead. */
  location?: string;
  /** Editor mode: `"edit"` for full editing, `"view"` for read-only viewing. */
  mode?: 'edit' | 'view';
  /** Plugin configuration (auto-start plugins, plugin data URLs). */
  plugins?: PluginsConfig;
  /** List of recent files shown in the File menu. */
  recent?: RecentFileConfig[];
  /** Regional format settings (affects date/number formatting), as a locale code. */
  region?: string;
  /** Templates shown in the "Create New" dialog. */
  templates?: TemplateConfig[];
  /** Current user identity and display information. */
  user?: UserConfig;
}

// ─── Top-level Config ───────────────────────────────────────────────

/**
 * Top-level configuration object passed to the OnlyOffice Document Server API.
 *
 * @see https://api.onlyoffice.com/docs/docs-api/usage-api/config/
 */
export interface OnlyOfficeConfig {
  /** Document metadata, permissions, and download URL. */
  document: DocumentConfig;
  /** The document category: `"word"` for text, `"cell"` for spreadsheets, `"slide"` for presentations, `"pdf"` for PDF forms. */
  documentType?: 'word' | 'cell' | 'slide' | 'pdf';
  /** Editor-level settings (user, language, customization, plugins). */
  editorConfig?: EditorConfig;
  /** Event handler callbacks for editor lifecycle and user actions. */
  events?: Partial<EditorEventHandlers>;
  /** Editor iframe height (e.g., `"100%"`, `"550px"`). Defaults to `"100%"`. */
  height?: string;
  /** Encrypted JWT token for request validation. When set, Document Server verifies all requests against this token. */
  token?: string;
  /** Platform type: `"desktop"` for full UI, `"mobile"` for touch-optimized, `"embedded"` for minimal read-only view. */
  type?: 'desktop' | 'mobile' | 'embedded';
  /** Editor iframe width (e.g., `"100%"`). Defaults to `"100%"`. */
  width?: string;
}
