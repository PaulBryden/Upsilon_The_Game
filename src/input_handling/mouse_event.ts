import { Position } from "../Position";

export class Mouse_Event
{
    just_pressed: boolean;
    location: Position;

    constructor()
    {
        this.just_pressed=false;
        this.location = new Position(0,0);
    }
    public justPressed(location: Position)
    {
        this.just_pressed=true;
        this.location=location;
    }
    public wasJustPressed() : boolean
    {
        if(this.just_pressed)
        {
            this.just_pressed=false; //clear event trap
            return true;
        }
    }
}