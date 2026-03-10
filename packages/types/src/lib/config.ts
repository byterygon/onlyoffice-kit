export interface DocumentConfig {
  fileType: string;
  key: string;
  title: string;
  url: string;
}

export interface EditorConfig {
  callbackUrl?: string;
  lang?: string;
  mode?: 'edit' | 'view';
}

export interface OnlyOfficeConfig {
  document: DocumentConfig;
  editorConfig?: EditorConfig;
  documentType?: 'word' | 'cell' | 'slide';
  type?: 'desktop' | 'mobile' | 'embedded';
  width?: string;
  height?: string;
}
