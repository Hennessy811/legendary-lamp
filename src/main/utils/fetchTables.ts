import { BrowserWindow, desktopCapturer } from 'electron';
import axios from 'axios';
import { saveThumbnail, Table } from './saveThumbnail';

export const listSources = async (mode: 'save' | 'parse') => {
  const sources = await desktopCapturer.getSources({
    types: ['window'],
    thumbnailSize: {
      height: 600,
      width: 600,
    },
  });
  const tables = sources
    .map((source) => ({
      source,
      match: source.name.match(
        /^(.*) - (.*) Play Money - (.*)$/
        // /^(.*) - (\$.*) USD - (.*) - Logged In as (.*)$/
        // /^(.*) - (\$.*) Play Money - (.*)$/
      ),
    }))
    .filter((i) => !!i.match)
    .map((i) => {
      const t = i.match!;
      const table = {
        sourceId: i.source.id,
        thumbnailUrl: i.source.thumbnail.toDataURL(),
        name: t?.[0],
        table: t?.[1],
        blinds: t?.[2],
        game: t?.[3],
        player: t?.[4],
      } as Table;
      if (mode === 'save') saveThumbnail(table, i);
      return table;
    });
  return tables;
};

let interval: any;

const TABLE_FETCHING_INTERVAL = 15000;

export const fetchTables = async (window: BrowserWindow | null) => {
  interval = setInterval(() => {
    listSources('save')
      .then((tables) =>
        axios.post('http://localhost:3000/api/tables', { tables })
      )
      .catch((e) => console.log('Backend error 🤷‍♂️' + (Math.random()*100).toFixed(2)));
  }, TABLE_FETCHING_INTERVAL);
};

export const stopFetchingTables = () => clearInterval(interval);
