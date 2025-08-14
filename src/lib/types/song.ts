export interface Song {
  title: string;
  lyrics: string;
  tonality: string;
  youtubeLink: string;
  musicPath: string;
  composer1: string;
  composer2?: string;
  lyricist1: string;
  lyricist2?: string;
  singer1: string;
  singer2?: string;
  singer3?: string;
  year: string;
}

export interface RawSongData {
  "Τίτλος τραγουδιού": string;
  "Στίχοι του τραγουδιού": string;
  "ΤΟΝΙΚΗ": string;
  "LINK_YOUTUBE": string;
  "Musicpath": string;
  "Συνθέτης_1": string;
  "Συνθέτης_2"?: string;
  "Στιχουργός_1": string;
  "Στιχουργός_2"?: string;
  "Τραγουδιστής_1": string;
  "Τραγουδιστής_2"?: string;
  "Τραγουδιστής_3"?: string;
  "Έτος": string;
}