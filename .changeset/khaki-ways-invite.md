---
'@byterygon/onlyoffice-kit-core': minor
---

Implement OnlyOffice editor bootstrapping through the web component bridge and MessageChannel protocol.

Add `Controller#setConfig(nextConfig)` with hybrid runtime updates:

- changes in `config.events` update callback references without recreating the editor
- changes in core config recreate the editor instance in the iframe bridge

Forward full typed editor events from the iframe bridge back to `Controller` event callbacks.
