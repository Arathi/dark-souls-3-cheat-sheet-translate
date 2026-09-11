import { useEffect, useState } from 'preact/hooks';
import { version } from '../package.json';

import NPCS from "./data/npcs.json";
import ARMORS from "./data/armors.json";
import ITEMS from "./data/items.json";
import RINGS from "./data/rings.json";
import SPELLS from "./data/spells.json";
import WEAPONS from "./data/weapons.json";
import MAPS from "./data/maps.json";
import BOSSES from "./data/bosses.json";
import GESTURES from "./data/gestures.json";

import styles from './app.module.scss';

type Language = "chinese" | "japanese" | "english";

const REGEX_ITEM_UPGRADED = /^(.+)(\+[123])$/;
const REGEX_ITEM_AMOUNT = /^(.+) x(\d+)$/;

export function App() {
  const dictionary = [
    ...NPCS,
    ...ARMORS,
    ...ITEMS,
    ...RINGS,
    ...SPELLS,
    ...WEAPONS,
    ...MAPS,
    ...BOSSES,
    ...GESTURES,
  ];

  const [language, setLanguage] = useState<Language>('english');
  const [reference, setReference] = useState<Language | null>(null);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    translate();
  }, [language, reference]);

  const aliases = {
    // NPC
    'Orbeck Of Vinheim': 'npc-ds3-181', // 欧贝克
    'Patches': 'npc-ds3-189', // 帕奇
    'Pickle Pee, Pump-a-Rum Crow': 'npc-ds3-199', // 鸟巢
    'Hawkwood': 'npc-ds3-206', // 霍克伍德
    'Leonhard': 'npc-ds3-207', // 无名指的李奥纳德
    'Sword Master Saber': 'npc-ds3-218', // 专家
    // 装备
    'lucatiel mask': '86000000', // 米勒头，鲁卡提耶
    // 物品
    'Thank You Carving': '521', // 人脸，谢谢你
    'Very Good Carving': '522', // 人脸，不错啊
    'I\'m Sorry Carving': '523', // 人脸，很抱歉
    'Help Me Carving': '524', // 人脸，救救我
    'Soul of Deacons of the Deep': '729', // 王魂，幽邃主教群
    'Loretta\'s bone': '2118', // 罗蕾塔的骨头
    'Warriors of Sunlight': '10040', // 太阳战士
  };

  function initialize() {
    const originals: Record<string, string> = {};
    for (const item of dictionary) {
      const { id, english } = item;
      const keyword = english; // .toLowerCase();
      originals[keyword] = id;
    }
    Object.assign(originals, aliases);

    let texts: HTMLElement[] = [];

    {
      const selector = "a";
      const anchors = document.querySelectorAll<HTMLAnchorElement>(selector);
      texts.push(...anchors);
    }

    {
      const selector = "#Master_of_Expression_col span.item_content strong";
      const strongs = document.querySelectorAll<HTMLElement>(selector);
      texts.push(...strongs);
    }

    for (const node of texts) {
      const text = node.innerText;
      let keyword = text;
      let upgrade: string | null = null;
      let amount: string | null = null;

      {
        const matches = REGEX_ITEM_UPGRADED.exec(keyword);
        if (matches != null) {
          keyword = matches[1];
          upgrade = matches[2];
        }
      }

      {
        const matches = REGEX_ITEM_AMOUNT.exec(keyword);
        if (matches != null) {
          keyword = matches[1];
          amount = matches[2];
        }
      }

      const id = originals[keyword];
      if (id != null) {
        node.setAttribute("data-cstr-id", id);
        if (upgrade != null) {
          node.setAttribute("data-cstr-upgrade", upgrade);
        }
        if (amount != null) {
          node.setAttribute("data-cstr-amount", amount);
        }
      }
    }
    console.info("初始化完成");
  }

  function translate() {
    const selector = "[data-cstr-id]";
    const anchors = document.querySelectorAll<HTMLAnchorElement>(selector);
    for (const anchor of anchors) {
      const id = anchor.getAttribute("data-cstr-id");
      const upgrade = anchor.getAttribute("data-cstr-upgrade") ?? '';
      const amount = anchor.getAttribute("data-cstr-amount");
      const item = dictionary.find((it) => it.id == id);
      if (item != null) {
        let name = item[language];
        if (name.startsWith("??")) name = name.substring(2);
        let text = `${name}${upgrade}`;
        if (reference != null) {
          let name = item[reference];
          if (name.startsWith("??")) name = name.substring(2);
          text += ` (${name}${upgrade})`;
        }
        if (amount != null) {
          text += ` x${amount}`;
        }
        anchor.innerText = text;
      }
    }
    console.info("翻译完成");
  }

  return (
    <div className={styles.app}>
      <div className={styles.version}>
        <span>v{version}</span>
      </div>
      <div className={styles.item}>
        <span>主要语言</span>
        <select
          value={language}
          style={{ flex: 1 }}
          onChange={(event) => {
            const language = event.currentTarget.value;
            setLanguage(language as Language);
          }}
        >
          <option value="english">English</option>
          <option value="chinese">中文</option>
          <option value="japanese">日本語</option>
        </select>
      </div>
      <div className={styles.item}>
        <span>参考语言</span>
        <select
          value={reference ?? ""}
          style={{ flex: 1 }}
          onChange={(event) => {
            let language: string | null = event.currentTarget.value ?? null;
            if (language == "") {
              language = null;
            }
            setReference(language as Language | null);
          }}
        >
          <option value="">不显示</option>
          <option value="english">English</option>
          <option value="chinese">中文</option>
          <option value="japanese">日本語</option>
        </select>
      </div>
    </div>
  );
}
