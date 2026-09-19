/**
 * WIDE AWAKE - Typed Asset Manifest
 * Single source of truth for all project assets, paths, fallbacks, and metadata.
 */

export interface ProjectAsset {
  key: string;
  filename: string;
  label: string;
  type: 'background' | 'character' | 'prop' | 'ui';
  path: string;
  requiredFor: string;
}

// Base URL helper to support standard web hosting and subpath deployments
const BASE =
  typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
    ? import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`
    : '/';

export const getAssetUrl = (filename: string): string =>
  `${BASE}assets/${filename}`;

export const PROJECT_ASSETS: ProjectAsset[] = [
  // Backgrounds
  {
    key: 'bg_bedroom',
    filename: 'bg_bedroom.png',
    label: 'HDB Bedroom (Taped Windows & Fortified Door)',
    type: 'background',
    path: getAssetUrl('bg_bedroom.png'),
    requiredFor: 'Act 1: Investigation & Bedroom Search',
  },
  {
    key: 'bg_living',
    filename: 'bg_living.png',
    label: 'HDB Living Room (Sofa & Table)',
    type: 'background',
    path: getAssetUrl('bg_living.png'),
    requiredFor: 'Act 2: Witness Confrontation & Flashback',
  },
  {
    key: 'bg_hallway',
    filename: 'bg_hallway.png',
    label: 'HDB Hallway (Vanity Wall Mirror)',
    type: 'background',
    path: getAssetUrl('bg_hallway.png'),
    requiredFor: 'Act 3: Mirror Self-Observation',
  },

  // Characters - Mum
  {
    key: 'mum_monster',
    filename: 'mum_monster.png',
    label: 'Mum (Weeping Specter / Jade Bracelet)',
    type: 'character',
    path: getAssetUrl('mum_monster.png'),
    requiredFor: 'Act 2: Suspects Confrontation',
  },
  {
    key: 'mum_human',
    filename: 'mum_human.png',
    label: 'Mum (Mrs. Tan / Human Mother with Food)',
    type: 'character',
    path: getAssetUrl('mum_human.png'),
    requiredFor: 'Flashback & Casefile Truth',
  },

  // Characters - Ravi
  {
    key: 'ravi_monster',
    filename: 'ravi_monster.png',
    label: 'Ravi (Approaching Threat / Red Cap)',
    type: 'character',
    path: getAssetUrl('ravi_monster.png'),
    requiredFor: 'Act 2: Living Room Reach',
  },
  {
    key: 'ravi_human',
    filename: 'ravi_human.png',
    label: 'Ravi (Close Friend / Red Cap Offering Water)',
    type: 'character',
    path: getAssetUrl('ravi_human.png'),
    requiredFor: 'Flashback & Casefile Truth',
  },

  // Characters - Aisyah
  {
    key: 'aisyah_monster',
    filename: 'aisyah_monster.png',
    label: 'Aisyah (Surveillance Figure / Yellow Cardigan)',
    type: 'character',
    path: getAssetUrl('aisyah_monster.png'),
    requiredFor: 'Act 2: Suspects Confrontation',
  },
  {
    key: 'aisyah_human',
    filename: 'aisyah_human.png',
    label: 'Aisyah (Colleague / Yellow Cardigan with Support Contacts)',
    type: 'character',
    path: getAssetUrl('aisyah_human.png'),
    requiredFor: 'Flashback & Casefile Truth',
  },

  // Characters - Jun
  {
    key: 'jun_mirror',
    filename: 'jun_mirror.png',
    label: "Jun in Hallway Mirror (Physiological Symptoms)",
    type: 'character',
    path: getAssetUrl('jun_mirror.png'),
    requiredFor: 'Act 3: Mirror Self-Observation',
  },
  {
    key: 'jun_silhouette',
    filename: 'jun_silhouette.png',
    label: 'Jun (Pacing Silhouette)',
    type: 'character',
    path: getAssetUrl('jun_silhouette.png'),
    requiredFor: 'Casefile & Witness Timelines',
  },
];

// List of all paths for preloader
export const PRELOAD_IMAGE_PATHS: string[] = PROJECT_ASSETS.map((a) => a.path);

/**
 * Resolves character image path accurately.
 * Explicitly resolves Jun's mirror portrait rather than generating an invalid 'jun_monster.png'.
 */
export function resolveCharacterAsset(
  id: 'mum' | 'ravi' | 'aisyah' | 'jun',
  variant: 'monster' | 'human',
  isMirrorScene: boolean = false
): { key: string; filename: string; path: string; label: string } {
  if (id === 'jun') {
    if (isMirrorScene) {
      return {
        key: 'jun_mirror',
        filename: 'jun_mirror.png',
        path: getAssetUrl('jun_mirror.png'),
        label: "Jun's Reflection in Mirror",
      };
    }
    return {
      key: 'jun_silhouette',
      filename: 'jun_silhouette.png',
      path: getAssetUrl('jun_silhouette.png'),
      label: 'Jun Silhouette',
    };
  }

  const key = `${id}_${variant}`;
  const filename = `${key}.png`;
  const asset = PROJECT_ASSETS.find((a) => a.key === key);
  return {
    key,
    filename,
    path: asset ? asset.path : getAssetUrl(filename),
    label: asset ? asset.label : `${id} (${variant})`,
  };
}

/**
 * Resolves background image path.
 */
export function resolveBackgroundAsset(
  sceneBg: 'bg_bedroom' | 'bg_living' | 'bg_hallway'
): { key: string; filename: string; path: string; label: string } {
  const filename = `${sceneBg}.png`;
  const asset = PROJECT_ASSETS.find((a) => a.key === sceneBg);
  return {
    key: sceneBg,
    filename,
    path: asset ? asset.path : getAssetUrl(filename),
    label: asset ? asset.label : sceneBg,
  };
}
