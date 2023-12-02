/** @name CONFIG.MB */
export const config = {};

config.flagScope = "mythicbastionland";

config.actorTypes = {
  knight: "knight",
  npc: "npc",
  creature: "creature",
  steed: "steed",
  warband: "warband"
};

config.itemTypes = {
  ability: "ability",
  weapon: "weapon",
  coat: "coat",
  plate: "plate",
  shield: "shield",
  helm: "helm",
  passion: "passion",
  misc: "misc",
  scar: "scar"
};

config.rank = {
  "knight_errant": "knight_errant",
  "knight_gallant": "knight_gallant",
  "knight_tenant": "knight_tenant",
  "knight_dominant": "knight_dominant",
  "knight_radiant": "knight_radiant"
};

config.age = {
  "young": "young",
  "mature": "mature",
  "old": "old"
};

config.actorDefaults = {
  [config.actorTypes.knight]: {
    img: "systems/mythicbastionland/tokens/actors/knight.png",
    prototypeToken: {
      actorLink: true,
      disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
      vision: true,
    },
  },
  [config.actorTypes.npc]: {
    img: "systems/mythicbastionland/tokens/actors/npc.png",
    prototypeToken: {
      actorLink: true,
      disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
      vision: true,
    },
  },
  [config.actorTypes.creature]: {
    img: "systems/mythicbastionland/tokens/actors/creature.png",
    prototypeToken: {
      actorLink: false,
      disposition: CONST.TOKEN_DISPOSITIONS.HOSTILE,
      vision: false,
    },
  },
  [config.actorTypes.steed]: {
    img: "systems/mythicbastionland/tokens/actors/steed.png",
    prototypeToken: {
      actorLink: true,
      disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
      vision: true,
    },
  },
  [config.actorTypes.warband]: {
    img: "systems/mythicbastionland/tokens/actors/warband.png",
    prototypeToken: {
      actorLink: true,
      disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
      vision: true,
    },
  },
};

config.itemDefaults = {
  [config.itemTypes.ability]: {
    img: "systems/mythicbastionland/tokens/items/ability.png",
  },
  [config.itemTypes.coat]: {
    img: "systems/mythicbastionland/tokens/items/coat.png",
  },
  [config.itemTypes.helm]: {
    img: "systems/mythicbastionland/tokens/items/helm.png",
  },
  [config.itemTypes.misc]: {
    img: "systems/mythicbastionland/tokens/items/misc.png",
  },
  [config.itemTypes.passion]: {
    img: "systems/mythicbastionland/tokens/items/passion.png",
  },
  [config.itemTypes.plate]: {
    img: "systems/mythicbastionland/tokens/items/plate.png",
  },
  [config.itemTypes.scar]: {
    img: "systems/mythicbastionland/tokens/items/scar.png",
  },
  [config.itemTypes.shield]: {
    img: "systems/mythicbastionland/tokens/items/shield.png",
  },
  [config.itemTypes.weapon]: {
    img: "systems/mythicbastionland/tokens/items/weapon.png",
  },                
}
CONFIG.MB = config;
