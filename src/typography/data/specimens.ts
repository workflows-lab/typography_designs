import type { Language } from "../types";

export const LANGUAGES: Record<Language, { label: string; native: string; htmlLang: string }> = {
  en: { label: "English", native: "English", htmlLang: "en" },
  el: { label: "Greek", native: "Ελληνικά", htmlLang: "el" },
};

export const SPECIMEN_TEXT: Record<
  Language,
  { pangram: string; headline: string; short: string; paragraph: string; ampersand: string }
> = {
  en: {
    pangram: "Sphinx of black quartz, judge my vow.",
    headline: "Letters carry the voice of a place.",
    short: "Rhythm & Form",
    paragraph:
      "Typography is the craft of arranging text so that it reads with ease and carries character. A good type system balances contrast, rhythm and white space, and performs equally well in Greek and in English.",
    ampersand: "Aa",
  },
  el: {
    pangram: "Ξεσκεπάζω την ψυχοφθόρα βδελυγμία.",
    headline: "Τα γράμματα κουβαλούν τη φωνή ενός τόπου.",
    short: "Ρυθμός & Μορφή",
    paragraph:
      "Η τυπογραφία είναι η τέχνη να οργανώνεις το κείμενο ώστε να διαβάζεται με άνεση και να αποκτά χαρακτήρα. Ένα καλό τυπογραφικό σύστημα ισορροπεί την αντίθεση, τον ρυθμό και το λευκό διάστημα, και λειτουργεί εξίσου καλά στα ελληνικά και στα αγγλικά.",
    ampersand: "Αα",
  },
};

export const GLYPH_SETS = {
  latinUpper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  latinLower: "abcdefghijklmnopqrstuvwxyz",
  figures: "0123456789",
  punctuation: "& ? ! . , ; : ' \" ( ) [ ] @ # % * — – « » € $",
  greekUpper: "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ",
  greekLower: "αβγδεζηθικλμνξοπρσςτυφχψω",
  greekTonos: "ά έ ή ί ό ύ ώ ϊ ϋ ΐ ΰ Ά Έ Ή Ί Ό Ύ Ώ Ϊ Ϋ",
  /** Requires the greek-ext subset. */
  greekPolytonic: "Ἐν ἀρχῇ ἦν ὁ λόγος · ἁ ἃ ᾶ ᾳ ῥ ὦ ῷ",
} as const;

/** A short bilingual line used where both scripts appear together. */
export const BILINGUAL_LINE = "Αθήνα — Athens";
