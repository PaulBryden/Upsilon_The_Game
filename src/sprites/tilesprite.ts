import { Rect } from "../Rect";
import { Sprite, sprite_type } from "./sprite";

export class TileSprite extends Sprite
{
    public layer: number;
    public frame_number: number;
    
    constructor(x: number, y: number, width: number, height: number, spritesheet: HTMLImageElement, uuid: number, layer: number, frame_number: number)
    {
        super(x,y,width,height,spritesheet,uuid,sprite_type.tile);
        this.layer=layer;
        this.frame_number=frame_number;
    }

    public get_z_index() : number
    {
        if (this.layer == 1 || this.frame_number>15 )
        {
           return 0;
        } else {
            return (2 + ((this.x + this.y)*2) )
        }
    }

    public draw()
    {
        let canvas = document.getElementById('canvas') as
        HTMLCanvasElement;
        let context = canvas.getContext("2d");
        let x_render_location = (this.x * this.width / 2.0) - (this.y * this.width / 2.0);
        let y_render_location = (this.y * this.height / 2.0) + (this.x* this.height / 2.0);
        let sprite_rect = this.get_sprite_rect();
        context.drawImage(this.spritesheet, sprite_rect.x,sprite_rect.y,sprite_rect.w,sprite_rect.h,x_render_location,y_render_location,64,64);
    }

     get_sprite_rect() : Rect 
    {
        let ix = this.frame_number;
        let sw = 64 ;
        let sh = 64 ;
        let sx = (ix % 20)  * (sw + 0 ) + 0 ;
        let sy = 0 ;
        // TODO: configure tiles margin
        return new Rect(sx + 1.1, sy + 1.1, sw - 2.2, sh - 2.2)
    }
}