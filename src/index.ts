import * as _ from 'lodash';
import {assets} from './asset_loader'
import { Mouse_Event, mouse_event } from './input_handling/mouse_event';
import { GameManager } from './model/GameManager';
import { GameState } from './model/GameState';
import { RequestQueue } from './model/Requests';
import { Pathfinder } from './pathfinding/pathfinder';
import { Position } from './Position';
import { AnimatedSprite, SpriteAnimation } from './sprites/animated_sprite';
import { EngineerSprite } from './sprites/engineersprite';
import {grid_to_world_coords, Sprite, sprite_type} from './sprites/sprite'
import {TileSprite} from './sprites/tilesprite'
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
gamestate.sprite_map=sprite_map_store;
gamestate.sprite_uuid_list=render_list;
gamestate.selected_entity=0;
let pathfinder_local = get_pathfinder(asset.tiled_map);
let  game_manager: GameManager = 
new GameManager(new RequestQueue(), new Map<number,GameState>(), gamestate,  0, pathfinder_local);

    //Add Engineer Sprite
        let position = new Position(8,8);
        let uuid: number = Math.floor(Math.random() * 2147483647);
        let engy_sprite = new EngineerSprite();
        engy_sprite.spritesheet= asset.builder_with_rock;
        engy_sprite.animated_sprite= new AnimatedSprite(64,64,[new SpriteAnimation(
                    "N",
                    0,
                     17, //18 frames including original frame which we want to skip.
                    30
        ),new SpriteAnimation(
                    "NW",
                    1,
                    17, //18 frames including original frame which we want to skip.
                    30
                ),new SpriteAnimation(
                    "W",
                     2,
                     17, //18 frames including original frame which we want to skip.
                     30
                ),new SpriteAnimation(
                     "SW",
                     3,
                     17, //18 frames including original frame which we want to skip.
                     30
                ),new SpriteAnimation(
                     "S",
                     4,
                     17, //18 frames including original frame which we want to skip.
                     30
                ),new SpriteAnimation(
                     "SE",
                     5,
                     17, //18 frames including original frame which we want to skip.
                     30
                ),new SpriteAnimation(
                     "E",
                     6,
                     17, //18 frames including original frame which we want to skip.
                     30
                ),new SpriteAnimation(
                     "NE",
                     7,
                     17, //18 frames including original frame which we want to skip.
                     30
                )],
                true,
            ),
            engy_sprite.x=position.x;
            engy_sprite.y=position.y;
            engy_sprite.width=64;
            engy_sprite.height=64;
            engy_sprite.type = sprite_type.engineer;
            engy_sprite.current_path=[new Position(Math.floor(position.x),Math.floor(position.y))];
            engy_sprite.previous_position=new Position(Math.floor(position.x),Math.floor(position.y));
            engy_sprite.uuid=uuid;
            engy_sprite.selected=false;
            engy_sprite.selected_texture=asset.selected_texture_spritesheet;
        game_manager.current_game_state.sprite_map.set(uuid,engy_sprite);
        game_manager.current_game_state.sprite_uuid_list.push(uuid);
    

        let  last_tick_time: number = new Date().getTime()/1000;
        let  tick_count =0;
        game_manager.current_game_state.process_tick(tick_count);
        let mouse_event: Mouse_Event = new Mouse_Event();

        canvas.addEventListener('click', (event: MouseEvent) => {
            // Check whether point is inside circle
            mouse_event.justPressed(new Position(event.offsetX,event.offsetY));
          });
let loop = ()=>{
    let canvas = document.getElementById('canvas') as
    HTMLCanvasElement;
    let context = canvas.getContext("2d");
    context.clearRect(0,0,canvas.width, canvas.height);
    if (mouse_event.wasJustPressed()){
        console.log(mouse_event.location);   
        let test_pos: Position = new Position(0,0);
        
        console.log(test_pos); 
        
        console.log(position);
        let posX = ((mouse_event.location.y * 2 / 32) + (mouse_event.location.x / 32))/2 ;
        let posY = (mouse_event.location.y * 2 / 32) - posX;
        console.log(posX,posY);
        game_manager.mouse_clicked(mouse_event.location);
        //Only enable if debugging mouse/touch positioning...
        //println!("World X: {}", world_vec.x);
        //println!("World Y: {}", world_vec.y);
        //println!("Grid X: {}", world_to_grid_coords(world_vec).x);
        //println!("Grid Y: {}", world_to_grid_coords(world_vec).y);
    }
    let current_time = new Date().getTime()/1000;
    while (current_time-last_tick_time>=0.04)
    {
        tick_count=tick_count+1;
        game_manager.process_tick(tick_count);
        last_tick_time=last_tick_time+0.04;
    }
    gamestate.render();
    window.requestAnimationFrame(loop)
}
    window.requestAnimationFrame(loop)
 return element;
}

function get_pathfinder(tilemap: TiledMap) : Pathfinder
{
    return new Pathfinder(tilemap);
}
function get_tilemap_spritelist(assets: assets) : Map<number,Sprite>
{
    let sprite_store: Map<number,Sprite> = new Map<number, Sprite>()

    for (let layer_num = 0; layer_num<assets.tiled_map.layers.length; layer_num++)
    {
        for (let y = 0; y<assets.tiled_map.height; y++)
        {
    
            for (let x = 0; x<assets.tiled_map.width; x++)
            {
                let uuid: number = Math.floor(Math.random() * 2147483647);
                let tile_sprite: TileSprite = new TileSprite();
                tile_sprite.x=x;
                tile_sprite.y=y;
                tile_sprite.spritesheet=assets.tilemap_spritesheet;
                tile_sprite.frame_number=assets.tiled_map.layers[layer_num].data
                [(y * assets.tiled_map.layers[layer_num].width + x)] - 1;
                tile_sprite.width=64.0;
                tile_sprite.height=32.0
                tile_sprite.uuid=uuid;
                tile_sprite.layer=layer_num;
                tile_sprite.type=sprite_type.tile;
                sprite_store.set(uuid, tile_sprite);
            }
        }
    }
    return sprite_store;
}

document.body.appendChild(main());