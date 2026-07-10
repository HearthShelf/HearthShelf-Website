// Auto-tag rules for HearthShelf changelog line items.
//
// Each rule attaches its `tag` when any pattern matches the item's cleaned text
// (case-insensitive). An item may receive several tags. Kept deliberately short
// and tasteful - over-tagging makes the filter useless.
//
// Tagging is SERVER-SIDE ONLY: the product CI uploaders pass through explicit
// tags the author wrote, and this table is the single place content is inferred.
// Slugs are lowercase kebab-case and are the stable public tag vocabulary.

export interface TagRule {
  tag: string
  patterns: RegExp[]
}

export const TAG_RULES: TagRule[] = [
  // --- Platform / surface --------------------------------------------------
  // An Android Auto change is also an Android change, so items matching
  // "android auto" intentionally receive both `android-auto` and `android`.
  { tag: 'android-auto', patterns: [/\bandroid auto\b/i, /\bhead unit\b/i] },
  { tag: 'carplay', patterns: [/\bcarplay\b/i] },
  {
    tag: 'ios',
    patterns: [
      /\bios\b/i,
      /\biphone\b/i,
      /\bipad\b/i,
      /\bapple\b/i,
      /\btestflight\b/i,
      /\bcarplay\b/i,
    ],
  },
  {
    tag: 'android',
    patterns: [/\bandroid\b/i, /\bgoogle play\b/i, /\bplay store\b/i, /\.aab\b/i, /\bapk\b/i],
  },

  // --- Feature areas (audiobook app) ---------------------------------------
  { tag: 'offline', patterns: [/\boffline\b/i] },
  { tag: 'downloads', patterns: [/\bdownload(s|ed|ing)?\b/i] },
  { tag: 'sleep-timer', patterns: [/\bsleep(\s|-)?timer\b/i, /\bsleep mode\b/i] },
  {
    tag: 'player',
    patterns: [
      /\bplayer\b/i,
      /\bplayback\b/i,
      /\bnow playing\b/i,
      /\bmini[- ]?player\b/i,
      /\bchapter/i,
      /\bscrubb/i,
    ],
  },
  { tag: 'sync', patterns: [/\bsync(ed|ing|s)?\b/i, /\bprogress sync\b/i, /\bresume position\b/i] },
  {
    tag: 'sign-in',
    patterns: [
      /\bsign[- ]?in\b/i,
      /\bsign[- ]?up\b/i,
      /\blog[- ]?in\b/i,
      /\bauth(entication)?\b/i,
      /\bclerk\b/i,
    ],
  },
  { tag: 'series', patterns: [/\bseries\b/i] },
]

// Short human aliases -> canonical tag slug. Applied to explicit [..] / #..
// tokens an author writes in a commit subject so they need not remember exact
// slugs. Auto rules always emit canonical slugs directly.
export const TAG_ALIASES: Record<string, string> = {
  aa: 'android-auto',
  auto: 'android-auto',
  cp: 'carplay',
  apple: 'ios',
  iphone: 'ios',
  dl: 'downloads',
  sleep: 'sleep-timer',
}
