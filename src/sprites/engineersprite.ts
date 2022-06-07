import { Position } from "../Position";
import { AnimatedSprite, SpriteAnimation } from "./animated_sprite";
import { grid_to_world_coords, Sprite, sprite_type } from "./sprite";

export class EngineerSprite extends Sprite {
    public animated_sprite: AnimatedSprite;
    public selected_texture: HTMLImageElement;
    public current_path: Position[];
    public previous_position: Position;
    public selected: boolean;
    ticks_to_move_one_square: number = 10;
    movement_tick_counter: number = 0;

    constructor(x: number, y: number, width: number, height: number, spritesheet: HTMLImageElement, uuid: number, selected_texture: HTMLImageElement )
    {
        super(x,y,width,height,spritesheet,uuid,sprite_type.engineer);
        this.animated_sprite= new AnimatedSprite(64, 64, [new SpriteAnimation(
            "N",
            0,
            17, //18 frames including original frame which we want to skip.
            30
        ), new SpriteAnimation(
            "NW",
            1,
            17, //18 frames including original frame which we want to skip.
            30
        ), new SpriteAnimation(
            "W",
            2,
            17, //18 frames including original frame which we want to skip.
            30
        ), new SpriteAnimation(
            "SW",
            3,
            17, //18 frames including original frame which we want to skip.
            30
        ), new SpriteAnimation(
            "S",
            4,
            17, //18 frames including original frame which we want to skip.
            30
        ), new SpriteAnimation(
            "SE",
            5,
            17, //18 frames including original frame which we want to skip.
            30
        ), new SpriteAnimation(
            "E",
            6,
            17, //18 frames including original frame which we want to skip.
            30
        ), new SpriteAnimation(
            "NE",
            7,
            17, //18 frames including original frame which we want to skip.
            30
        )],
            true,
        );
        this.selected_texture=selected_texture;
        this.current_path = [];
        this.previous_position = new Position(Math.floor(this.x), Math.floor(this.y));
    }

    public get_animation_direction(current_position: Position, next_position: Position): number {
        let x_differential = current_position.x - (next_position == undefined ? 0 : next_position.x);
        let y_differential = current_position.y - (next_position == undefined ? 0 : next_position.y);
        if (x_differential == 1 && y_differential == 1) {
            return 0;
        } else if (x_differential == 1 && y_differential == 0) {
            return 1;
        } else if (x_differential == 1 && y_differential == -1) {
            return 2;
        } else if (x_differential == 0 && y_differential == -1) {
            return 3;
        } else if (x_differential == -1 && y_differential == -1) {
            return 4;
        } else if (x_differential == -1 && y_differential == 0) {
            return 5;
        } else if (x_differential == -1 && y_differential == 1) {
            return 6;
        } else if (x_differential == 0 && y_differential == 1) {
            return 7;
        }
        else {
            return 3;
        }
    }
    public is_within_bounds(coords: Position): boolean {
        let sprite_world_coords = grid_to_world_coords(new Position(this.x, this.y))
        if (coords.x < sprite_world_coords.x + 55
            && coords.x > sprite_world_coords.x 
            && coords.y < sprite_world_coords.y + 55
            && coords.y > sprite_world_coords.y ) {
            return true;
        }
        return false;
    }
    public handle_tick() {        
        this.animated_sprite.set_animation(this.get_animation_direction(new Position(this.x,this.y), this.current_path[0]));

        this.movement_tick_counter++;
        if(this.movement_tick_counter==this.ticks_to_move_one_square)
        {
            this.movement_tick_counter=0;
            if(this.current_path.length>0)
            {
                this.previous_position=new Position(this.x,this.y);
                this.x=this.current_path[0].x;
                this.y=this.current_path[0].y;
                this.current_path.shift();
            }
        }

    }
    public tick(time: number) {
        this.handle_tick();
    }
    public update_path(path: Position[]) {
        if (this.current_path.length > 0) {
            this.previous_position = new Position(this.get_tile_pos().x, this.get_tile_pos().y);
        }
        this.movement_tick_counter=0;
        this.current_path = path;
    }

    public get_z_index(): number {
        let grid_coords = this.get_tile_pos();
        return 1 + ((grid_coords.x + grid_coords.y) * 2.)
    }
    public get_tile_pos(): Position {
        return new Position(this.x, this.y)
    }
    public draw() {
        this.animated_sprite.update();
        let canvas = document.getElementById('canvas') as
            HTMLCanvasElement;
        let context = canvas.getContext("2d");
        let render_location: Position;
        if(this.current_path[0]!=undefined)
        {
            let x_offset=(this.current_path[0].x-this.x)*(this.movement_tick_counter/this.ticks_to_move_one_square);
            let y_offset=(this.current_path[0].y-this.y)*(this.movement_tick_counter/this.ticks_to_move_one_square);
            render_location = grid_to_world_coords(new Position(this.x+x_offset,this.y+y_offset));
        }
        else
        {
            render_location = grid_to_world_coords(new Position(this.x,this.y));

        }
        let source_rect = this.animated_sprite.frame_fn().source_rectangle;
        let dest_size = this.animated_sprite.frame_fn().dest_size;

        context.drawImage(this.spritesheet, source_rect.x, source_rect.y, source_rect.w, source_rect.h, render_location.x-8, render_location.y+16, dest_size.x, dest_size.y);

        if (this.selected) {
            context.drawImage(this.selected_texture, 0, 0, 64, 64, render_location.x-8, render_location.y+16, dest_size.x, dest_size.y);
        }
    }
}