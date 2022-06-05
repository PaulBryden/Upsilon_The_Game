import { Position } from "../Position";
import { Rect } from "../Rect";

export class AnimatedSprite
{
    tile_width: number;
    tile_height: number;
    animations: SpriteAnimation[];
    current_animation: number;
    time: number;
    frame: number;
    public playing: boolean;

    constructor(tile_width: number, tile_height: number, animations: SpriteAnimation[], playing: boolean)
    {
        this.tile_width= tile_width;
        this.tile_height = tile_height;
        this.animations=animations;
        this.current_animation = 0;
        this.time = 0.0;
        this.frame = 0;
        this.playing=playing;
    }
    
    public set_animation(animation: number) {
        this.current_animation = animation;

        let local_animation = this.animations[this.current_animation];
        this.frame %= local_animation.frames;
    }

    public current_animation_fn() : number {
        return this.current_animation
    }

    public set_frame( frame: number) {
        this.frame = frame;
    }

    public update() {
        let animation = this.animations[this.current_animation];

        if (this.playing) {
            this.time += new Date().getTime()/1000;
            if (this.time > 1. / animation.fps ) {
                this.frame += 1;
                this.time = 0.0;
            }
        }
        this.frame %= animation.frames;
    }

    public frame_fn() : AnimationFrame {
        let animation = this.animations[this.current_animation];

        return new AnimationFrame (
            new Rect(
                this.tile_width * this.frame,
                this.tile_height * animation.row,
                this.tile_width,
                this.tile_height,
            ),
            new Position(this.tile_width, this.tile_height));
        }
}

export class SpriteAnimation
{
    public name: String;
    public row: number;
    public frames: number;
    public fps: number;
    constructor(name: String, row: number, frames: number, fps: number)
    {
        this.name = name;
        this.row = row;
        this.frames = frames;
        this.fps = fps;
    }
}

export class AnimationFrame {
    public source_rectangle: Rect;
    public dest_size: Position;

    constructor(source_rectangle: Rect, dest_size: Position)
    {
        this.source_rectangle=source_rectangle;
        this.dest_size=dest_size;
    }
}