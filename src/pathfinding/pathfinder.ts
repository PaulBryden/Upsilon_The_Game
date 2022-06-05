import { Position } from "../Position";
import { LayersEntity, TiledMap } from "../tiledmap"


export class TilePositionKeyEntry {
    position: Position;
    key: String;
    constructor(key: String,position: Position )
    {
        this.position=position;
        this.key=key;
    }
}

function tile_position_to_key(x: number, y: number) : String {
    return [x.toString(), y.toString()].join("x")
}
function  get_tile_at(layers: LayersEntity, x: number, y: number) : number
{
    return layers.data[Math.floor((y*(layers.width))+x)];
}

export  class Pathfinder {
    tilemap: TiledMap

    constructor(map: TiledMap) {
        this.tilemap = map;
    }
    public tile_is_walkable(x: number, y: number) : boolean {
        if (x >= 0 && y >= 0) {
            //remember to decrement the tile number.
            return !this.tilemap.tilesets[0].tiles
                [get_tile_at(this.tilemap.layers[0],x, y )- 1 ]
                .properties[0]
                .value;
        } else {
            return false;
        }
    }

    public find_path(start: Position, target: Position) : Position[] {
        let path: Position[] = [];
        if (!this.tile_is_walkable(target.x, target.y)) {
            return path;
        }
        if (!this.tile_is_walkable(start.x, start.y)) {
            return path;
        }
        let queue: Position[] = [];
        let parent_for_key: Map<String, TilePositionKeyEntry> = new Map();

        let start_key = tile_position_to_key(start.x, start.y);
        let target_key = tile_position_to_key(target.x, target.y);
        parent_for_key.set(
            start_key,
            new TilePositionKeyEntry( "",new Position ( 0, 0 )),
        );
        queue.push(start);
        while (queue.length > 0) {
            let pos: Position = queue.shift();
            let current_key = tile_position_to_key(pos.x, pos.y);

            if (current_key == target_key) {
                break;
            }

            let  neighbours: Position[] = [];
            if (pos.y - 1 >= 0){
                neighbours.push(new Position (
                    pos.x,
                    pos.y - 1,
                ));
                if (pos.x - 1 >= 0 ){
                    neighbours.push(new Position (
                         pos.x - 1,
                         pos.y - 1,
                    ));
                }
                if (pos.x + 1 < this.tilemap.layers[0].width) {
                    neighbours.push(new Position(
                        pos.x + 1,
                        pos.y - 1,
                    ));
                }
            }
            if (pos.x - 1 >= 0) {
                neighbours.push(new Position (
                    pos.x - 1,
                    pos.y,
                ));
            }
            if (pos.x + 1 < this.tilemap.layers[0].width){
                neighbours.push(new Position (
                    pos.x + 1,
                    pos.y,
                ));
            }
            if (pos.y + 1 < this.tilemap.layers[0].height) {
                neighbours.push(new Position (
                    pos.x,
                    pos.y + 1,
                ));
                
                if (pos.x - 1 >= 0 ){
                    neighbours.push(new Position (
                        pos.x - 1,
                        pos.y + 1,
                    ));
                }
                if (pos.x + 1 < this.tilemap.layers[0].width) {
                    neighbours.push(new Position(
                        pos.x + 1,
                        pos.y + 1,
                    ));
                }
            }
            neighbours.forEach((neighbour: Position) => {
                if (!this.tile_is_walkable(neighbour.x, neighbour.y)) {
                    return;
                }
                let key = tile_position_to_key(neighbour.x, neighbour.y);
                if (parent_for_key.has(key)) {
                    return;
                }
                parent_for_key.set(
                    key,
                    new TilePositionKeyEntry(
                        current_key,
                        neighbour,
                    ),
                );
                queue.push(neighbour);
            });
        };
        let  current_key = target_key;
        let  current_pos;

        while (current_key != start_key) {
            let tile_pos_key_entry: TilePositionKeyEntry = parent_for_key.get(current_key);
            current_key = tile_pos_key_entry.key;
            current_pos = tile_pos_key_entry.position;
            path.push(current_pos);
        }
        path.reverse();

        return path;
    }
}