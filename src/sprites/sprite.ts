import { Position } from "../Position";
import { Rect } from "../Rect";

export enum sprite_type
{
    engineer,
    tile
}
/*To be overriden*/
export class Sprite
{
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public spritesheet: HTMLImageElement;
    public uuid: number;
    public type: sprite_type;

    /*To be overriden*/
    public get_z_index() : number
    {
        return 0;
    }

    /*To be overriden*/
    public get_tile_pos() : Position
    {
        return new Position(0,0);
    }

    /*To be overriden*/
    public draw()
    {
    }

    public  is_within_bounds(coords: Position) : boolean {
        let sprite_world_coords =new Position(this.x,this.y)
        if (coords.x < sprite_world_coords.x + 0.5
            && coords.x > sprite_world_coords.x
            && coords.y < sprite_world_coords.y + 0.5
            && coords.y > sprite_world_coords.y)
        {
            return true;
        }
        return false;
    }
}


export function  grid_to_world_coords(grid_pos: Position) : Position {
    return new Position(
        ((grid_pos.x * 64. / 2.0) - (grid_pos.y  * 64. / 2.0)) + 8.,
        ((grid_pos.y * 32. / 2.0) + (grid_pos.x * 32. / 2.0)) - 8.,
    );
}

export function  world_to_grid_coords(world_pos: Position) : Position //In Testing
{
    let world_x=world_pos.x-8.0;
    let world_y=world_pos.y+8.0;
    return new Position(
        (world_x + (2. * world_y)) / 64.,
        (world_y/16.)-((world_x+ (2. * world_y)) / 64.),
    );
}