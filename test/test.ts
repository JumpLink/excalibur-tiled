import { Input, Engine, Loader, Logger, LogLevel } from 'excalibur';
import { MapResource } from '../dist/excalibur-tiled';

Logger.getInstance().defaultLevel = LogLevel.Debug;

const game = new Engine({
  width: 500,
  height: 400,
  canvasElementId: 'game',
  pointerScope: Input.PointerScope.Canvas,
});

const start = (mapFile) => {
  const map = new MapResource(mapFile);
  const loader = new Loader([map]);
  const log = Logger.getInstance();

  game.currentScene.tileMaps = [];
  game.start(loader).then(function () {
    map.data.tilesets.forEach(function (ts) {
      log.info(ts.image, ts.imageTexture.isLoaded());
    });

    const tm = map.getTileMap();

    game.add(tm);
  });
};

document.getElementById('select-map').addEventListener('change', (e) => {
  const map = (e.target as HTMLSelectElement).value;

  if (map) {
    start(map);
  }

  return true;
});

start('test.json');
