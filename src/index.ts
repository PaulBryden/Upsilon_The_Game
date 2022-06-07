import * as _ from 'lodash';
import { assets } from './asset_loader'
import { Mouse_Event } from './input_handling/mouse_event';
import { GameManager } from './model/GameManager';
import { GameState } from './model/GameState';
import { RequestQueue, SpriteCreateRequest } from './model/Requests';
import { Pathfinder } from './pathfinding/pathfinder';
import { Position } from './Position';
import { AnimatedSprite, SpriteAnimation } from './sprites/animated_sprite';
import { EngineerSprite } from './sprites/engineersprite';
import { grid_to_world_coords, Sprite, sprite_type } from './sprites/sprite'
import { TileSprite } from './sprites/tilesprite'
import { TiledMap } from './tiledmap';
function main() {
    let canvas = document.getElementById('canvas') as
        HTMLCanvasElement;
    let context = canvas.getContext("2d");
    let asset = new assets();

    let sprite_map_store = get_tilemap_spritelist(asset);
    let render_list: number[] = [];
    sprite_map_store.forEach((sprite: Sprite, uuid: number) => {
        render_list.push(uuid);
    });
    let gamestate: GameState = new GameState();
    gamestate.sprite_map = sprite_map_store;
    gamestate.sprite_uuid_list = render_list;
    gamestate.selected_entity = 0;
    let pathfinder_local = get_pathfinder(asset.tiled_map);
    let game_manager: GameManager =
        new GameManager(new RequestQueue(), new Map<number, GameState>(), gamestate, 0, pathfinder_local,asset);

    //Add Engineer Sprite
    let uuid: number = Math.floor(Math.random() * 2147483647);
    let create_request: SpriteCreateRequest = new SpriteCreateRequest(50,uuid,new Position(8,8),sprite_type.engineer);
    let create_request_2: SpriteCreateRequest = new SpriteCreateRequest(100,uuid+1,new Position(10,10),sprite_type.engineer);
    game_manager.addRequest(create_request);
    game_manager.addRequest(create_request_2);


    let last_tick_time: number = new Date().getTime() / 1000;
    let tick_count = 0;
    game_manager.current_game_state.process_tick(tick_count);
    let mouse_event: Mouse_Event = new Mouse_Event();

    canvas.addEventListener('click', (event: MouseEvent) => {
        mouse_event.justPressed(new Position(event.offsetX, event.offsetY));
    });

    let loop = () => {
        context.fillRect(0, 0, canvas.width, canvas.height);
        if (mouse_event.wasJustPressed()) {
            game_manager.mouse_clicked(mouse_event.location);
        }
        let current_time = new Date().getTime() / 1000;
        while (current_time - last_tick_time >= 0.04) {
            tick_count = tick_count + 1;
            game_manager.process_tick(tick_count);
            last_tick_time = last_tick_time + 0.04;
        }
        gamestate.render();
        window.requestAnimationFrame(loop)
    }
    window.requestAnimationFrame(loop)
}

function get_pathfinder(tilemap: TiledMap): Pathfinder {
    return new Pathfinder(tilemap);
}
function get_tilemap_spritelist(assets: assets): Map<number, Sprite> {
    let sprite_store: Map<number, Sprite> = new Map<number, Sprite>()

    for (let layer_num = 0; layer_num < assets.tiled_map.layers.length; layer_num++) {
        for (let y = 0; y < assets.tiled_map.height; y++) {

            for (let x = 0; x < assets.tiled_map.width; x++) {
                let uuid: number = Math.floor(Math.random() * 2147483647);
                let tile_sprite: TileSprite = new TileSprite(x,y,64,32,assets.tilemap_spritesheet,uuid,layer_num,assets.tiled_map.layers[layer_num].data[(y * assets.tiled_map.layers[layer_num].width + x)] - 1);
                sprite_store.set(uuid, tile_sprite);
            }
        }
    }
    return sprite_store;
}

main();