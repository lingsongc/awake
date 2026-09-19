export interface ClueItem {
  id: string;
  name: string;
  category: 'physical' | 'testimony' | 'mirror' | 'event';
  shortDesc: string;
  fullEvidence: string;
  sceneOrigin: string;
  badgeText?: string;
}

export interface Hotspot {
  id: string;
  name: string;
  clueId: string;
  x: number; // left %
  y: number; // top %
  width: number; // width %
  height: number; // height %
  examineLines: { speaker: string; text: string }[];
  hint: string;
}

// Clue Catalog across Acts
export const CLUES_DATABASE: Record<string, ClueItem> = {
  // Act 1: Bedroom Search Clues
  c_phone: {
    id: 'c_phone',
    name: 'Unlocked Phone (34 unread messages)',
    category: 'physical',
    shortDesc: 'Messages from boss & mum asking where you are',
    fullEvidence: 'Group chats and direct messages from Mum and colleagues since Monday: "Jun where are you? Are you sick? Please reply." Time on screen is 4:12 AM.',
    sceneOrigin: 'Act 1: Bedroom Nightstand',
    badgeText: 'PHYSICAL',
  },
  c_paranoia: {
    id: 'c_paranoia',
    name: 'Locked Door & Taped Seams',
    category: 'physical',
    shortDesc: 'Deadbolts locked, tape sealing window and door frames',
    fullEvidence: 'The room was sealed and fortified from the inside. Tape covers the vents and door crack. The deadbolt was turned shut from within.',
    sceneOrigin: 'Act 1: Bedroom Doorway',
    badgeText: 'PHYSICAL',
  },
  c_supplies: {
    id: 'c_supplies',
    name: 'Scattered Foil & Plastic Straws',
    category: 'physical',
    shortDesc: 'Foil packets, crushed bottles, and a chemical smell',
    fullEvidence: 'Crushed plastic bottles, discarded foil, cut straws, and a lingering bitter chemical smell. None of this was brought by an intruder.',
    sceneOrigin: 'Act 1: Bedroom Floor',
    badgeText: 'PHYSICAL',
  },

  // Act 2: Testimonies & Action
  t_mum: {
    id: 't_mum',
    name: "Mum's Testimony (Jade Bracelet)",
    category: 'testimony',
    shortDesc: '"You locked your door since Monday. Your heart was pounding."',
    fullEvidence: '"Jun... you locked your door since Monday. Your heart... I could hear it pounding through the door..."',
    sceneOrigin: 'Act 2: Living Room',
    badgeText: 'TESTIMONY',
  },
  t_ravi: {
    id: 't_ravi',
    name: "Ravi's Testimony (Red Cap)",
    category: 'testimony',
    shortDesc: '"You called me at 3 AM saying people were outside."',
    fullEvidence: '"You called me at 3 AM. Said there were people outside your window. Jun... there is no one outside. Your pupils are huge and you\'re drenched in sweat."',
    sceneOrigin: 'Act 2: Living Room',
    badgeText: 'TESTIMONY',
  },
  t_aisyah: {
    id: 't_aisyah',
    name: "Aisyah's Testimony (Yellow Hairclip)",
    category: 'testimony',
    shortDesc: '"You haven\'t eaten since Tuesday. You looked like you were burning."',
    fullEvidence: '"You haven\'t eaten since Tuesday. Your skin was burning up. We brought food. You wouldn\'t unlock."',
    sceneOrigin: 'Act 2: Living Room',
    badgeText: 'TESTIMONY',
  },
  c_step_back: {
    id: 'c_step_back',
    name: 'Reaction to Offered Water',
    category: 'event',
    shortDesc: 'Fearful recoil when a glass of water was held out',
    fullEvidence: 'When the figure in the red cap stepped forward holding a glass of water, Jun retreated in alarm, misinterpreting the gesture as a threat.',
    sceneOrigin: 'Act 2: Living Room',
    badgeText: 'EVENT',
  },

  // Act 3: Mirror Hotspots
  m_eyes: {
    id: 'm_eyes',
    name: 'Dilated Pupils & Sleepless Eyes',
    category: 'mirror',
    shortDesc: 'Enlarged pupils and dark hollows from prolonged sleeplessness',
    fullEvidence: 'The pupils are dilated so wide that the dark center fills almost the entire iris. Deep, bruised rings encircle the eyes after sleepless nights.',
    sceneOrigin: 'Act 3: Hallway Mirror',
    badgeText: 'OBSERVATION',
  },
  m_jaw: {
    id: 'm_jaw',
    name: 'Clenched Jaw & Parched Lips',
    category: 'mirror',
    shortDesc: 'Tight involuntary clenching, dry chapped lips',
    fullEvidence: 'The jaw muscles are locked in a tight clench. The lips are severely parched and dry from acute dehydration.',
    sceneOrigin: 'Act 3: Hallway Mirror',
    badgeText: 'OBSERVATION',
  },
  m_hands: {
    id: 'm_hands',
    name: 'Trembling Hands & Rapid Pulse',
    category: 'mirror',
    shortDesc: 'Shaking fingers, sweating palms, and visible rapid pulse',
    fullEvidence: 'Hands are trembling noticeably against the counter edge. A rapid pulse beats visibly in the neck.',
    sceneOrigin: 'Act 3: Hallway Mirror',
    badgeText: 'OBSERVATION',
  },
};

