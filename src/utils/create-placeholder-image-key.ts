// Backend has no real photo upload/imageKey issuance API yet. This produces a
// temporary, non-uploaded placeholder so the turn-submit flow can be exercised
// end-to-end; swap this implementation once a real upload endpoint exists.
export function createPlaceholderImageKey(file: File): string {
  return `local-preview/${Date.now()}-${file.name}`;
}
