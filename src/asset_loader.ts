import builder_with_rock_spritesheet from './assets/spritesheet_rock.png'
import tile_spritesheet from './assets/tileset.png'
import selected_spritesheet from './assets/selected.png'
import tiledmaplist from './assets/tiledmap.json'
import {TiledMap} from './tiledmap'
export class assets
{
    public builder_with_rock : HTMLImageElement;
    public tiled_map : TiledMap;
    public tilemap_spritesheet: HTMLImageElement
    public selected_texture_spritesheet: HTMLImageElement
    constructor()
    {
        this.builder_with_rock=new Image();
        this.builder_with_rock.src = builder_with_rock_spritesheet;
        this.tilemap_spritesheet=new Image();
        this.tilemap_spritesheet.src = tile_spritesheet;
        this.selected_texture_spritesheet=new Image();
        this.selected_texture_spritesheet.src = selected_spritesheet;
        this.tiled_map = tiledmaplist;
    }

} 