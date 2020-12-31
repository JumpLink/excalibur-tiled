import { Input, Engine, Loader } from 'excalibur';
import { MapResource } from '../dist/excalibur-tiled';

var game = new Engine({
  width: 500,
  height: 400,
  canvasElementId: 'game',
  pointerScope: Input.PointerScope.Canvas,
});

var start = (mapFile) => {
  var map = new MapResource(mapFile);
  var loader = new Loader([map]);

  game.currentScene.tileMaps = [];
  game.start(loader).then(function () {
    map.data.tilesets.forEach(function (ts) {
      console.log(ts.image, ts.imageTexture.isLoaded());
    });

    var tm = map.getTileMap();

    game.add(tm);
  });
};

document.getElementById('select-map').addEventListener('change', (e) => {
  var map = (e.target as HTMLSelectElement).value;

  if (map) {
    start(map);
  }

  return true;
});

start('test.json');
