import builder_with_rock from './assets/spritesheet_rock.png'

export class assets
{
    public builder_with_rock : HTMLImageElement;
    constructor()
    {
        this.builder_with_rock=new Image();
        this.builder_with_rock.src = builder_with_rock
    }

} 