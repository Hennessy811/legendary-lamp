import { format } from 'date-fns';
import { app, DesktopCapturerSource } from 'electron';
import jetpack from 'fs-jetpack';

export interface Table {
  sourceId: string;
  thumbnailUrl: string;
  name: string;
  table: string;
  blinds: string;
  game: string;
  player: string;
}

export function saveThumbnail(
  table: Table,
  i: {
    source: DesktopCapturerSource;
    match: RegExpMatchArray | null;
  }
) {
  const fileName = `${table.table} | ${format(
    new Date(),
    'dd-MMM HH:mm:ss'
  )}.png`;
  const p = jetpack.path(app.getPath('userData'), 'dataset', fileName);
  jetpack.write(p, i.source.thumbnail.toPNG());
}
