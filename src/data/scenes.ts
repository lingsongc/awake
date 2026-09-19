import { Scene } from '../types';

export const SCENES: Record<string, Scene> = {
  title: {
    id: 'title',
    type: 'title',
    bg: 'bg_bedroom',
    mode: 'hallucination',
    characters: [],
    lines: [],
    nextSceneId: 'act1_room',
    titleData: {
      title: 'WIDE AWAKE',
      subtitle: 'Something is wrong with this house.',
      buttonText: 'Tap to wake up',
    },
  },

  act1_room: {
    id: 'act1_room',
    type: 'search',
    bg: 'bg_bedroom',
    mode: 'hallucination',
    characters: [],
    lines: [
      {
        speaker: '(N)',
        text: '4:12 AM. Something is wrong with this house.',
      },
      {
        speaker: '(N)',
        text: 'Inspect the room. Hear their stories. Reconsider the evidence.',
      },
    ],
    nextSceneId: 'act2_suspects',
  },

  act2_suspects: {
    id: 'act2_suspects',
    type: 'question_menu',
    bg: 'bg_living',
    mode: 'hallucination',
    characters: [
      { id: 'mum', position: 'left', variant: 'monster' },
      { id: 'ravi', position: 'center', variant: 'monster' },
      { id: 'aisyah', position: 'right', variant: 'monster' },
    ],
    lines: [
      {
        speaker: '(N)',
        text: 'Three figures are waiting in the living room.',
      },
      {
        speaker: '(N)',
        text: "One wears Mum's jade bracelet. One wears Ravi's red cap. One wears Aisyah's yellow cardigan.",
      },
      {
        speaker: '(N)',
        text: 'Whatever they are, they know something. Question them to hear their stories.',
      },
    ],
    choices: [
      {
        id: 'q_mum',
        text: 'Question the one with the jade bracelet',
        nextSceneId: 'act2_mum_testimony',
        addClue: 't_mum',
      },
      {
        id: 'q_ravi',
        text: 'Question the one with the red cap',
        nextSceneId: 'act2_ravi_testimony',
        addClue: 't_ravi',
      },
      {
        id: 'q_aisyah',
        text: 'Question the one with the yellow cardigan',
        nextSceneId: 'act2_aisyah_testimony',
        addClue: 't_aisyah',
      },
    ],
  },

  act2_mum_testimony: {
    id: 'act2_mum_testimony',
    type: 'dialogue',
    bg: 'bg_living',
    mode: 'hallucination',
    characters: [{ id: 'mum', position: 'center', variant: 'monster' }],
    lines: [
      {
        speaker: '??? (jade bracelet)',
        text: 'Jun... you locked your door [since Monday]. [Your heart]... I could hear it [pounding through the door]...',
        characterId: 'mum',
      },
      {
        speaker: '(N)',
        text: "Testimony recorded: Mum's voice. She's been listening with worry through the bedroom door.",
      },
    ],
    nextSceneId: 'act2_suspects',
  },

  act2_ravi_testimony: {
    id: 'act2_ravi_testimony',
    type: 'dialogue',
    bg: 'bg_living',
    mode: 'hallucination',
    characters: [{ id: 'ravi', position: 'center', variant: 'monster' }],
    lines: [
      {
        speaker: '??? (red cap)',
        text: "Look like WHAT? [Jun, it's us.] [Your pupils are huge], bro... [you're drenched in sweat].",
        characterId: 'ravi',
      },
      {
        speaker: '(N)',
        text: "Testimony recorded: Ravi's voice. He noticed trembling, sweating, and sleeplessness.",
      },
    ],
    nextSceneId: 'act2_suspects',
  },

  act2_aisyah_testimony: {
    id: 'act2_aisyah_testimony',
    type: 'dialogue',
    bg: 'bg_living',
    mode: 'hallucination',
    characters: [{ id: 'aisyah', position: 'center', variant: 'monster' }],
    lines: [
      {
        speaker: '??? (yellow cardigan)',
        text: '[Ever since that party]... [did someone give you something?] [Did you take something?]',
        characterId: 'aisyah',
      },
      {
        speaker: '(N)',
        text: 'Testimony recorded: Aisyah\'s voice. She is urging everyone to seek emergency medical help.',
      },
    ],
    nextSceneId: 'act2_suspects',
  },

  act2_reach: {
    id: 'act2_reach',
    type: 'choice',
    bg: 'bg_living',
    mode: 'hallucination',
    characters: [{ id: 'ravi', position: 'center', variant: 'monster' }],
    lines: [
      {
        speaker: '(N)',
        text: 'The figure in the red cap steps closer, holding out a glass of water.',
      },
      {
        speaker: '??? (red cap)',
        text: '[Here. Just drink some water.]',
        characterId: 'ravi',
      },
    ],
    choicePrompt: 'How do you react to the offered glass?',
    choices: [
      {
        id: 'c_step_back',
        text: 'Option A: Step back in fear',
        nextSceneId: 'act2_step_back_outcome',
        setFlags: { steppedBack: true },
        addClue: 'c_step_back',
      },
      {
        id: 'c_stay_still',
        text: 'Option B: Stay still',
        nextSceneId: 'act2_stay_still_outcome',
        setFlags: { steppedBack: false },
      },
    ],
  },

  act2_step_back_outcome: {
    id: 'act2_step_back_outcome',
    type: 'dialogue',
    bg: 'bg_living',
    mode: 'hallucination',
    characters: [{ id: 'ravi', position: 'center', variant: 'monster' }],
    lines: [
      {
        speaker: '(N)',
        text: 'I stepped back in alarm. Ravi immediately lowers his hands and sets the glass gently on the table.',
      },
      {
        speaker: '??? (red cap)',
        text: "[It's okay, Jun. We're not crowding you. Take your time.]",
        characterId: 'ravi',
      },
      {
        speaker: '(N)',
        text: 'I turn toward the hallway mirror.',
      },
    ],
    nextSceneId: 'act3_mirror',
  },

  act2_stay_still_outcome: {
    id: 'act2_stay_still_outcome',
    type: 'dialogue',
    bg: 'bg_living',
    mode: 'hallucination',
    characters: [{ id: 'ravi', position: 'center', variant: 'monster' }],
    lines: [
      {
        speaker: '(N)',
        text: 'I stood motionless. Ravi places the glass on the table within reach and steps back.',
      },
      {
        speaker: '??? (red cap)',
        text: "[The water is here on the table whenever you're ready.]",
        characterId: 'ravi',
      },
      {
        speaker: '(N)',
        text: 'I turn toward the hallway mirror.',
      },
    ],
    nextSceneId: 'act3_mirror',
  },

  act3_mirror: {
    id: 'act3_mirror',
    type: 'search',
    bg: 'bg_hallway',
    mode: 'hallucination',
    characters: [{ id: 'jun', position: 'center', variant: 'human' }],
    lines: [
      {
        speaker: '(N)',
        text: 'The hallway mirror. The reflection is the only thing that looks familiar.',
      },
      {
        speaker: '(N)',
        text: 'Examine the reflection to understand what is happening to the body.',
      },
    ],
    nextSceneId: 'act4_deduction',
  },

  act4_deduction: {
    id: 'act4_deduction',
    type: 'deduction',
    bg: 'bg_hallway',
    mode: 'hallucination',
    characters: [],
    lines: [
      {
        speaker: '(N)',
        text: 'Two key questions to piece together what happened tonight.',
      },
      {
        speaker: '(N)',
        text: 'Reconsider the evidence to separate fear from reality.',
      },
    ],
    nextSceneId: 'reveal',
  },

  reveal: {
    id: 'reveal',
    type: 'cutscene',
    bg: 'bg_living',
    mode: 'clean',
    characters: [],
    lines: [
      {
        speaker: '(N)',
        text: 'The threat was never an external intruder in the apartment.',
      },
      {
        speaker: '(N)',
        text: 'Jun was experiencing severe distress, sleeplessness, and substance-induced perception changes.',
      },
      {
        speaker: '(N)',
        text: 'The people he feared were his family and closest friends, trying to keep him safe.',
      },
    ],
    nextSceneId: 'casefile',
  },

  casefile: {
    id: 'casefile',
    type: 'casefile',
    bg: 'bg_bedroom',
    mode: 'clean',
    characters: [],
    lines: [
      {
        speaker: '(N)',
        text: 'RECONSIDER THE EVIDENCE: What was happening.',
      },
      {
        speaker: '(N)',
        text: 'Examine each record to see the reality behind the hallucinations.',
      },
    ],
    nextSceneId: 'flashback',
  },

  flashback: {
    id: 'flashback',
    type: 'cutscene',
    bg: 'bg_living',
    mode: 'clean',
    characters: [
      { id: 'mum', position: 'left', variant: 'human' },
      { id: 'ravi', position: 'center', variant: 'human' },
      { id: 'aisyah', position: 'right', variant: 'human' },
    ],
    lines: [
      {
        speaker: 'MUM',
        text: "(holding Jun's hands gently) The terrifying figures you saw were our shadows at the door, Jun. We were so frightened when you locked yourself in for three days.",
        characterId: 'mum',
      },
      {
        speaker: 'AISYAH',
        text: "(speaking gently) We're right here with you, Jun. We called for professional medical help. The paramedics are arriving to provide medical care.",
        characterId: 'aisyah',
      },
      {
        speaker: '(N)',
        text: 'The distortion lifted so Jun could see his loved ones, but medical stabilization and recovery have just begun.',
      },
    ],
    nextSceneId: 'end',
  },

  end: {
    id: 'end',
    type: 'end',
    bg: 'bg_bedroom',
    mode: 'clean',
    characters: [],
    lines: [],
  },
};

export const INITIAL_GAME_STATE = {
  currentSceneId: 'title',
  currentLineIndex: 0,
  mode: 'hallucination' as const,
  clues: [] as string[],
  questioned: [] as ('mum' | 'ravi' | 'aisyah')[],
  flags: {
    steppedBack: false,
  },
};
