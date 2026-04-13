export const STAGES = [
  'Eternal Stage',
  'Pulse Stage',
  'Secret Garden'
];

export const DAYS = ['SATURDAY', 'SUNDAY'];

// artistKey: `${day}__${stage}__${artist}`
export const ARTISTS = {
  SATURDAY: {
    'Eternal Stage': [
      'Chasedonaux',
      'Dimension',
      'Disco Lines',
      'Discovery Project',
      'Distant Matter',
      'DJ Mandy',
      'Eric Prydz',
      'KY William',
      'Sara Landry',
      'Starjunkies'
    ],
    'Pulse Stage': [
      'Effin',
      'Fly',
      'G Jones B2B Kream',
      'Lilly Palmer',
      'Mary Droppinz',
      'Ray Volpe',
      'Shizz Lo B2B Brainrack',
      'Woon Approvd',
      'Wooli',
      'Zeds Dead'
    ],
    'Secret Garden': [
      'Misha',
      'Nicole Moudaber B2B Chasewest',
      'Ranger Trucco',
      'Riordan B2B Bullet Tooth',
      'Ruze',
      'Shewolf',
      'Silvertone'
    ]
  },

  SUNDAY: {
    'Eternal Stage': [
      'Alleycvt',
      'Arylia',
      'Avello',
      'Excision B2B Sullivan King',
      'Gryfin (Sunset Set)',
      'Krream',
      'LP Giobbi',
      'Mau P',
      'Ninjarechi',
      'Porter Robinson (DJ Set)',
      'Probcause'
    ],
    'Pulse Stage': [
      'Avishek',
      'Cloonee',
      'Coco & Breezy',
      'Damon Pirko & Chase Norman',
      'Discip B2B Roody Lima',
      'Lipska',
      'Max Styler',
      'Sama'
    ],
    'Secret Garden': [
      'Cassian',
      'Cosmic Gate',
      'Ed Bailey',
      'Eli & Fur',
      'Hayla',
      'Queer Chaos',
      'Rezident',
      'Spencer Brown B2B Orion',
      'YDO'
    ]
  }
};

export function artistKey(day, stage, artist) {
  return `${day}__${stage}__${artist}`;
}