// Act 1 Hotspots (Bedroom) - Aligned with SVG bedroom 1920x1080 coordinate space
export const ACT1_HOTSPOTS: Hotspot[] = [
  {
    id: 'hs_phone',
    name: 'Glowing Phone on Bedside',
    clueId: 'c_phone',
    x: 35,
    y: 50,
    width: 12,
    height: 18,
    hint: 'A phone screen glows softly beside the mattress.',
    examineLines: [
      { speaker: '(N)', text: 'The screen is lit. 34 unread messages.' },
      { speaker: '(N)', text: 'Mum: "Jun where are you? Answer me please."' },
      { speaker: '(N)', text: 'Team lead: "Third day missing. We called your emergency contact."' },
      { speaker: '(N)', text: 'Clue recorded: Phone with urgent messages from family and friends.' },
    ],
  },
  {
    id: 'hs_door',
    name: 'Fortified Doorway & Deadbolt',
    clueId: 'c_paranoia',
    x: 75,
    y: 15,
    width: 17,
    height: 55,
    hint: 'Heavy tape and locks line the bedroom door.',
    examineLines: [
      { speaker: '(N)', text: 'The deadbolt is thrown shut. Heavy tape lines the edges of the frame.' },
      { speaker: '(N)', text: 'The barricade was set from the inside, out of overwhelming fear of imaginary threats outside.' },
      { speaker: '(N)', text: 'Clue recorded: Sealed bedroom door, locked from within.' },
    ],
  },
  {
    id: 'hs_supplies',
    name: 'Scattered Items on Floor',
    clueId: 'c_supplies',
    x: 54,
    y: 53,
    width: 16,
    height: 16,
    hint: 'Crushed plastic bottles, cut straws, and discarded foil on the floor.',
    examineLines: [
      { speaker: '(N)', text: 'Crushed plastic bottles. Cut straws. Discarded foil.' },
      { speaker: '(N)', text: 'A sharp, bitter chemical odor clings to the bedroom carpet.' },
      { speaker: '(N)', text: 'Clue recorded: Scattered foil and supplies on the floor.' },
    ],
  },
];

// Act 3 Hotspots (The Mirror) - Aligned with mirror reflection & vanity
export const ACT3_HOTSPOTS: Hotspot[] = [
  {
    id: 'hs_eyes',
    name: 'Examine the eyes',
    clueId: 'm_eyes',
    x: 44,
    y: 24,
    width: 12,
    height: 12,
    hint: 'Look closely into the eyes in the mirror reflection.',
    examineLines: [
      { speaker: '(N)', text: 'The pupils fill almost the entire eye. Dark hollow circles beneath them.' },
      { speaker: '(N)', text: 'The look of someone whose mind and body have not rested in several days.' },
      { speaker: '(N)', text: 'Observation recorded: Dilated pupils and severe exhaustion.' },
    ],
  },
  {
    id: 'hs_jaw',
    name: 'Examine the jaw & mouth',
    clueId: 'm_jaw',
    x: 44,
    y: 38,
    width: 12,
    height: 12,
    hint: 'Inspect the lower face and mouth in the reflection.',
    examineLines: [
      { speaker: '(N)', text: 'The jaw is locked in a tight clench, teeth grinding involuntarily.' },
      { speaker: '(N)', text: 'Lips are parched, dry, and cracked.' },
      { speaker: '(N)', text: 'Observation recorded: Involuntary jaw clenching and dehydration.' },
    ],
  },
  {
    id: 'hs_hands',
    name: 'Examine the hands & chest',
    clueId: 'm_hands',
    x: 36,
    y: 56,
    width: 28,
    height: 18,
    hint: 'Look at the hands gripping the edge of the vanity.',
    examineLines: [
      { speaker: '(N)', text: 'Fingers trembling uncontrollably against the counter.' },
      { speaker: '(N)', text: 'A racing pulse is visible in the side of the neck.' },
      { speaker: '(N)', text: 'Observation recorded: Trembling hands and racing pulse.' },
    ],
  },
];
