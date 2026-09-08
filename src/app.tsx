import { useEffect, useState } from 'preact/hooks';

import NPCS from "./data/npcs.json";
import ARMORS from "./data/armors.json";
import ITEMS from "./data/items.json";
import RINGS from "./data/rings.json";
import SPELLS from "./data/spells.json";
import WEAPONS from "./data/weapons.json";
import MAPS from "./data/maps.json";
import BOSSES from "./data/bosses.json";

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
  ];

  const [language, setLanguage] = useState<Language>('english');
  const [reference, setReference] = useState<Language | null>(null);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    translate();
  }, [language, reference]);

  const additions = {
    'lucatiel mask': '86000000',
    'very good carving': '522',
    'help me carving': '524',
    'pickle pee, pump-a-rum crow': 'npc-ds3-199',
    'hawkwood': 'npc-ds3-206',
    'patches': 'npc-ds3-189',
    'soul of deacons of the deep': '729',
  };

  function initialize() {
    const originals: Record<string, string> = {};
    for (const item of dictionary) {
      const { id, english } = item;
      const keyword = english.toLowerCase();
      originals[keyword] = id;
    }
    Object.assign(originals, additions);

    const selector = "a";
    const anchors = document.querySelectorAll<HTMLAnchorElement>(selector);
    for (const anchor of anchors) {
      const text = anchor.innerText.trim();
      let keyword = text.toLowerCase();
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
        anchor.setAttribute("data-cstr-id", id);
        if (upgrade != null) {
          anchor.setAttribute("data-cstr-upgrade", upgrade);
        }
        if (amount != null) {
          anchor.setAttribute("data-cstr-amount", amount);
        }
      }
    }
    console.info("初始化完成");
  }

  function translate() {
    const selector = "a[data-cstr-id]";
    const anchors = document.querySelectorAll<HTMLAnchorElement>(selector);
    for (const anchor of anchors) {
      const id = anchor.getAttribute("data-cstr-id");
      const upgrade = anchor.getAttribute("data-cstr-upgrade") ?? '';
      const amount = anchor.getAttribute("data-cstr-amount");
      const item = dictionary.find((it) => it.id == id);
      if (item != null) {
        const name = item[language];
        let text = `${name}${upgrade}`;
        if (reference != null) {
          const name = item[reference];
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
      <div className={styles.header}>
        <span>Dark Souls III Cheat Sheet Translate</span>
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
            const language = event.currentTarget.value ?? null;
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
